/*
 * @(#)sessionRepository.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Session, CreateSessionDTO, RepeatType } from "../models/session";

// Armazenamento em memória (banco de dados simulado)
let sessions: Session[] = [];

/**
 * Repositório para gerenciar dados de sessão
 * Esta camada abstrai a fonte de dados (atualmente em memória, poderia ser API ou armazenamento local)
 */
export class SessionRepository {
  /**
   * Obtém todas as sessões ordenadas por data de criação (mais recentes primeiro)
   */
  getAllSessions(): Session[] {
    return [...sessions].sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Verifica se uma sessão está ativa considerando a recorrência
   */
  private isSessionActive(session: Session, now: number): boolean {
    // Obtém os horários do dia (em segundos desde o início do dia)
    const sessionStartTime = session.startSessionInSec % 86400;
    const sessionEndTime = session.endSessionInSec % 86400;
    const currentTime = now % 86400;
    
    // Para sessões sem repetição, usa a data original
    if (session.repeatType === 'none') {
      return session.startSessionInSec <= now && session.endSessionInSec > now;
    }

    // Obtém o dia da semana atual (0 = domingo, 1 = segunda, ..., 6 = sábado)
    const currentDayOfWeek = new Date(now * 1000).getDay();
    
    // Verifica se a data original da sessão ainda não chegou
    const originalDate = new Date(session.startSessionInSec * 1000).setHours(0, 0, 0, 0) / 1000;
    const currentDate = new Date(now * 1000).setHours(0, 0, 0, 0) / 1000;
    
    if (originalDate > currentDate) {
      return false; // Sessão ainda não começou
    }
    
    console.log('Verificando sessão:', {
      title: session.title,
      repeatType: session.repeatType,
      repeatDays: session.repeatDays,
      currentDayOfWeek,
      sessionStartTime,
      sessionEndTime,
      currentTime,
      originalDate,
      currentDate,
      isAfterEnd: currentTime > sessionEndTime,
      isBeforeStart: currentTime < sessionStartTime
    });

    // Verifica se o dia atual está nos dias de repetição
    let isDayValid = false;
    switch (session.repeatType) {
      case 'daily':
        isDayValid = true;
        break;
        
      case 'weekdays':
        isDayValid = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
        break;
        
      case 'weekends':
        isDayValid = currentDayOfWeek === 0 || currentDayOfWeek === 6;
        break;
        
      case 'custom':
        isDayValid = session.repeatDays?.includes(currentDayOfWeek) || false;
        break;
        
      default:
        return false;
    }

    // Se não é um dia válido para a sessão, retorna falso
    if (!isDayValid) {
      return false;
    }

    // Verifica se está dentro do horário da sessão
    // Se o horário atual é maior que o horário de término, a sessão não está mais ativa
    if (currentTime > sessionEndTime) {
      return false;
    }

    // Se o horário atual é menor que o horário de início, a sessão ainda não começou
    if (currentTime < sessionStartTime) {
      return false;
    }

    return true;
  }

  /**
   * Encontra o próximo dia válido para uma sessão
   */
  private getNextValidDay(session: Session, currentDayOfWeek: number): number | null {
    switch (session.repeatType) {
      case 'none':
        return null; // Sessões sem repetição não têm próximo dia
        
      case 'daily':
        return (currentDayOfWeek + 1) % 7; // Próximo dia
        
      case 'weekdays':
        if (currentDayOfWeek === 5) return 1; // Sexta -> Segunda
        if (currentDayOfWeek === 6) return 1; // Sábado -> Segunda
        return currentDayOfWeek + 1; // Próximo dia útil
        
      case 'weekends':
        if (currentDayOfWeek === 0) return 6; // Domingo -> Sábado
        if (currentDayOfWeek < 6) return 6; // Dia da semana -> Sábado
        return 0; // Sábado -> Domingo
        
      case 'custom':
        if (!session.repeatDays?.length) return null;
        
        // Encontra o próximo dia na lista de dias
        const nextDay = session.repeatDays.find(day => day > currentDayOfWeek);
        if (nextDay !== undefined) return nextDay;
        
        // Se não encontrou, volta para o primeiro dia da lista
        return session.repeatDays[0];
        
      default:
        return null;
    }
  }

  /**
   * Verifica se uma sessão é futura considerando a recorrência
   */
  private isSessionUpcoming(session: Session, now: number): boolean {
    // Obtém os horários do dia (em segundos desde o início do dia)
    const sessionStartTime = session.startSessionInSec % 86400;
    const currentTime = now % 86400;
    
    // Obtém o dia da semana atual (0 = domingo, 1 = segunda, ..., 6 = sábado)
    const currentDayOfWeek = new Date(now * 1000).getDay();
    
    // Para sessões sem repetição
    if (session.repeatType === 'none') {
      return session.startSessionInSec > now;
    }
    
    // Verifica se a sessão começa mais tarde hoje
    const isValidToday = (() => {
      switch (session.repeatType) {
        case 'daily':
          return true;
        case 'weekdays':
          return currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
        case 'weekends':
          return currentDayOfWeek === 0 || currentDayOfWeek === 6;
        case 'custom':
          return session.repeatDays?.includes(currentDayOfWeek) || false;
        default:
          return false;
      }
    })();
    
    // Se é um dia válido e a sessão ainda não começou hoje
    if (isValidToday && sessionStartTime > currentTime) {
      return true;
    }
    
    // Se não é hoje, verifica se tem próximo dia válido
    return this.getNextValidDay(session, currentDayOfWeek) !== null;
  }

  /**
   * Obtém a sessão ativa (atual ou próxima)
   */
  getActiveSession(): Session | undefined {
    const now = Math.floor(Date.now() / 1000);
    
    console.log('Verificando sessão ativa...');
    console.log('Timestamp atual:', now);
    console.log('Total de sessões:', sessions.length);
    
    // Primeiro verifica se há uma sessão atualmente ativa
    const currentSession = sessions.find(session => this.isSessionActive(session, now));
    
    if (currentSession) {
      console.log('Sessão ativa encontrada:', currentSession.title);
      return currentSession;
    }
    
    // Se não houver sessão atual, encontra a próxima sessão agendada
    const upcomingSessions = sessions.filter(session => {
      // Se a sessão não tem repetição, verifica se é futura
      if (session.repeatType === 'none') {
        return session.startSessionInSec > now;
      }

      // Para sessões com repetição
      const sessionStartTime = session.startSessionInSec % 86400;
      const currentTime = now % 86400;
      const currentDayOfWeek = new Date(now * 1000).getDay();
      
      // Se já passou do horário hoje, verifica o próximo dia válido
      if (currentTime > sessionStartTime) {
        return this.getNextValidDay(session, currentDayOfWeek) !== null;
      }

      // Se ainda não chegou no horário hoje, verifica se o dia atual é válido
      let isDayValid = false;
      switch (session.repeatType) {
        case 'daily':
          isDayValid = true;
          break;
        case 'weekdays':
          isDayValid = currentDayOfWeek >= 1 && currentDayOfWeek <= 5;
          break;
        case 'weekends':
          isDayValid = currentDayOfWeek === 0 || currentDayOfWeek === 6;
          break;
        case 'custom':
          isDayValid = session.repeatDays?.includes(currentDayOfWeek) || false;
          break;
      }

      return isDayValid;
    });

    if (upcomingSessions.length === 0) {
      console.log('Nenhuma sessão futura encontrada');
      return undefined;
    }
    
    // Ordena por horário de início e dia da semana
    const nextSession = upcomingSessions.sort((a, b) => {
      const currentDayOfWeek = new Date(now * 1000).getDay();
      const aNextDay = this.getNextValidDay(a, currentDayOfWeek) || 7;
      const bNextDay = this.getNextValidDay(b, currentDayOfWeek) || 7;
      
      if (aNextDay !== bNextDay) return aNextDay - bNextDay;
      
      const aTime = a.startSessionInSec % 86400;
      const bTime = b.startSessionInSec % 86400;
      return aTime - bTime;
    })[0];
    
    console.log('Próxima sessão:', nextSession.title);
    return nextSession;
  }

  /**
   * Adiciona uma nova sessão
   */
  createSession(sessionData: CreateSessionDTO): Session {
    const newSession: Session = {
      ...sessionData,
      id: uuidv4(),
      createdAt: Math.floor(Date.now() / 1000),
      repeatType: sessionData.repeatType || 'none',
      repeatDays: sessionData.repeatDays || []
    };
    
    console.log('Nova sessão criada:', {
      id: newSession.id,
      title: newSession.title,
      start: new Date(newSession.startSessionInSec * 1000).toLocaleString(),
      end: new Date(newSession.endSessionInSec * 1000).toLocaleString(),
      repeatType: newSession.repeatType,
      repeatDays: newSession.repeatDays
    });
    
    sessions.push(newSession);
    return newSession;
  }

  /**
   * Exclui uma sessão pelo ID
   */
  deleteSession(id: string): boolean {
    const initialLength = sessions.length;
    sessions = sessions.filter(session => session.id !== id);
    return sessions.length < initialLength;
  }

  /**
   * Obtém uma sessão pelo ID
   */
  getSessionById(id: string): Session | undefined {
    return sessions.find(session => session.id === id);
  }

  /**
   * Atualiza uma sessão existente
   */
  updateSession(id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt'>>): Session | undefined {
    const sessionIndex = sessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) return undefined;
    
    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      ...sessionData
    };
    
    return sessions[sessionIndex];
  }
}

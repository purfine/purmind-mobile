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
    }

    // A sessão está ativa se:
    // 1. O dia é válido
    // 2. O horário atual está entre início e fim
    return isDayValid && currentTime >= sessionStartTime && currentTime < sessionEndTime;
  }

  /**
   * Obtém o próximo dia válido para uma sessão recorrente
   */
  private getNextValidDay(session: Session, currentDayOfWeek: number): number | null {
    let nextDay = currentDayOfWeek;
    const maxDays = 7; // Evita loop infinito
    let count = 0;

    // Avança para o próximo dia
    nextDay = (nextDay + 1) % 7;

    while (count < maxDays) {
      let isDayValid = false;
      
      switch (session.repeatType) {
        case 'daily':
          isDayValid = true;
          break;
        case 'weekdays':
          isDayValid = nextDay >= 1 && nextDay <= 5;
          break;
        case 'weekends':
          isDayValid = nextDay === 0 || nextDay === 6;
          break;
        case 'custom':
          isDayValid = session.repeatDays?.includes(nextDay) || false;
          break;
      }

      if (isDayValid) {
        return nextDay;
      }

      nextDay = (nextDay + 1) % 7;
      count++;
    }

    return null;
  }

  /**
   * Calcula o timestamp da próxima ocorrência de uma sessão
   */
  private getNextOccurrence(session: Session, now: number): number | null {
    const currentTime = now % 86400;
    const currentDayOfWeek = new Date(now * 1000).getDay();
    const todayMidnight = new Date(now * 1000).setHours(0, 0, 0, 0) / 1000;
    
    // Para sessões sem repetição
    if (session.repeatType === 'none') {
      return session.startSessionInSec > now ? session.startSessionInSec : null;
    }

    // Se ainda não chegou no horário hoje e o dia é válido
    if (currentTime < (session.startSessionInSec % 86400)) {
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
      
      if (isDayValid) {
        return todayMidnight + (session.startSessionInSec % 86400);
      }
    }

    // Procura o próximo dia válido
    const nextDay = this.getNextValidDay(session, currentDayOfWeek);
    if (nextDay === null) return null;

    // Calcula quantos dias faltam
    const daysUntilNext = nextDay > currentDayOfWeek 
      ? nextDay - currentDayOfWeek 
      : 7 - (currentDayOfWeek - nextDay);

    // Retorna o timestamp do próximo início
    return todayMidnight + (daysUntilNext * 86400) + (session.startSessionInSec % 86400);
  }

  /**
   * Obtém a sessão ativa (atual ou próxima)
   */
  getActiveSession(): Session | undefined {
    const now = Math.floor(Date.now() / 1000);
    
    // Primeiro verifica se há uma sessão atualmente ativa
    const currentSession = sessions.find(session => this.isSessionActive(session, now));
    
    if (currentSession) {
      return currentSession;
    }
    
    // Se não houver sessão atual, encontra a próxima sessão agendada
    const upcomingSessions = sessions
      .map(session => ({
        session,
        nextStart: this.getNextOccurrence(session, now)
      }))
      .filter(item => item.nextStart !== null)
      .sort((a, b) => (a.nextStart || 0) - (b.nextStart || 0));

    if (upcomingSessions.length === 0) {
      return undefined;
    }

    return upcomingSessions[0].session;
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

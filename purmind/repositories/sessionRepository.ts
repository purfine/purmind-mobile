/*
 * @(#)sessionRepository.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

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
   * Obtém a sessão ativa (atual ou próxima)
   */
  getActiveSession(): Session | undefined {
    const now = Math.floor(Date.now() / 1000);
    
    // Primeiro verifica se há uma sessão atualmente ativa
    const currentSession = sessions.find(session => 
      session.startSessionInSec <= now && session.endSessionInSec > now
    );
    
    if (currentSession) return currentSession;
    
    // Se não houver sessão atual, encontra a próxima sessão agendada
    const upcomingSessions = sessions.filter(session => session.startSessionInSec > now);
    if (upcomingSessions.length === 0) return undefined;
    
    // Retorna a sessão que começará mais cedo
    return upcomingSessions.sort((a, b) => a.startSessionInSec - b.startSessionInSec)[0];
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

/*
 * @(#)useSession.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import { useState, useEffect, useCallback } from 'react';
import { Session, CreateSessionDTO } from '@/models/session';
import { scheduleService } from '@/services/blocks/scheduleService';

/**
 * Hook personalizado para gerenciar sessões
 * Fornece uma interface limpa para os componentes interagirem com os serviços de sessão
 */
export const useSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega todas as sessões
  const loadSessions = useCallback(() => {
    try {
      setLoading(true);
      const allSessions = scheduleService.getAllSessions();
      setSessions(allSessions);
      
      const active = scheduleService.getActiveSession();
      setActiveSession(active);
      
      setError(null);
    } catch (err) {
      setError('Erro ao carregar sessões');
      console.error('Erro ao carregar sessões:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cria uma nova sessão
  const createSession = useCallback(async (sessionData: CreateSessionDTO) => {
    try {
      setLoading(true);
      const result = scheduleService.createSession(sessionData);
      
      if (result.success && result.session) {
        // Reload sessions to get the updated list
        loadSessions();
        return { success: true };
      } else {
        setError(result.error || 'Erro ao criar sessão');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Erro ao criar sessão';
      setError(errorMessage);
      console.error(errorMessage, err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadSessions]);

  // Exclui uma sessão
  const deleteSession = useCallback((id: string) => {
    try {
      setLoading(true);
      const success = scheduleService.deleteSession(id);
      
      if (success) {
        // Reload sessions to get the updated list
        loadSessions();
        return { success: true };
      } else {
        const errorMessage = 'Sessão não encontrada';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Erro ao excluir sessão';
      setError(errorMessage);
      console.error(errorMessage, err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadSessions]);

  // Métodos auxiliares para formatação de data/hora
  const formatDate = useCallback((date: Date) => {
    return scheduleService.formatDate(date);
  }, []);

  const formatTime = useCallback((date: Date) => {
    return scheduleService.formatTime(date);
  }, []);

  // Converte entre objetos Date e timestamp em segundos
  const dateToSeconds = useCallback((date: Date) => {
    return scheduleService.dateToSeconds(date);
  }, []);

  const secondsToDate = useCallback((seconds: number) => {
    return scheduleService.secondsToDate(seconds);
  }, []);

  // Carrega sessões na montagem inicial
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    activeSession,
    loading,
    error,
    createSession,
    deleteSession,
    loadSessions,
    formatDate,
    formatTime,
    dateToSeconds,
    secondsToDate
  };
};

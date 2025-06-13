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
  const [nextSession, setNextSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega todas as sessões
  const loadSessions = useCallback(() => {
    try {
      setLoading(true);
      const allSessions = scheduleService.getAllSessions();
      setSessions(allSessions);
      
      // Encontra a sessão ativa atual
      const now = Math.floor(Date.now() / 1000);
      const active = allSessions.find(session => {
        const startTime = session.startSessionInSec % 86400;
        const endTime = session.endSessionInSec % 86400;
        const currentTime = now % 86400;
        
        // Verifica se a sessão está ativa agora
        return currentTime >= startTime && currentTime < endTime;
      });
      
      setActiveSession(active);
      
      // Se não houver sessão ativa, procura a próxima
      if (!active) {
        const next = scheduleService.getActiveSession();
        setNextSession(next);
      } else {
        setNextSession(undefined);
      }
      
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
      const result = await scheduleService.createSession(sessionData);
      if (result.success) {
        loadSessions(); // Recarrega as sessões após criar uma nova
        return result;
      }
      setError(result.error || 'Erro ao criar sessão');
      return result;
    } catch (err) {
      const error = 'Erro ao criar sessão';
      setError(error);
      console.error(error, err);
      return { success: false, error };
    }
  }, [loadSessions]);

  // Exclui uma sessão
  const deleteSession = useCallback((id: string) => {
    try {
      const success = scheduleService.deleteSession(id);
      if (success) {
        loadSessions(); // Recarrega as sessões após excluir
      }
      return success;
    } catch (err) {
      const error = 'Erro ao excluir sessão';
      setError(error);
      console.error(error, err);
      return false;
    }
  }, [loadSessions]);

  // Atualiza o status das sessões periodicamente
  useEffect(() => {
    loadSessions();
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(() => {
      loadSessions();
    }, 30000);

    return () => clearInterval(interval);
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

  return {
    sessions,
    activeSession,
    nextSession,
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

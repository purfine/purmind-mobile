/*
 * @(#)scheduleService.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import { Session, CreateSessionDTO, RepeatType } from "@/models/session";
import { SessionRepository } from "@/repositories/sessionRepository";

/**
 * Serviço para manipular a lógica de negócios de agendamento de sessões
 */
export class ScheduleService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }

  /**
   * Obtém todas as sessões
   */
  getAllSessions(): Session[] {
    return this.sessionRepository.getAllSessions();
  }

  /**
   * Obtém a sessão ativa (atual ou próxima)
   */
  getActiveSession(): Session | undefined {
    return this.sessionRepository.getActiveSession();
  }

  /**
   * Cria uma nova sessão com validação
   */
  createSession(sessionData: CreateSessionDTO): { success: boolean; session?: Session; error?: string } {
    // Valida os dados da sessão
    if (!sessionData.title || sessionData.title.trim() === '') {
      return { success: false, error: 'O título da sessão é obrigatório' };
    }

    if (sessionData.startSessionInSec >= sessionData.endSessionInSec) {
      return { success: false, error: 'A hora de término deve ser posterior à hora de início' };
    }

    // Para o tipo de repetição personalizada, valida que os dias foram selecionados
    if (sessionData.repeatType === 'custom' && (!sessionData.repeatDays || sessionData.repeatDays.length === 0)) {
      return { success: false, error: 'Selecione pelo menos um dia da semana para repetição personalizada' };
    }

    try {
      const session = this.sessionRepository.createSession(sessionData);
      return { success: true, session };
    } catch (error) {
      return { success: false, error: 'Erro ao criar sessão' };
    }
  }

  /**
   * Exclui uma sessão
   */
  deleteSession(id: string): boolean {
    return this.sessionRepository.deleteSession(id);
  }

  /**
   * Formata a data para exibição (auxiliar de UI)
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formata a hora para exibição (auxiliar de UI)
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Converte Date para timestamp em segundos
   */
  dateToSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  /**
   * Converte timestamp em segundos para Date
   */
  secondsToDate(seconds: number): Date {
    return new Date(seconds * 1000);
  }
}

// Exporta uma instância singleton para uso em todo o aplicativo
export const scheduleService = new ScheduleService();

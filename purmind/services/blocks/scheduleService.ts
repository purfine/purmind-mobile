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
    try {
      console.log('Criando nova sessão:', {
        title: sessionData.title,
        startTime: new Date(sessionData.startSessionInSec * 1000).toLocaleString(),
        endTime: new Date(sessionData.endSessionInSec * 1000).toLocaleString(),
        repeatType: sessionData.repeatType,
        repeatDays: sessionData.repeatDays,
        blockedApps: sessionData.blockedApps.map(app => app.appName)
      });

      // Valida os dados da sessão
      if (!sessionData.title || sessionData.title.trim() === '') {
        console.log('Erro: Título da sessão é obrigatório');
        return { success: false, error: 'O título da sessão é obrigatório' };
      }

      if (sessionData.startSessionInSec >= sessionData.endSessionInSec) {
        console.log('Erro: Hora de término deve ser posterior à hora de início');
        return { success: false, error: 'A hora de término deve ser posterior à hora de início' };
      }

      // Validar aplicativos bloqueados
      if (!sessionData.blockedApps || sessionData.blockedApps.length === 0) {
        console.log('Erro: Nenhum aplicativo selecionado para bloquear');
        return { success: false, error: 'Selecione pelo menos um aplicativo para bloquear' };
      }

      // Validação e processamento dos dados de repetição
      let processedData = { ...sessionData };
      
      switch (sessionData.repeatType) {
        case 'none':
          // Para 'Não repetir', não precisa de dias
          processedData.repeatDays = undefined;
          break;
          
        case 'daily':
          // Para 'Todos os dias', define todos os dias da semana
          processedData.repeatDays = [0, 1, 2, 3, 4, 5, 6];
          break;
          
        case 'weekdays':
          // Para 'Dias úteis', define dias de segunda a sexta
          processedData.repeatDays = [1, 2, 3, 4, 5];
          break;
          
        case 'weekends':
          // Para 'Fins de semana', define sábado e domingo
          processedData.repeatDays = [0, 6];
          break;
          
        case 'custom':
          // Para 'Personalizado', valida que os dias foram selecionados
          if (!sessionData.repeatDays || sessionData.repeatDays.length === 0) {
            return { success: false, error: 'Selecione pelo menos um dia da semana para repetição personalizada' };
          }
          break;
      }

      // Validar se o horário não conflita com outras sessões
      const allSessions = this.sessionRepository.getAllSessions();
      
      // Se não houver sessões, não precisa validar conflitos
      if (allSessions.length > 0) {
        const hasConflict = allSessions.some(existingSession => {
          // Se for o mesmo horário em qualquer dia da semana
          const sameTime = 
            (sessionData.startSessionInSec % 86400) === (existingSession.startSessionInSec % 86400) &&
            (sessionData.endSessionInSec % 86400) === (existingSession.endSessionInSec % 86400);
          
          // Se houver dias em comum
          let hasCommonDays = false;
          
          // Se ambas as sessões não têm repetição, só conflita se for no mesmo dia
          if (!processedData.repeatDays && !existingSession.repeatDays) {
            const sameDay = 
              Math.floor(sessionData.startSessionInSec / 86400) === 
              Math.floor(existingSession.startSessionInSec / 86400);
            hasCommonDays = sameDay;
          }
          // Se uma tem repetição e outra não, verifica se o dia único cai em algum dia da repetição
          else if (!processedData.repeatDays) {
            const dayOfWeek = new Date(sessionData.startSessionInSec * 1000).getDay();
            hasCommonDays = existingSession.repeatDays?.includes(dayOfWeek) ?? false;
          }
          else if (!existingSession.repeatDays) {
            const dayOfWeek = new Date(existingSession.startSessionInSec * 1000).getDay();
            hasCommonDays = processedData.repeatDays?.includes(dayOfWeek) ?? false;
          }
          // Se ambas têm repetição, verifica interseção dos dias
          else {
            hasCommonDays = processedData.repeatDays?.some(
              day => existingSession.repeatDays?.includes(day)
            ) ?? false;
          }
          
          return sameTime && hasCommonDays;
        });

        if (hasConflict) {
          return { success: false, error: 'Já existe uma sessão agendada para este horário' };
        }
      }

      const session = this.sessionRepository.createSession(processedData);
      return { success: true, session };
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
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

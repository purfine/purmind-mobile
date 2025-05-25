/*
 * @(#)sessions.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

/**
 * DEPRECIADO: Este arquivo é mantido para compatibilidade retroativa.
 * Por favor, use a nova arquitetura:
 * - Modelos: @/models/session.ts
 * - Repositório: @/repositories/sessionRepository.ts
 * - Serviço: @/services/blocks/scheduleService.ts
 * - Hook: @/hooks/useSession.ts
 */

import { Session, RepeatType, CreateSessionDTO } from "@/models/session";
import { scheduleService } from "@/services/blocks/scheduleService";

// Reexporta tipos para compatibilidade retroativa
export type { Session, RepeatType };

/**
 * Obtém todas as sessões ordenadas por data de criação (mais recentes primeiro)
 * @deprecated Use scheduleService.getAllSessions() ou o hook useSession() em vez disso
 */
export const getAllSessions = (): Session[] => {
  return scheduleService.getAllSessions();
};

/**
 * Obtém a sessão ativa (atual ou próxima)
 * @deprecated Use scheduleService.getActiveSession() ou o hook useSession() em vez disso
 */
export const getActiveSession = (): Session | undefined => {
  return scheduleService.getActiveSession();
};

/**
 * Adiciona uma nova sessão
 * @deprecated Use scheduleService.createSession() ou o hook useSession() em vez disso
 */
export const addSession = (session: Omit<Session, 'id' | 'createdAt'>): Session => {
  const result = scheduleService.createSession(session as CreateSessionDTO);
  if (result.success && result.session) {
    return result.session;
  }
  throw new Error(result.error || 'Failed to create session');
};

/**
 * Exclui uma sessão pelo ID
 * @deprecated Use scheduleService.deleteSession() ou o hook useSession() em vez disso
 */
export const deleteSession = (id: string): boolean => {
  return scheduleService.deleteSession(id);
};

/*
 * @(#)time-util.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

/**
 * Obtém o período atual do dia (manhã, tarde, noite, madrugada)
 * @returns O período atual do dia
 */
export function getCurrentTimePeriod(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'afternoon';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}
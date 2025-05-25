/*
 * @(#)session.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import "react-native-get-random-values";

export type RepeatType = 'none' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Session {
  id: string;
  figure: string;
  title: string;
  startSessionInSec: number;
  endSessionInSec: number;
  progressValue?: number;
  createdAt: number;
  repeatType: RepeatType;
  repeatDays?: number[]; // 0 = domingo, 1 = segunda, ..., 6 = sábado (para tipo 'custom')
}

export interface CreateSessionDTO {
  figure: string;
  title: string;
  startSessionInSec: number;
  endSessionInSec: number;
  repeatType: RepeatType;
  repeatDays?: number[];
}

/*
 * @(#)greetingService.ts
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

/**
 * Serviço para gerenciar mensagens de saudação com base na hora do dia
 */

import { getCurrentTimePeriod } from "@/util/time-util";

interface GreetingMessage {
  greeting: string;
  suggestion: string;
  emoji: string;
}

/**
 * Obtém uma mensagem de saudação aleatória com base na hora do dia
 * @param userName O nome do usuário
 * @returns Um objeto de mensagem de saudação com saudação, sugestão e emoji
 */
export function getGreetingMessage(userName: string): GreetingMessage {
  const timePeriod = getCurrentTimePeriod();
  const messages = greetingMessages[timePeriod];
  const randomIndex = Math.floor(Math.random() * messages.length);
  
  return {
    greeting: messages[randomIndex].greeting.replace('{userName}', userName),
    suggestion: messages[randomIndex].suggestion,
    emoji: messages[randomIndex].emoji
  };
}

// Coleção de mensagens de saudação para diferentes períodos do dia
const greetingMessages: Record<string, Array<{ greeting: string; suggestion: string; emoji: string }>> = {
  morning: [
    {
      greeting: 'Bom dia, {userName}!',
      suggestion: 'Que tal uma dose de café e foco',
      emoji: '☕'
    },
    {
      greeting: 'Olá, {userName}! Que bela manhã!',
      suggestion: 'Hora de começar o dia com energia e disposição',
      emoji: '🌞'
    },
    {
      greeting: 'Bom dia, {userName}!',
      suggestion: 'Vamos começar o dia com pensamentos positivos',
      emoji: '✨'
    },
    {
      greeting: 'Bom dia, {userName}!',
      suggestion: 'Pronto para conquistar o dia',
      emoji: '💪'
    }
  ],
  afternoon: [
    {
      greeting: 'Boa tarde, {userName}!',
      suggestion: 'Que tal uma pausa para recarregar as energias',
      emoji: '🔋'
    },
    {
      greeting: 'Olá, {userName}!',
      suggestion: 'Vamos manter o foco nesta tarde produtiva',
      emoji: '🎯'
    },
    {
      greeting: 'Boa tarde, {userName}!',
      suggestion: 'Um lanche saudável pode ajudar a manter a concentração',
      emoji: '🥗'
    },
    {
      greeting: 'E aí, {userName}!',
      suggestion: 'Ainda temos muito para realizar hoje',
      emoji: '📝'
    }
  ],
  evening: [
    {
      greeting: 'Boa noite, {userName}!',
      suggestion: 'Hora de revisar o que foi conquistado hoje',
      emoji: '📊'
    },
    {
      greeting: 'Olá, {userName}!',
      suggestion: 'Que tal organizar as tarefas para amanhã',
      emoji: '📋'
    },
    {
      greeting: 'Boa noite, {userName}!',
      suggestion: 'Um momento de relaxamento pode melhorar sua criatividade',
      emoji: '🧘'
    },
    {
      greeting: 'Boa noite, {userName}!',
      suggestion: 'Vamos finalizar o dia com chave de ouro',
      emoji: '🌟'
    }
  ],
  night: [
    {
      greeting: 'Ainda acordado, {userName}?',
      suggestion: 'Um bom descanso é essencial para a produtividade',
      emoji: '😴'
    },
    {
      greeting: 'Boa noite, {userName}!',
      suggestion: 'Hora de desacelerar e preparar-se para um novo dia',
      emoji: '🌙'
    },
    {
      greeting: 'Olá, {userName}!',
      suggestion: 'Não se esqueça que o descanso também é produtivo',
      emoji: '💤'
    },
    {
      greeting: 'Boa noite, {userName}!',
      suggestion: 'Que tal anotar algumas ideias antes de dormir',
      emoji: '✏️'
    }
  ]
};

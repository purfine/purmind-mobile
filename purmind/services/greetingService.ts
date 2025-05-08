/**
 * Service to handle greeting messages based on time of day
 */

import { getCurrentTimePeriod } from "@/util/time-util";

interface GreetingMessage {
  greeting: string;
  suggestion: string;
  emoji: string;
}

/**
 * Get a random greeting message based on the time of day
 * @param userName The user's name
 * @returns A greeting message object with greeting, suggestion, and emoji
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

// Collection of greeting messages for different times of day
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

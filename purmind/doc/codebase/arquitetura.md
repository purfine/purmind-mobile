# Arquitetura do PurMind Mobile

## Visão Geral

O PurMind Mobile adota uma arquitetura em camadas inspirada nos princípios de Clean Architecture. Esta abordagem separa claramente as responsabilidades entre diferentes partes do código, facilitando a manutenção, testabilidade e escalabilidade do aplicativo.

A arquitetura é composta por cinco camadas principais:

1. **Camada de UI (Presentation)**
2. **Camada de Hooks (React Integration)**
3. **Camada de Serviços (Business Logic)**
4. **Camada de Repositório (Data Access)**
5. **Camada de Modelos (Domain)**

Cada camada tem uma responsabilidade específica e se comunica apenas com as camadas adjacentes, seguindo o princípio de dependência unidirecional.

```
┌─────────────────┐
│      UI         │ (Telas e Componentes)
└────────┬────────┘
         │ usa
┌────────▼────────┐
│     Hooks       │ (React Hooks)
└────────┬────────┘
         │ usa
┌────────▼────────┐
│    Serviços     │ (Lógica de Negócio)
└────────┬────────┘
         │ usa
┌────────▼────────┐
│  Repositórios   │ (Acesso a Dados)
└────────┬────────┘
         │ usa
┌────────▼────────┐
│     Modelos     │ (Entidades e DTOs)
└─────────────────┘
```

## Estrutura de Diretórios

```
purmind/
├── app/                      # Telas (Camada UI)
├── components/               # Componentes reutilizáveis
├── hooks/                    # React Hooks personalizados
│   ├── useSession.ts         # Hook para gerenciar sessões
├── services/                 # Lógica de negócio
│   ├── blocks/               # Serviços relacionados a bloqueios
│   │   ├── scheduleService.ts # Serviço de agendamento
├── repositories/             # Acesso a dados
│   ├── sessionRepository.ts  # Repositório de sessões
├── models/                   # Modelos de domínio
│   ├── session.ts            # Modelo de sessão
├── utils/                    # Funções utilitárias
├── context/                  # Contextos React
├── mock/                     # Dados simulados (temporário)
```

## Detalhamento das Camadas

### 1. Camada de UI (Presentation)

**Localização:** `app/`, `components/`

**Responsabilidade:** Renderizar a interface do usuário e capturar interações.

**Características:**
- Componentes React focados apenas na apresentação
- Não contém lógica de negócio
- Usa hooks personalizados para acessar dados e funcionalidades
- Gerencia o estado local da UI (como campos de formulário, modais, etc.)

**Exemplo:**
```tsx
// Em app/(tabs)/blocks/(stack)/schedule-session-screen.tsx
export default function ScheduleSessionScreen() {
  const { theme } = useAppTheme();
  const { createSession, formatDate, formatTime } = useSession();
  
  // Estado local da UI
  const [sessionTitle, setSessionTitle] = useState('');
  
  // Manipuladores de eventos
  const handleCreateSession = async () => {
    const result = await createSession({
      // dados do formulário
    });
    
    if (result.success) {
      router.back();
    }
  };
  
  return (
    // JSX para renderizar a interface
  );
}
```

### 2. Camada de Hooks (React Integration)

**Localização:** `hooks/`

**Responsabilidade:** Fornecer uma interface reativa entre os componentes React e os serviços.

**Características:**
- Encapsula a lógica de estado e efeitos colaterais
- Fornece uma API amigável para componentes React
- Gerencia carregamento, erros e estado de dados
- Traduz entre o mundo imperativo dos serviços e o mundo reativo do React

**Exemplo:**
```tsx
// Em hooks/useSession.ts
export const useSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadSessions = useCallback(() => {
    try {
      setLoading(true);
      const allSessions = scheduleService.getAllSessions();
      setSessions(allSessions);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createSession = useCallback(async (data) => {
    try {
      setLoading(true);
      return scheduleService.createSession(data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  
  return {
    sessions,
    loading,
    createSession,
    // outros métodos e propriedades
  };
};
```

### 3. Camada de Serviços (Business Logic)

**Localização:** `services/`

**Responsabilidade:** Implementar a lógica de negócio e orquestrar operações.

**Características:**
- Contém regras de negócio e validações
- Independente de frameworks UI
- Orquestra operações entre diferentes repositórios
- Pode ser facilmente testado de forma isolada

**Exemplo:**
```tsx
// Em services/blocks/scheduleService.ts
export class ScheduleService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }
  
  createSession(data: CreateSessionDTO): Result<Session> {
    // Validação
    if (!data.title || data.title.trim() === '') {
      return { success: false, error: 'O título é obrigatório' };
    }
    
    // Lógica de negócio
    if (data.startSessionInSec >= data.endSessionInSec) {
      return { success: false, error: 'Hora de término deve ser posterior à de início' };
    }
    
    // Acesso ao repositório
    try {
      const session = this.sessionRepository.createSession(data);
      return { success: true, session };
    } catch (error) {
      return { success: false, error: 'Erro ao criar sessão' };
    }
  }
  
  // Outros métodos...
}

// Exporta uma instância singleton
export const scheduleService = new ScheduleService();
```

### 4. Camada de Repositório (Data Access)

**Localização:** `repositories/`

**Responsabilidade:** Abstrair o acesso aos dados, independentemente da fonte.

**Características:**
- Encapsula a lógica de acesso a dados
- Independente da fonte de dados (memória, API, banco local)
- Fornece uma API consistente para os serviços
- Facilita a troca da fonte de dados sem afetar o restante do aplicativo

**Exemplo:**
```tsx
// Em repositories/sessionRepository.ts
export class SessionRepository {
  private sessions: Session[] = []; // Simulação de banco de dados
  
  getAllSessions(): Session[] {
    return [...this.sessions].sort((a, b) => b.createdAt - a.createdAt);
  }
  
  createSession(data: CreateSessionDTO): Session {
    const newSession: Session = {
      ...data,
      id: uuidv4(),
      createdAt: Math.floor(Date.now() / 1000)
    };
    
    this.sessions.push(newSession);
    return newSession;
  }
  
  // Outros métodos CRUD...
}
```

### 5. Camada de Modelos (Domain)

**Localização:** `models/`

**Responsabilidade:** Definir as estruturas de dados e tipos do domínio.

**Características:**
- Define interfaces e tipos
- Não contém lógica de negócio
- Usado por todas as outras camadas
- Representa o vocabulário do domínio da aplicação

**Exemplo:**
```tsx
// Em models/session.ts
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
  repeatDays?: number[];
}

export interface CreateSessionDTO {
  figure: string;
  title: string;
  startSessionInSec: number;
  endSessionInSec: number;
  repeatType: RepeatType;
  repeatDays?: number[];
}
```

## Fluxo de Dados

1. **Usuário interage com a UI**
   - Ex: Preenche formulário de agendamento de sessão

2. **Componente UI chama hook**
   - Ex: `const result = await createSession(formData);`

3. **Hook chama serviço**
   - Ex: `scheduleService.createSession(data);`

4. **Serviço valida e processa dados**
   - Aplica regras de negócio
   - Chama repositório para persistir dados

5. **Repositório salva dados**
   - Atualmente em memória
   - Futuramente pode ser API ou armazenamento local

6. **Resultado flui de volta para a UI**
   - Serviço retorna resultado para hook
   - Hook atualiza estado React
   - UI reage à mudança de estado

## Benefícios da Arquitetura

### 1. Separação de Responsabilidades
- Cada camada tem uma função clara e específica
- Facilita a compreensão do código
- Reduz a complexidade de cada componente

### 2. Testabilidade
- Camadas podem ser testadas isoladamente
- Mocks podem ser facilmente criados para dependências
- Testes unitários mais simples e confiáveis

### 3. Manutenibilidade
- Mudanças em uma camada têm impacto mínimo nas outras
- Código mais organizado e previsível
- Mais fácil para novos desenvolvedores entenderem

### 4. Escalabilidade
- Novas funcionalidades seguem o mesmo padrão
- Fácil adição de novos serviços e repositórios
- Estrutura consistente em todo o aplicativo

### 5. Flexibilidade
- Fácil substituição de implementações (ex: mock para API real)
- Adaptável a mudanças de requisitos
- Componentes reutilizáveis entre diferentes partes do app

## Migração e Compatibilidade

Para facilitar a transição gradual para a nova arquitetura, mantivemos compatibilidade com o código existente:

- O arquivo `mock/sessions.ts` agora redireciona para a nova implementação
- Componentes existentes continuarão funcionando sem modificações
- Novos componentes devem seguir a nova arquitetura

## Exemplo de Implementação Completa

### 1. Definição do Modelo (Domain)
```tsx
// models/session.ts
export interface Session {
  id: string;
  title: string;
  // outros campos...
}

export interface CreateSessionDTO {
  title: string;
  // outros campos, sem id...
}
```

### 2. Implementação do Repositório (Data)
```tsx
// repositories/sessionRepository.ts
export class SessionRepository {
  getAllSessions(): Session[] { /* ... */ }
  createSession(data: CreateSessionDTO): Session { /* ... */ }
  // outros métodos...
}
```

### 3. Implementação do Serviço (Business Logic)
```tsx
// services/blocks/scheduleService.ts
export class ScheduleService {
  private repository = new SessionRepository();
  
  createSession(data: CreateSessionDTO): Result<Session> {
    // validação e lógica de negócio
    return { success: true, session: this.repository.createSession(data) };
  }
}

export const scheduleService = new ScheduleService();
```

### 4. Implementação do Hook (React Integration)
```tsx
// hooks/useSession.ts
export const useSession = () => {
  // estado e lógica React
  return {
    createSession: async (data) => scheduleService.createSession(data),
    // outros métodos e propriedades
  };
};
```

### 5. Uso na UI (Presentation)
```tsx
// app/(tabs)/blocks/(stack)/schedule-session-screen.tsx
export default function ScheduleSessionScreen() {
  const { createSession } = useSession();
  
  const handleSubmit = async () => {
    const result = await createSession({
      // dados do formulário
    });
    
    if (result.success) {
      // navegação ou feedback
    }
  };
  
  return (
    // JSX da interface
  );
}
```

## Conclusão

Esta arquitetura proporciona uma base sólida para o desenvolvimento do PurMind Mobile, permitindo que o aplicativo cresça de forma organizada e sustentável. Ao seguir estes padrões, garantimos que o código seja mais fácil de manter, testar e evoluir ao longo do tempo.

A separação clara entre UI e lógica de negócio facilita tanto o desenvolvimento quanto a manutenção, permitindo que diferentes partes do aplicativo evoluam independentemente, sem causar efeitos colaterais indesejados.

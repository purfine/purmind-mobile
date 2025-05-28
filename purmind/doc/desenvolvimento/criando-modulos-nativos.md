# Criando Módulos Nativos no Expo

Este guia explica como criar módulos nativos para Expo/React Native, usando como exemplo o módulo `installed-apps`.

## Criando um Novo Módulo

1. Na raiz do projeto (onde está o `package.json`), execute:
```bash
npx create-expo-module --local
```

2. Durante a criação, você será solicitado a fornecer algumas informações:
   - Nome do módulo (ex: `installed-apps`)
   - Diretório de destino (geralmente `modules/[nome-do-modulo]`)
   - Tipo do módulo (selecione conforme necessidade - no caso do `installed-apps` usamos módulo com UI)
   - Plataformas suportadas (Android/iOS)

## Estrutura do Módulo

Usando o `installed-apps` como exemplo, vamos entender a estrutura de arquivos gerada:

```
modules/installed-apps/
├── android/                    # Código nativo Android
│   ├── src/main/java/expo/modules/installedapps/
│   │   ├── InstalledAppsModule.kt    # Implementação nativa Android
│   │   └── InstalledAppsView.kt      # Componente de UI nativo (se aplicável)
│   └── build.gradle           # Configurações de build Android
├── ios/                       # Código nativo iOS
│   ├── InstalledAppsModule.swift    # Implementação nativa iOS
│   ├── InstalledAppsView.swift      # Componente de UI nativo (se aplicável)
│   └── InstalledApps.podspec        # Configurações do CocoaPods
├── src/                      # Código TypeScript/JavaScript
│   ├── InstalledApps.types.ts       # Tipos TypeScript
│   ├── InstalledAppsModule.ts       # Interface JS para código nativo
│   ├── InstalledAppsModule.web.ts   # Implementação web (opcional)
│   ├── InstalledAppsView.tsx        # Componente React
│   └── InstalledAppsView.web.tsx    # Componente React para web (opcional)
├── expo-module.config.json   # Configuração do módulo Expo
└── index.ts                 # Ponto de entrada do módulo
```

## Arquivos Principais

### 1. expo-module.config.json
```json
{
  "name": "installed-apps",
  "platforms": ["ios", "android"],
  "ios": {
    "modules": ["InstalledAppsModule"]
  },
  "android": {
    "modules": ["InstalledAppsModule"]
  }
}
```
Este arquivo define a configuração básica do módulo, incluindo nome e plataformas suportadas.

### 2. index.ts
```typescript
import { InstalledAppsView } from './src/InstalledAppsView';
import { InstalledAppsModule } from './src/InstalledAppsModule';

export { InstalledAppsView };
export { InstalledAppsModule };
```
Arquivo principal que exporta os componentes e módulos para uso.

### 3. src/InstalledApps.types.ts
Define as interfaces e tipos TypeScript usados no módulo:
```typescript
export interface InstalledApp {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  // ... outros campos
}
```

### 4. src/InstalledAppsModule.ts
Interface JavaScript para o código nativo:
```typescript
import { requireNativeModule } from 'expo-modules-core';
import { InstalledApp } from './InstalledApps.types';

const InstalledAppsModule = requireNativeModule('InstalledApps');

export { InstalledAppsModule };
```

### 5. Código Nativo Android (kotlin)

#### InstalledAppsModule.kt
```kotlin
package expo.modules.installedapps

class InstalledAppsModule(context: Context) : Module() {
    // Implementação de funcionalidades nativas
    private val context: Context = context.applicationContext

    override fun definition() = ModuleDefinition {
        // Definição de métodos expostos para JS
        AsyncFunction("getInstalledApps") { promise: Promise ->
            // Implementação
        }
    }
}
```

#### InstalledAppsView.kt (se tiver UI)
```kotlin
package expo.modules.installedapps

class InstalledAppsView(context: Context) : ViewGroup(context) {
    // Implementação de componente UI nativo
}
```

### 6. Código Nativo iOS (Swift)

#### InstalledAppsModule.swift
```swift
import ExpoModulesCore

public class InstalledAppsModule: Module {
    // Implementação de funcionalidades nativas
    public func definition() -> ModuleDefinition {
        // Definição de métodos expostos para JS
        AsyncFunction("getInstalledApps") { (promise: Promise) in
            // Implementação
        }
    }
}
```

## Padrões Importantes

1. **Nomenclatura**:
   - Use PascalCase para nomes de classes
   - Mantenha consistência entre plataformas
   - Sufixo `Module` para módulos e `View` para componentes UI

2. **Tipos**:
   - Defina interfaces TypeScript claras
   - Use tipos nativos apropriados em cada plataforma
   - Documente todos os tipos e interfaces

3. **Estrutura**:
   - Mantenha código específico de plataforma em seus respectivos diretórios
   - Use `.web.ts` para implementações web alternativas
   - Centralize tipos em arquivo `.types.ts`

4. **Exposição de API**:
   - Exponha métodos consistentes entre plataformas
   - Use promises para operações assíncronas
   - Documente todos os métodos públicos

## Uso do Módulo

Após criar o módulo, você pode importá-lo em seu código React Native:

```typescript
import { InstalledAppsModule, InstalledAppsView } from '@modules/installed-apps';

// Usando métodos do módulo
const apps = await InstalledAppsModule.getInstalledApps();

// Usando componente UI
<InstalledAppsView />
```

## Dicas de Desenvolvimento

1. **Testes**:
   - Teste em todas as plataformas suportadas
   - Verifique casos de erro e exceções
   - Teste performance com grandes conjuntos de dados

2. **Depuração**:
   - Use logs nativos para debug
   - Verifique erros de bridge JS-Nativa
   - Teste em diferentes versões do OS

3. **Performance**:
   - Minimize chamadas bridge JS-Nativa
   - Cache resultados quando apropriado
   - Otimize operações pesadas

4. **Manutenção**:
   - Mantenha documentação atualizada
   - Siga padrões de código da plataforma
   - Considere compatibilidade retroativa 
# Configuração e Execução do Projeto

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 16 ou superior)
- npm (geralmente vem com Node.js)
- Java Development Kit (JDK) 11 ou superior
- Android Studio
- Android SDK
- Git

## Configuração Inicial

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd purmind
```

2. Instale as dependências:
```bash
npm install --legacy-peer-deps
```
> <small>Por enquanto utilizaremos o `legacy-peer-deps` até resolvermos problemas de compatibilidade de versões, porém não irá atrapalhar no desenvolvimento.</small>

3. Instale o Expo CLI globalmente (se ainda não tiver):
```bash
npm install -g expo-cli
```

4. Certifique-se que os assets necessários estão presentes:
   - Verifique se a pasta `assets/images` contém todos os arquivos necessários
   - Em especial, certifique-se que o arquivo `splashscreen_logo.png` existe em `android/app/src/main/res/drawable/`
   - Se não existir, copie o arquivo da pasta `assets/images` para o diretório correto:
```bash
mkdir -p android/app/src/main/res/drawable
cp assets/images/splashscreen_logo.png android/app/src/main/res/drawable/
```

## Executando o Projeto

### Modo Híbrido (Expo Go)

1. Inicie o servidor de desenvolvimento:
```bash
npx expo start
```

2. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR Code que aparecerá no terminal

### Modo Nativo (Android)

1. Certifique-se de que o Android Studio está configurado corretamente com:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform (API Level 33 ou superior)

2. Configure as variáveis de ambiente:
   - ANDROID_HOME: caminho para o Android SDK
   - JAVA_HOME: caminho para o JDK

3. Conecte um dispositivo Android via USB ou inicie um emulador Android

4. Execute o build de desenvolvimento:
```bash
# Na pasta raiz do projeto
cd android
./gradlew clean # Limpa builds anteriores
./gradlew assembleDebug # Gera o APK de debug
```

5. Para executar diretamente no dispositivo/emulador:
```bash
npx expo run:android
```

## Solução de Problemas Comuns

### Erro de JAVA_HOME
Verifique se a variável JAVA_HOME está configurada corretamente:
```bash
echo %JAVA_HOME% # Windows
echo $JAVA_HOME # Linux/MacOS
```

### Erro de SDK
Verifique se o caminho do Android SDK está correto no arquivo `local.properties` na pasta `android/`:
```properties
sdk.dir=C:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Erro de Gradle
Se encontrar problemas com o Gradle, tente:
```bash
cd android
./gradlew clean
./gradlew --refresh-dependencies
```

### Erro de Recursos não Encontrados
Se encontrar erros como "resource not found" durante o build:
1. Verifique se todos os recursos necessários estão presentes nas pastas corretas
2. Limpe o cache do Gradle:
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
```

### Cache do Metro Bundler
Se encontrar problemas com o Metro Bundler:
```bash
npx expo start --clear
```

### Erro de Versões Incompatíveis
Se encontrar problemas de compatibilidade entre pacotes:
1. Use o comando com `legacy-peer-deps` como mencionado acima
2. Se persistir, tente limpar o cache do npm:
```bash
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
```

## Builds de Produção

Para gerar um APK de produção:

1. Configure a keystore de produção no arquivo `android/app/build.gradle`

2. Execute:
```bash
cd android
./gradlew assembleRelease
```

O APK será gerado em: `android/app/build/outputs/apk/release/app-release.apk` 
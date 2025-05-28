import { Platform } from 'react-native';
import { InstalledApp, InstalledAppsModuleType } from './InstalledApps.types';

// Implementação fallback para quando o módulo nativo não estiver disponível
const mockModule: InstalledAppsModuleType = {
  async getInstalledApps(): Promise<InstalledApp[]> {
    console.log('[InstalledAppsModule] Usando implementação mock de getInstalledApps');
    
    // Retorna dados simulados para testes
    return [
      {
        packageName: 'com.whatsapp',
        appName: 'WhatsApp',
        versionName: '2.23.10.76'
      },
      {
        packageName: 'com.instagram.android',
        appName: 'Instagram',
        versionName: '275.0.0.27.98'
      },
      {
        packageName: 'com.facebook.katana',
        appName: 'Facebook',
        versionName: '415.0.0.34.107'
      },
      {
        packageName: 'com.spotify.music',
        appName: 'Spotify',
        versionName: '8.8.22.510'
      },
      {
        packageName: 'com.twitter.android',
        appName: 'Twitter',
        versionName: '9.71.0-release.0'
      }
    ];
  }
};

// Tenta obter o módulo nativo, mas usa o mock se não estiver disponível
let InstalledAppsModule: InstalledAppsModuleType;

// Inicializa com o mock por padrão
InstalledAppsModule = mockModule;

// Tenta carregar o módulo nativo apenas no Android
if (Platform.OS === 'android') {
  try {
    const { requireNativeModule } = require('expo-modules-core');
    
    try {
      const nativeModule = requireNativeModule('InstalledApps');
      
      if (nativeModule && typeof nativeModule.getInstalledApps === 'function') {
        console.log('[InstalledAppsModule] Módulo nativo encontrado com sucesso');
        InstalledAppsModule = nativeModule as InstalledAppsModuleType;
      } else {
        console.warn('[InstalledAppsModule] Módulo nativo encontrado, mas sem método getInstalledApps');
        // Continua usando o mock (já inicializado)
      }
    } catch (moduleError: any) {
      console.warn('[InstalledAppsModule] Módulo nativo não encontrado:', moduleError?.message || 'Erro desconhecido');
      console.log('[InstalledAppsModule] Usando implementação mock como fallback');
      // Continua usando o mock (já inicializado)
    }
  } catch (coreError: any) {
    console.warn('[InstalledAppsModule] Erro ao importar expo-modules-core:', coreError?.message || 'Erro desconhecido');
    // Continua usando o mock (já inicializado)
  }
} else {
  console.log('[InstalledAppsModule] Plataforma não é Android, usando mock');
  // Continua usando o mock (já inicializado)
}

export default InstalledAppsModule;

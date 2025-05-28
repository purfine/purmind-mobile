import { InstalledApp, InstalledAppsModuleType } from './InstalledApps.types';

// Implementação mock para ambiente web/desenvolvimento
const InstalledAppsModule: InstalledAppsModuleType = {
  // Implementação mock do método getInstalledApps
  async getInstalledApps(): Promise<InstalledApp[]> {
    console.log('[InstalledAppsModule.web] Usando implementação mock de getInstalledApps');
    
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

export default InstalledAppsModule;

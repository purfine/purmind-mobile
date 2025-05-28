import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Importar o módulo nativo diretamente do arquivo de módulo
import InstalledAppsModule from '../modules/installed-apps/src/InstalledAppsModule';
import { InstalledApp } from '../modules/installed-apps/src/InstalledApps.types';

/**
 * Hook para acessar os aplicativos instalados no dispositivo Android
 * Retorna uma lista de aplicativos, estado de carregamento e possíveis erros
 */
export const useDeviceApps = () => {
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para carregar os aplicativos instalados
   * Usa o módulo nativo InstalledApps quando disponível
   */
  const loadApps = useCallback(async () => {
    try {
      // Resetar estados
      setLoading(true);
      setError(null);
      
      if (Platform.OS === 'android') {
        console.log('Iniciando carregamento de apps...');
        
        // Verificar se o módulo está disponível
        if (!InstalledAppsModule?.getInstalledApps) {
          throw new Error('Módulo InstalledApps não encontrado');
        }

        // Chamar o módulo nativo para obter os aplicativos instalados
        const apps = await InstalledAppsModule.getInstalledApps();
        console.log('Apps carregados:', apps.length);
        
        setInstalledApps(apps);
      } else {
        console.log('Plataforma não suportada, retornando lista vazia');
        setInstalledApps([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar apps:', err);
      setError(err?.message || 'Erro ao carregar aplicativos');
      setInstalledApps([]); // Garantir que não temos dados parciais em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar aplicativos quando o componente for montado
  useEffect(() => {
    loadApps();
  }, [loadApps]);

  return { 
    installedApps, 
    loading, 
    error,
    refreshApps: loadApps // Expor função para recarregar os aplicativos
  };
};
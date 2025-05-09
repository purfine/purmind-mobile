export interface AppUsage {
    id: string;
    appName: string;
    category: 'Distraindo' | 'Neutro' | 'Produtivo' | '';
    duration: number; // em segundos
    appIcon: string;
}

export type DailyAnalysis = {
  totalScreenTime: number; // em segundos
  offlineTime: number; // em segundos
  appUsages: AppUsage[];
};

export function getDailyAnalysisData(): DailyAnalysis {
    // DADOS MOCKADOS - PARA DESENVOLVIMENTO
    // 16h 50min = 60600 segundos (offline)
    // Tempo total de uso (calculado com base nos apps)
    const appUsages: AppUsage[] = [
        {
            id: '1',
            appName: 'Instagram',
            category: 'Distraindo',
            duration: 3137, // 52min 17s
            appIcon: 'logo-instagram'
        },
        {
            id: '2',
            appName: 'Facebook',
            category: 'Neutro',
            duration: 633, // 10min 33s
            appIcon: 'logo-facebook'
        },
        {
            id: '3',
            appName: 'Tik Tok',
            category: 'Distraindo',
            duration: 3137, // 52min 17s
            appIcon: 'musical-notes'
        },
        {
            id: '4',
            appName: 'YouTube',
            category: 'Produtivo',
            duration: 324, // 5min 24s
            appIcon: 'logo-youtube'
        },
        {
            id: '5',
            appName: 'WhatsApp',
            category: 'Neutro',
            duration: 2580, // 43min
            appIcon: 'logo-whatsapp'
        },
        {
            id: '6',
            appName: 'LinkedIn',
            category: 'Produtivo',
            duration: 720, // 12min
            appIcon: 'logo-linkedin'
        },
        {
            id: '7',
            appName: 'Twitter',
            category: 'Distraindo',
            duration: 900, // 15min
            appIcon: 'logo-twitter'
        },
        {
            id: '8',
            appName: 'Spotify',
            category: 'Neutro',
            duration: 1800, // 30min
            appIcon: 'musical-note'
        },
        {
            id: '9',
            appName: 'Gmail',
            category: 'Produtivo',
            duration: 600, // 10min
            appIcon: 'mail'
        },
        {
            id: '10',
            appName: 'Google Maps',
            category: 'Produtivo',
            duration: 480, // 8min
            appIcon: 'map'
        },
        {
            id: '11',
            appName: 'Netflix',
            category: 'Distraindo',
            duration: 3600, // 1h
            appIcon: 'film'
        },
        {
            id: '12',
            appName: 'Duolingo',
            category: 'Produtivo',
            duration: 900, // 15min
            appIcon: 'school'
        },
        {
            id: '13',
            appName: 'Discord',
            category: 'Neutro',
            duration: 1200, // 20min
            appIcon: 'chatbubbles'
        },
        {
            id: '14',
            appName: 'Kindle',
            category: 'Produtivo',
            duration: 1500, // 25min
            appIcon: 'book'
        },
        {
            id: '15',
            appName: 'Uber',
            category: 'Neutro',
            duration: 300, // 5min
            appIcon: 'car'
        }
    ];

    const totalScreenTime = appUsages.reduce((sum, app) => sum + app.duration, 0);
    const totalDayInSeconds = 24 * 60 * 60; // 86400 segundos (24 horas)
    const offlineTime = totalDayInSeconds - totalScreenTime;

    return {
        totalScreenTime,
        offlineTime,
        appUsages
    };
}

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
        return `${minutes}min ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
};

export const calculatePercentage = (value: number, total: number): number => {
    return Math.round((value / total) * 100);
};

// Para valores padrões do useState
export function initializeDailyAnalysisData(): DailyAnalysis {
    return {
        totalScreenTime: 0,
        offlineTime: 0,
        appUsages: [
            {
                id: '1',
                appName: '',
                category: '',
                duration: 0,
                appIcon: ''
            }
        ]
    }
}
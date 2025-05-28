import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type InstalledAppsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type InstalledAppsViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export interface InstalledApp {
  packageName: string;
  appName: string;
  versionName: string;
}

export interface InstalledAppsModuleType {
  getInstalledApps(): Promise<InstalledApp[]>;
}

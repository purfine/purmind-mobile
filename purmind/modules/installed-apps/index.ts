// Reexport the native module. On web, it will be resolved to InstalledAppsModule.web.ts
// and on native platforms to InstalledAppsModule.ts
export { default } from './src/InstalledAppsModule';
export { default as InstalledAppsView } from './src/InstalledAppsView';
export * from  './src/InstalledApps.types';

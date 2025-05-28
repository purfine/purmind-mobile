import * as React from 'react';
import { requireNativeViewManager } from 'expo-modules-core';

import { InstalledAppsViewProps } from './InstalledApps.types';

const NativeView: React.ComponentType<InstalledAppsViewProps> =
  requireNativeViewManager('InstalledApps');

export default function InstalledAppsView(props: InstalledAppsViewProps) {
  return <NativeView {...props} />;
}

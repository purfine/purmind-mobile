import * as React from 'react';

import { InstalledAppsViewProps } from './InstalledApps.types';

export default function InstalledAppsView(props: InstalledAppsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}

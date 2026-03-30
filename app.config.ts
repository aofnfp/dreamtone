import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'DreamTone',
  slug: 'dreamtone',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'dreamtone',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0A0E1A',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aofnfp.dreamtone',
    infoPlist: {
      UIBackgroundModes: ['audio'],
      SKAdNetworkItems: [
        { SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork' },
      ],
      NSUserTrackingUsageDescription:
        'This helps us show relevant ads and support the free version of DreamTone.',
    },
  },
  android: {
    package: 'com.aofnfp.dreamtone',
    adaptiveIcon: {
      backgroundColor: '#0A0E1A',
      foregroundImage: './assets/images/icon.png',
    },
    permissions: ['com.google.android.gms.permission.AD_ID'],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    ['expo-tracking-transparency'],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId:
          process.env.ADMOB_ANDROID_APP_ID ??
          'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
        iosAppId:
          process.env.ADMOB_IOS_APP_ID ??
          'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId:
        process.env.EAS_PROJECT_ID ?? 'REPLACE_WITH_EAS_PROJECT_ID',
    },
  },
  owner: 'aofnfp',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID ?? 'REPLACE_WITH_EAS_PROJECT_ID'}`,
  },
});

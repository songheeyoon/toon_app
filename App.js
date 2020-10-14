import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Notifications } from 'expo';

import PageLoaderIndicator from './src/Pages/PageLoaderIndicator';
import PageLoaderIndicatorForStar from './src/Pages/PageLoaderIndicatorForStar';
import AppContainer from './src/AppContainer';

export default function App() {

  const [isShowPageLoader, setIsShowPageLoader] = useState(false)
  const [isShowPageLoaderStar, setIsShowPageLoaderStar] = useState(false)

  global.showPageLoader = (isShow) => {
    setIsShowPageLoader(isShow)
  }

  global.showPageLoaderForStar = (isShow) => {
    setIsShowPageLoaderStar(isShow)
  }

  const _handleNotification = notification => {
    console.warn(notification);
  };

  let _notificationSubscription = Notifications.addListener(_handleNotification);

  return (
    <SafeAreaProvider>
      <AppContainer />
      <PageLoaderIndicator isPageLoader={isShowPageLoader} />
      <PageLoaderIndicatorForStar isPageLoader={isShowPageLoaderStar} />
    </SafeAreaProvider>
  );
}


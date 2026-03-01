import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AppRoutes } from './AppRoutes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from './shared/themes/Theme';
import { StatusBar } from 'expo-status-bar';
import MobileAds, { BannerAd, BannerAdSize, TestIds, AdsConsent } from 'react-native-google-mobile-ads';


SplashScreen.preventAutoHideAsync();

export function App() {

  const [loaded, error] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const init = async () => {
      try {
        await AdsConsent.gatherConsent();
      } catch (error) {
        console.log(error);
      }
      MobileAds().initialize();
    }
    init();
  }, []);

  const adsUnitId = useMemo(() => {
    if (__DEV__) return TestIds.BANNER;
    return 'ca-app-pub-4253572183166318/2172045062';
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.background }}>
        <StatusBar style="light" />
        <AppRoutes />
        <BannerAd 
          unitId={adsUnitId}
          size={BannerAdSize.FULL_BANNER}
        />  
      </SafeAreaView> 
    </SafeAreaProvider>
    
  );
}
import React from 'react';
import { AppLoading } from 'expo';
import { StatusBar } from 'react-native';
import Home from './src/pages/Home';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';//Importando as fontes, por meio da lib Expo Google Fonts
import { Ubuntu_700Bold,  useFonts } from '@expo-google-fonts/ubuntu';//Importando as fontes, por meio da lib Expo Google Fonts
import Routes from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if (!fontsLoaded) {//Verificando se as fontes já foram carregadas
    return <AppLoading />//AppLoading é um componente interno do expo que faz uma breve tela de carregamento
  }

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
      <Routes />
    </>
  );
}



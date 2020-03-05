import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import  IconT from 'react-native-vector-icons/FontAwesome5'
import  IconCl from 'react-native-vector-icons/Octicons'
import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens/navigator';
import {initLanguage} from './utils/language';
import {task_init} from './db/tasks'
import translate from './utils/language';

async function prepareIcons() {
  const icons = await Promise.all([
    IconCl.getImageSource('calendar', 30),
    IconT.getImageSource('tasks', 30),
    IconT.getImageSource('exchange-alt', 30),
  ]);
  const [cal, task, conv] = icons;
  return { cal, task, conv};
}

async function startApp() {
  const icons = await prepareIcons();
  Navigation.startSingleScreenApp({
    screen: {
        screen: 'Ethcal.calendar',
        title: translate('CALENDAR_title'),
        animationType: 'fade'
      },
      appStyle: {
      tabBarBackgroundColor: '#009688',
      navBarButtonColor: '#ffffff',
      tabBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      tabBarSelectedButtonColor: '#ff505c',
      navBarBackgroundColor: '#009688',
      statusBarColor: '#00796B',
      navigationBarColor: '#009688'
    },
    drawer: {
      left: {
        screen: 'Ethcal.drawer'
      }
    }
  })
}
registerScreens();
task_init();
initLanguage();
startApp();

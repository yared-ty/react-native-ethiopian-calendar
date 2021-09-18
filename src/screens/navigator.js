import {Navigation} from 'react-native-navigation';

import Calendar from './calendar/main';
import Drawer from './drawer';
import Converter from './converter/main';
import TaskNew from './task/taskNew'
import TaskList from './task/taskList'
import Setting from './setting'
import About from './about'
import HolyDay from './holyday'



export function registerScreens() {
  Navigation.registerComponent('Ethcal.calendar', () => Calendar);
  Navigation.registerComponent('Ethcal.drawer', () => Drawer);
  Navigation.registerComponent('Ethcal.converter', () => Converter);
  Navigation.registerComponent('Ethcal.taskNew', () => TaskNew);
  Navigation.registerComponent('Ethcal.taskList', () => TaskList);
  Navigation.registerComponent('Ethcal.setting', () => Setting);
  Navigation.registerComponent('Ethcal.about', () => About);
  Navigation.registerComponent('Ethcal.holyday', () => HolyDay);

}

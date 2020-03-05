import {getMonthlyDates} from '../../algorithms/api'
import translate from '../../utils/language';

export const getPrevPage = (m, y) => {
  let p_y=  (m  === 1)? y - 1: y;
  let p_m =  (m === 1)? 13: m   - 1;

  return getMonthlyDates(p_y, p_m);
}
export const getNextPage = (m, y) => {
  let n_y=  (m  === 13)? y + 1: y;
  let n_m =  (m  === 13)? 1: m  + 1;

  return getMonthlyDates(n_y, n_m);
}
export const getPages= (m, y) => {
  let anim_d = []

  anim_d.push(getPrevPage(m, y));
  anim_d.push(getMonthlyDates(y, m));
  anim_d.push(getNextPage(m, y));

  return anim_d;
}
export const getCurrentPage = (m, y) => {

  return getMonthlyDates(y, m);
}
export const renderShare = (navigator) => {
  navigator.share({
    message: translate('SHARE_msg'),
    url: 'https://play.google.com/store/apps/details?id=com.ethiocalendar',
    title: 'Ethipoian Calendar and Task Manager App'
  }, {
    dialogTitle: translate('SHARE_title'),
  })
}
export const renderAbout = (navigator) => {
  navigator.push({
    screen: 'Ethcal.about',
    title: translate('ABOUT_title'),
    navigatorStyle: {
      tabBarHidden: true,
      drawUnderTabBar: true
    },
  })
}
export const renderTaskList = (navigator) => {
  navigator.push({
    screen: 'Ethcal.taskList',
    title: translate('TASK_title'),
    navigatorStyle: {
      tabBarHidden: true,
      drawUnderTabBar: true
    },
  })
}
export const renderConvert = (navigator) => {
  navigator.push({
    screen: 'Ethcal.converter',
    title: translate('CONVERT_title'),
    navigatorStyle: {
      tabBarHidden: true,
      drawUnderTabBar: true
    },
  })
}
export const renderAllHolyDay = (navigator) => {
  navigator.push({
    screen: 'Ethcal.holyday',
    title: translate('DRAWER_holyday'),
    navigatorStyle: {
      tabBarHidden: true,
      drawUnderTabBar: true
    },
  })
}
export const renderSetting = (navigator) => {
  navigator.push({
    screen: 'Ethcal.setting',
    title: translate('LANG_setting'),
    animated: true,
    animationType: 'fade',
    navigatorStyle: {
      tabBarHidden: true,
      drawUnderTabBar: true
    },
  })
}
export const renderRateApp = (navigator) => {
  navigator.openURL('http://play.google.com/store/apps/details?id=com.ethiocalendar')
}


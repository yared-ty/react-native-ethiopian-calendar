import React from 'react';
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import  IconT from 'react-native-vector-icons/FontAwesome5'
import  IconH from 'react-native-vector-icons/MaterialIcons';
import  IconL from 'react-native-vector-icons/Entypo';


import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import translate from './language';
let moment = require('moment');

export let getDays = () => {
  let days = [
    translate('DAY_mn'),
    translate('DAY_ts'),
    translate('DAY_wn'),
    translate('DAY_th'),
    translate('DAY_fr'),
    translate('DAY_st'),
    translate('DAY_sn'),
  ];

  return days;
}
export let getGeezNumbers = () => {
  let num = ['፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲',
    '፩፩', '፩፪', '፩፫', '፩፬', '፩፭', '፩፮', '፩፯', '፩፰', '፩፱', '፳',
    '፪፩', '፪፪', '፪፫', '፪፬', '፪፭', '፪፮', '፪፯', '፪፰', '፪፱', '፴'];

  return num;
}
export let getMonths = () => {
  let months = [
    translate('MONTH_spt'),
    translate('MONTH_oct'),
    translate('MONTH_nvm'),
    translate('MONTH_dcm'),
    translate('MONTH_jnr'),
    translate('MONTH_fbr'),
    translate('MONTH_mrc'),
    translate('MONTH_apr'),
    translate('MONTH_my'),
    translate('MONTH_jn'),
    translate('MONTH_jly'),
    translate('MONTH_ags'),
    translate('MONTH_pgm'),
  ];
  return months;
}
export let getMonthsOptions = () => {
  let months_options = [
        {
          key: '1',
          label:   translate('MONTH_spt'),
        },
        {
          key: '2',
          label: translate('MONTH_oct'),
        },
        {
          key: '3',
          label: translate('MONTH_nvm'),
        },
        {
          key: '4',
          label: translate('MONTH_dcm'),
        },
        {
          key: '5',
          label: translate('MONTH_jnr'),
        },
        {
          key: '6',
          label: translate('MONTH_fbr'),
        },
        {
          key: '7',
          label: translate('MONTH_mrc'),
        },
        {
          key: '8',
          label: translate('MONTH_apr'),
        },
        {
          key: '9',
          label: translate('MONTH_my'),
        },
        {
          key: '10',
          label: translate('MONTH_jn'),
        },
       {
          key: '11',
          label: translate('MONTH_jly'),
        },
        {
          key: '12',
          label: translate('MONTH_ags'),
        },
        {
          key: '13',
          label: translate('MONTH_pgm'),
        },
      ];
      return months_options;
}
export let getYearsOptions = () => {
  let curr_y = parseInt(moment().format('YYYY'));
  let years_options = []

  for(let i=20; i > 0; i--){
    years_options.push({
      key: (curr_y-i).toString(),
      label: (curr_y-i).toString()
    })
  }
  for(let i=0; i < 20; i++){
    years_options.push({
      key: (curr_y+i).toString(),
      label: (curr_y+i).toString()
    })
  }
  return years_options;
}
export let getDrawerMenu = () => {
  let drawerMenu = [

    {
      id: 'holyday',
      title: translate('DRAWER_holyday'),
      icon: (<IconH name="view-day" size={20} color='#009688'/>),
    },
    {
      id: 'converter',
      title: translate('DRAWER_convert'),
      icon: (<IconT name="exchange-alt" size={20} color='#009688'/>),
    },
    {
      id: 'taskList',
      title: translate('DRAWER_newTask'),
      icon: (<IconT name="tasks" size={20} color='#009688'/>),
    },

    {
      id: 'language',
      title: translate('DRAWER_language'),
      icon: (<IconL name="language" size={20} color='#009688'/>),
    },
    {
      id: 'share',
      title: translate('DRAWER_share'),
      icon: (<Icon name="share" size={20} color='#009688'/>),
    },
    {
      id: 'rate',
      title: translate('DRAWER_rate'),
      icon: (<IconL name="star" size={24} color='#009688'/>),
    },
    {
      id: 'about',
      title: translate('DRAWER_about'),
      icon: (<IconT name="info-circle" size={20} color='#009688'/>),
    },

  ];
  return drawerMenu;
}
let x  = (width - 16)/9;
export const location = {
  cellX: x + 2,
  cellY: x,
  bgLeft: x/2,
  bgRight: x/2,
  calLeft: x/2,
  calRight: x/2
};

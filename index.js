/** @format */

import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import {AppMain} from './src/main'

export default class ethcal extends Component {

  render() {
    return (
      <AppMain/>
    );
  }
}
AppRegistry.registerComponent("EthioCalendar", () => ethcal);

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getDays, location} from '../../utils/global'
import {getCurrentLocale} from '../../utils/language';

import _ from 'lodash'

export default class Day extends Component<Props> {
  constructor(props){
    super(props);
    this.days = getDays();
  }
  shouldComponentUpdate(nextProps) {
    return false
  }
  renderDays = () => {
    let tmp = _.clone(this.days)
    let header = tmp.map((day, index)=>{

      //FIXME: not the best place to put style related code
      s = _.clone(style_day);
      s.borderRightWidth = 0
      s.borderLeftWidth = 0

      if(index === 0)
        s.borderLeftWidth = 1
      else if(index ===6)
        s.borderRightWidth = 1
  ////// END
      return (
          <View key={index} style={s}>
           <Text style={{color: 'black'}}>{(getCurrentLocale() ==='am' || getCurrentLocale() ==='ti')? day.substring(0, 2): day.substring(0,3)}</Text>
          </View>
        )
    })
    return header;
  }
  render() {
    return (
      <View style={{flexDirection: 'row', marginLeft: location.calLeft}}>
        {this.renderDays()}
      </View>
    )
  }
}

const style_day = {
  width:  location.cellX,
  height: location.cellY,
  justifyContent: 'center',
  alignItems: 'center',
  borderTopWidth: 2,
  borderBottomWidth: 1,
  //borderColor: '#22f2f2',
  borderColor: 'white',
  borderRightWidth: 0,
  borderLeftWidth: 0,
}

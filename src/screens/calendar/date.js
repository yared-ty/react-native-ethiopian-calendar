import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {location, getGeezNumbers} from '../../utils/global'
import translate, {getCurrentLocale} from '../../utils/language'

export default class Date extends Component<Props> {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps) {
   if(this.props.info.month === nextProps.info.month
     && this.props.info.day === nextProps.info.day
     && this.props.info.year === nextProps.info.year
     && this.props.lang=== nextProps.lang) {
     return false;
   }
   return true
 }
  renderGeez = (value) => {
    if(getCurrentLocale() !== 'am' && getCurrentLocale() !== 'ti')
      return null;
    let geez_num = getGeezNumbers();
    return (
      <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
        <Text style={{fontSize: 10.5}}>{geez_num[value - 1]}</Text>
      </View>
    )
  }
  viewTask = () => {
    this.props.navigator.push({
      screen: 'Ethcal.taskList',
      title: translate('TASK_header'),
      animated: true,
      animationType: 'fade',
      navigatorStyle: {
        tabBarHidden: true,
        drawUnderTabBar: true
      },
      passProps: {
        info: this.props.info,
      }
    })
  }
  render() {
    let color = 'black';
    style_date.backgroundColor = '#FDF2E9';

    if(this.props.today)
      style_date.backgroundColor = '#B2DFDB'

    if(!this.props.info.this_month)
      color = '#A9A9A9'

    if(this.props.info.holyDay != null){
    //  style_date.borderBottomColor='#00796B';
      //style_date.borderColor='#00796B'
      color='red'
    }
    else{
      style_date.borderBottomColor='white';
      style_date.borderColor='white'

    }

    if(getCurrentLocale() !== 'am' && getCurrentLocale() !== 'ti'){
      style_date.alignItems= 'center';
      style_date.justifyContent= 'center';
    }else {
      style_date.alignItems= null;
      style_date.justifyContent= null;
    }

    return (
      <TouchableOpacity
        style={style_date}
        onPress={this.viewTask}>
        {this.renderGeez(this.props.info.day)}
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: color}}>{this.props.info.day}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const style_date =  {
  backgroundColor: 'white',
  width: location.cellX,
  height: location.cellY,
  flexDirection: 'column',
//  justifyContent: 'center',
  //alignItems: 'center',
  borderRightWidth: 1,
  borderLeftWidth: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  //borderColor: '#003a66',
  borderColor: 'white',
  borderBottomColor: 'white'

}

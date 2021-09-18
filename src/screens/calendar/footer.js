import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getDays, getMonths, getMonthsOptions, getYearsOptions,location} from '../../utils/global'
import translate, {getCurrentLocale} from '../../utils/language';

export default class Footer extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      m_visible: false,
      y_visible: false
    }
    this.months = getMonths();
    this.months_options = getMonthsOptions();
    this.years_options = getYearsOptions();
  }
  shouldComponentUpdate(nextProps) {
    this.months = getMonths();
    this.months_options = getMonthsOptions();
    this.years_options = getYearsOptions();
   if(this.props.info.month === nextProps.info.month
     && this.props.info.year === nextProps.info.year 
     && this.props.lang === nextProps.lang) {
     return false;
   }
   return true
  }
  renderHolyDay = (weeks)=>{
    let h =[];

    for(let w=0; w < weeks.length; w++){
      for(let d=0; d < weeks[w].days.length; d++){
        if(weeks[w].days[d].holyDay != null)
          h.push(weeks[w].days[d]);
      }
    }
    if(!h.length){
      return(
        <View style={{flex: 1.18, marginLeft: location.calLeft}}>
          <View style={{height: 10}}/>
          <Text style={{color: '#A9A9A9'}}>{translate('CALENDAR_no_holyday')}</Text>
        </View>
      )
    }
    let holyDays = h.map((i, index)=> {
      return(
        <View style={{marginLeft: location.calLeft}} key={index}>
        <View style={{height: 2}}/>
          <Text style={{color: 'black'}} >  {this.months[i.month - 1]}  {i.day}:  {i.holyDay}</Text>
        </View>
      )
    });
    return holyDays

  }
  render(){
    return (
      <View style={{flex: 1.15}}>
        {this.renderHolyDay(this.props.info.weeks)}
      </View>
    )
  }
}

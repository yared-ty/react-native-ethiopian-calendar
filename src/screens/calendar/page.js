import React, {Component} from 'react';
import {Easing, FlatList, TouchableOpacity, StyleSheet, Text, View, Image, Animated, Dimensions, PanResponder} from 'react-native';
import {getDays, location} from '../../utils/global'
import {getCurrentLocale} from '../../utils/language';
import Day from './day'
import Title from './title'
import Footer from './footer';
import Date from './date'

import _ from 'lodash'

export default class Page extends Component<Props> {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps) {
   if(this.props.data.month === nextProps.data.month
     && this.props.data.year === nextProps.data.year
     && this.props.lang === nextProps.lang) {
     return false;
   }
   return true
  }
  handleMonthPicker = (picked) => {
    this.props.handleMonthPicker(picked)
  }
  handleYearPicker = (picked) => {
    this.props.handleYearPicker(picked)
  }
  renderWeek = (item) => {
    let start = false
    let week = item.days.map((e, index)=> {
      let key = index;
      let today = false;

      if(this.props.today.year == e.year
        && this.props.today.month == e.month
        && this.props.today.day == e.day){
          today = true;
      }
      return (
        <Date key={key} info={e} week_index={item.id} day_index={index} today={today} navigator={this.props.navigator} lang={this.props.lang}/>
      )
    });
    return (
      <View style={{flexDirection: 'row', marginLeft: location.calLeft}}>
        {week}
      </View>
    );
  }
  renderRow = (info) => {
    return (
      <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
        {this.renderWeek(info.item)}
      </View>
    )
  }
  keyExtractor(item, index) {
    return item.id+'i'+index;
  }
  renderSeparator() {
    return (
      <View style={{height: StyleSheet.hairlineWidth, backgroundColor: '#22f2f2'}}/>
    )
  }
  render(){
    return (
      <View style={{flex: 1, position: 'absolute', width: '100%'}}  key={this.props.index}>
        <Image source={require('../../assets/pad.jpg')} style={{height: '5%', width: '100%'}}/>
        <Animated.View
          ref={ci => this.animatedViewRef = ci}
          {...this.props.pan}
          style={[this.props.pageStyle, {backgroundColor: '#FDF2E9'}]}>
          <Title
            info={this.props.data}
            handleForward={this.props.handleForward}
            handleBack={this.props.handleBack}
            handleMonthPicker={this.handleMonthPicker}
            handleYearPicker={this.handleYearPicker}
            lang={this.props.lang}/>
          <View style={{height: 1, marginLeft:location.calLeft, marginRight: location.calRight, backgroundColor:'#009688'}}/>
          <View style={{flex: 1, height: Dimensions.get('window').height}}>
            <FlatList
              style={{flex: 3}}
              data={this.props.data.weeks}
              ListHeaderComponent={() => <Day load={true}/>}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderRow}
            />
            <View style={{height: 1, marginLeft:location.calLeft,  backgroundColor:'#009688'}}/>
            <Footer info={this.props.data} lang={this.props.lang}/>
          </View>
        </Animated.View>
      </View>
    )
  }
}

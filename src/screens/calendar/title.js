import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {getDays, getMonths, getMonthsOptions, getYearsOptions,location} from '../../utils/global'
import {getCurrentLocale} from '../../utils/language';
import MyPicker from './picker'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Page extends Component<Props> {
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

   if(this.props.info.month === nextProps.info.month
     && this.props.lang === nextProps.lang
     && this.props.info.year === nextProps.info.year) {
     return false;
   }
   this.months = getMonths();
   this.months_options = getMonthsOptions();
   return true
  }
  handleMonthPicker = (picked) => {
    this.setState({
      m_visible: false
    })
    this.props.handleMonthPicker(parseInt(picked))
  }
  handleYearPicker = (picked) => {
    this.setState({
      y_visible: false
    })
    this.props.handleYearPicker(parseInt(picked))
  }
  onCancel = () => {
    this.setState({
      m_visible: false,
      y_visible: false
    });
  }
  render(){
    return (
      <View style={styles.title_cont}>
        <TouchableOpacity style={styles.back} onPress={this.props.handleBack}>
	  <Icon name={'angle-left'} size={28} color={'#009688'}/>
        </TouchableOpacity >
        <View style={{ flexDirection: 'row', alignContent: 'center'}}>
          <MyPicker handlePicker={this.props.handleMonthPicker}
            visible={this.state.m_visible}
            selected={this.props.info.month.toString()}
            options={this.months_options}
            onCancel={this.onCancel}
            text={this.months[this.props.info.month -1]}
          />
          <View style={{width: 5}}/>
          <MyPicker handlePicker={this.props.handleYearPicker}
            visible={this.state.y_visible}
            selected={this.props.info.year.toString()}
            options={this.years_options}
            onCancel={this.onCancel}
            text={this.props.info.year.toString()}
          />
        </View>
        <TouchableOpacity  style={styles.next} onPress={this.props.handleForward}>
	  <Icon name={'angle-right'} size={28} color={'#009688'}/>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  title_cont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  back: {
    width: location.cellX,
    height: location.cellY,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  next: {
    width: location.cellX,
    height: location.cellY,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#003a66'
  }
})

import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, FlatList, Dimensions} from 'react-native';
import  IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import translate from '../utils/language';
import {getAllBeal} from '../algorithms/api';
import {convertToEth} from '../algorithms/converter';
import {getMonths, getMonthsOptions, getYearsOptions} from '../utils/global';
import MyPicker from './calendar/picker'

let moment = require('moment');

export default class HolyDay extends Component<Props> {
  constructor(props) {
    super(props);
    this.data = getAllBeal(this.getCurrentDate().year);
    this.months = getMonths();
    this.years_options = getYearsOptions();
    this.state = {
      visible: false,
      data: []
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = async(event) => {
    switch(event.id){
      case 'renew':
        this.data = getAllBeal(this.getCurrentDate().year);
        this.setState({
          data: this.data
        })
      break;
    }
  }
  componentDidMount() {
    Promise.all(
      [
        IconM.getImageSource('autorenew', 30, 'white'),

      ]
    ).then((values) => {
      this.renewIcon = values[0];
      this.navigationBar();
     });
  }
  navigationBar = () => {
    this.props.navigator.setButtons({
      rightButtons: [{
        title: 'Renew',
        buttonFontSize: 14,
        icon: this.renewIcon,
        id: 'renew'
      }],
      animated: true
    });
  }
  getCurrentDate = () => {
    let year = parseInt(moment().format('YYYY'));
    let month = parseInt(moment().format('MM'));
    let day = parseInt(moment().format('DD'));

    let et_date = convertToEth(day, month, year);
    return et_date;
  }
  handleYearPicker = (picked) => {
    let y = parseInt(picked)
    this.data = getAllBeal(y);

    this.setState({
      data: this.data,
      visible: false
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }
  renderRow = (info) => {
    return(
      <View style={styles.content}>
        <View style={styles.row}>
          <Text>{info.index + 1}.  {info.item.name}:  {this.months[info.item.month -1 ]}   {info.item.days},  {info.item.year}</Text>
        </View >
        <View style={styles.line}/>
      </View>
    )
  }
  keyExtractor(item, index) {
    return item.date+'i'+index;
  }
  renderHeader = (year) => {
     return(
       <View style={{marginTop: 10,height: 50, backgroundColor: '#FDF2E9',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{marginLeft: Dimensions.get('window').width/4}}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{translate('HOLYDAY_title')} </Text>
        </View>
        <View style={{marginRight: 50}}>
          <MyPicker handlePicker={this.handleYearPicker}
            visible={this.state.visible}
            selected={year.toString()}
            options={this.years_options}
            onCancel={this.onCancel}
            text={year.toString()}
            />
        </View>
       </View>
     )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          {this.renderHeader(this.data[0].year)}
          <View style={{height: 10}}/>
          <FlatList
            data={this.data}
            renderItem={this.renderRow}
            keyExtractor={this.keyExtractor}
            />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D0D3D4',
  },
  container2: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#D0D3D4'
  },
  content: {
    backgroundColor: '#FDF2E9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center'
 },
 line: {
   backgroundColor: '#CACFD2',
   height: 1
 }
});

//

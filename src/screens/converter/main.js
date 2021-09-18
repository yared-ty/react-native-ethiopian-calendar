import React, {Component} from 'react';
import {ScrollView,Keyboard,TextInput, ToastAndroid,Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import  IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Octicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Card} from 'react-native-elements'
import SwitchSelector from 'react-native-switch-selector';
import translate from '../../utils/language';
import {getMonths} from '../../utils/global';
import FloatingLabelInput from './floatingLabel';
import {getDayByName} from '../../algorithms/api';

import {
  convertToEth,
  convertToGreg,
} from '../../algorithms/converter'

let moment = require('moment');

class Converter extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      outputDate: {},
      toGregorian: false,
      toEthiopian: true,
      converted: false,
      refresh:false,
      year: parseInt(moment().format('YYYY')),
      month: parseInt(moment().format('MM')),
      day: parseInt(moment().format('DD'))
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = async(event) => {
    if (event.type == 'DeepLink') {
      if (event.link == 'converter') {
        this.props.navigator.switchToTab({
          tabIndex: 2
        })
      }
      if (event.link == 'lang') {
        this.setState({refresh: true});
        this.props.navigator.setTitle({title: translate('CONVERT_title')})
        this.props.navigator.setTabButton({
          label: translate('CONVERT_title')
        })
      }
    }
    switch(event.id){
      case 'menu':
        this.props.navigator.toggleDrawer({
          side: 'left'
        });
        break;
        case 'renew':
          this.setState({
            day: moment().date(),
            month: parseInt(moment().format('MM')),
            year: moment().year(),
            outputDate: {},
            converted: false,
          })
          break;
    }
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
  componentDidMount() {
    Promise.all(
      [
        IconM.getImageSource('autorenew', 30, 'white'),
      ]
    ).then((values) => {
      this.renewIcon = values[0];
      this.navigationBar();
     });
     Keyboard.dismiss()

  }
  validateInput = (type, value)=> {
    value = parseInt(value);
    let m = parseInt(this.state.month)
    let y = parseInt(this.state.year)
    let d = parseInt(this.state.day);

    if(this.state.toGregorian){
      switch (type) {
        case 'day':
          if(value < 0 || value > 30)
            return false
          if(m === 13 && value > 6){
            return false
          }
          if(m === 13 && !(y%4) && value === 6)
            return false;
          break;
        case 'month':
          if(value < 0 && value > 13)
            return false
          if(d > 6 &&value  ===13)
            return false
          if(!(y%4) && value === 13 && d === 6)
              return false;
            break;
        case 'year':
          if(parseInt(value) < 0)
            return false
        break;
      }
      return true;
    } else {
      switch (type) {
        case 'day':
          if(value < 0 || value > 31)
            return false
          if(m === 2 && value > 28)
            return false
          if((m === 4 || m === 6 ||  m === 9 || m === 11) && value === 31)
            return false
            break;
        case 'month':
          if(value < 0 || value > 12)
            return false
          if(d > 28 && value === 2)
            return false;
          if((value === 4 || value === 6 || value === 9 || value === 11) && m === 31)
            return false
            break;
        case 'year':
          if(value < 0)
            return false
          break;
      }
      return true;
    }
  }
  handleConvert = () => {
    let result = {}
    let y,m,d;

    if(this.state.year === '' || this.state.month ==='' || this.state.day ==='' || parseInt(this.state.year) < 1750){
      ToastAndroid.showWithGravity(
        'እባክዎን ቀን ያስገቡ...',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      this.setState({
        converted: false
      })
      Keyboard.dismiss()
      return;
    }
    if(this.state.toEthiopian){
      result = convertToEth(parseInt(this.state.day), parseInt(this.state.month), parseInt(this.state.year));
    }
    else {
      result = convertToGreg(parseInt(this.state.day), parseInt(this.state.month), parseInt(this.state.year));
    }
    Keyboard.dismiss()
    this.setState({
      converted: true,
      outputDate: result,
    })
  }
  handleCatagorySelector = () => {

    if(this.state.toGregorian){
      this.setState({
        toEthiopian: true,
        toGregorian: false,
        converted: false,
        year: parseInt(moment().format('YYYY')),
        month: parseInt(moment().format('MM')),
        day: parseInt(moment().format('DD'))
      });
    }
    else if(this.state.toEthiopian){
      let r = convertToEth(parseInt(moment().format('DD')), parseInt(moment().format('MM')), parseInt(moment().format('YYYY')))
      this.setState({
        toEthiopian: false,
        toGregorian: true,
        converted: false,
        year: r.year,
        month: r.month,
        day: r.day
      });
    }
  }
  onChangeText= (type, value) => {
    let status = this.validateInput(type, value);
    if(!status)
      return;
    switch (type) {
      case 'day':
          this.setState({day: value})
        break;
      case 'month':
          this.setState({month: value})
        break;
      case 'year':
        this.setState({year: value})
        break;
    }
  }
  renderTitle = () => {
    if(this.state.toGregorian)
      return translate('CONVERT_grdesc')
    return translate('CONVERT_etdesc');
  }
  renderDatePicker = () => {
    return (
      <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', height: 50}}>
            <Text style={{fontSize: 14,}}>{this.renderTitle()}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', height: 70, marginLeft: 20, marginRight: 20}}>

            <FloatingLabelInput
              onChangeText={(text)=> this.onChangeText('day', text)}
              value={this.state.day.toString()}
              label={translate('CONVERT_day')}
              maxLength={2}
             />
             <FloatingLabelInput
               onChangeText={(text)=> this.onChangeText('month', text)}
               value={this.state.month.toString()}
               label={translate('CONVERT_month')}
               maxLength={2}  //setting limit of input
              />
              <FloatingLabelInput
                onChangeText={(text)=> this.onChangeText('year', text)}
                value={this.state.year.toString()}
                label={translate('CONVERT_year')}
                maxLength={4}  //setting limit of input
               />
          </View>
      </View>
    )
  }
  renderFooter = () => {
    etDateView = () => {
      let d =  getDayByName(this.state.outputDate.year, this.state.outputDate.month, this.state.outputDate.day);
      let m = this.months[this.state.outputDate.month - 1];
      return  d + ' ,' + m + ' '+ this.state.outputDate.day +' ,' +this.state.outputDate.year;
    }
    gregDateView = () => {
      let str = this.state.outputDate.year + '-'+this.state.outputDate.month+'-'+this.state.outputDate.day;
      let d = moment(str, 'YYYY-MM-DD').toDate();
      return moment(d).format('dddd MMM Do YYYY')
    }
    return (
      <Card
        containerStyle={{backgroundColor:  '#FDF2E9'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 90}}>
          <Text style={{fontSize: 15,fontWeight: 'bold'}}> {this.state.toEthiopian? etDateView():gregDateView()}</Text>
        </View>
      </Card>
    )
  }
  renderConvertButton = () => {
    return(
      <View style={styles.MainContainer}>
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity = { .5 }
          onPress={this.handleConvert}
        >
          <Text style={styles.TextStyle}>{translate('CONVERT_convert')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    this.options = [
      {
        label: translate('CONVERT_toEth'),
        value: 1,
      },
      {
        label: translate('CONVERT_toGreg'),
        value: 2,
      }
    ];
    this.months = getMonths();
    return (
      <View style={{flex: 1, backgroundColor: '#D0D3D4'}}>
      <View style={{flex: 1,marginLeft: 25, marginRight: 25, backgroundColor: '#FDF2E9'}}>
        <View style={{paddingVertical: 20, marginRight: 15, marginLeft: 15}}>
          <SwitchSelector
           options={this.options}
           initial={0}
           selectedColor={'white'}
           buttonColor={'#00796B'}
           backgroundColor={'#FDF2E9'}
           borderColor={'#00796B'}
           hasPadding
           onPress={this.handleCatagorySelector} />
        </View>
        {this.renderDatePicker()}
        {this.renderConvertButton()}
        {this.state.converted? this.renderFooter():  null}
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    lineHeight: 20,
    marginTop: Platform.select({
      ios: 6,
      android: 3,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
  MainContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },

  SubmitButtonStyle: {
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    marginLeft:40,
    marginRight:40,
    backgroundColor:'#00796B',
    borderRadius:20,
    borderWidth: 1,
    borderColor: '#fff'
  },
  TextStyle:{
    color:'#fff',
    textAlign:'center',
    fontSize: 20,
  }
});
export default Converter;

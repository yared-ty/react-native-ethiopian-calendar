import React, {Component} from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {getDrawerMenu} from '../utils/global.js';
import {location} from '../utils/global'
import {convertToEth} from '../algorithms/converter';
import {getMonths} from '../utils/global';


let moment = require('moment');


export default class Drawer extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false
    }
    this.date = this.getCurrentDate();
    this.months = getMonths()
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = async(event) => {
    if (event.type == 'DeepLink') {
      if (event.link == 'lang') {
        this.months = getMonths();
        this.setState({refresh: true});
      }
    }
  }
  getCurrentDate = () => {
    let year = parseInt(moment().format('YYYY'));
    let month = parseInt(moment().format('MM'));
    let day = parseInt(moment().format('DD'));

    let et_date = convertToEth(day, month, year);
    return et_date;
  }
  handleAction = (route) => {
    this.props.navigator.handleDeepLink({link: route.id})
    this.props.navigator.toggleDrawer({
      side: 'left'
    });
  }
  render() {
    let d = getDrawerMenu();
    let menu = d.map((route, index) => {
    return (
        <TouchableHighlight
          key={route.id}
          underlayColor= '#dddddd'
          style={styles.list_container}
          activeOpacity={1}
          onPress={() => {this.handleAction(route)}}>
          <View style={styles.content}>
              {route.icon}
              <Text style={{fontSize: 13.5}} >   {route.title}</Text>
          </View>
        </TouchableHighlight>
      )
    });
   return (
      <ScrollView style={{ flex: 1, backgroundColor: '#eeee'}} contentContainerStyle={{flex:  1}}>
          <View style={{ flex: 1, backgroundColor: '#009688',alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.hexagon}>
              <Image source={require('../assets/pad.jpg')} style={{height: '20%', width: '100%'}}/>
              <View style={[styles.hexagonInner,{alignItems: 'center',justifyContent: 'center'}]}>
                <Text style={{color: '#efebe9', fontSize: 21, fontWeight: 'normal'}}>{this.months[this.date.month -1]}</Text>
                <Text style={{color: '#efebe9', fontSize: 21, fontWeight: 'normal'}}>{this.date.day}</Text>
              </View>
             {/* <View style={styles.hexagonBefore} />
              <View style={styles.hexagonAfter} /> */}
            </View>
          </View>
          <View style={{flex: 2.8, backgroundColor: 'white'}}>
            {menu}
          </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
 container: {
    height:50,
    borderTopWidth: 5,
    borderColor: '#efebe9',
  },
  list_container: {
    height: 5*location.cellX/4,
    borderTopWidth: 2,
    borderColor: '#efebe9',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  hexagon: {
    width: 100,
    height: 55
  },
  hexagonInner: {
    width: 100,
    height: 75,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,

    borderColor: '#efebe9',

    //backgroundColor: '#efebe9'
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -65,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 75,
    borderLeftColor: 'transparent',
    borderRightWidth: 75,
    borderRightColor: 'transparent',
    borderTopWidth: 50,
    borderTopColor: 'red'
  },
  hexagonBefore: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 75,
    borderLeftColor: 'transparent',
    borderRightWidth: 75,
    borderRightColor: 'transparent',
    borderBottomWidth: 50,
    borderBottomColor: 'green'

  }
});

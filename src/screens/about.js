import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, ImageBackground, Image} from 'react-native';
import  Icon from 'react-native-vector-icons/Feather';
import translate from '../utils/language';

export default class About extends Component<Props> {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#D0D3D4'}}>
      <View style={{flex: 1,marginLeft: 25, marginRight: 25, backgroundColor: '#FDF2E9'}}>
        <View style={{marginTop: 50, alignItems:'center'}}>
          <Text style={styles.text}>{translate('ABOUT_title')}</Text>
          <View style={{height: 2,  width: '100%'}}/>
          <View style={{height: 1,backgroundColor:'#009688', width: '100%'}}/>
        </View>
        <View style={styles.description}>
          <Text style={styles.text2}>{translate('ABOUT_desc')}</Text>
          <View style={{height: 3}}/>
          <Text style={styles.text2}>Version: {'1.0'}</Text>
          <View style={{height: 4}}/>
          <Text style={styles.text2}>Email: {'soltairj@gmail.com'}</Text>
          <Text style={styles.text2}>Powered By React Native</Text>
          <Text style={styles.text2}>     </Text>
        </View>
        <View style={styles.share}>
        </View>
      </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  description: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 37,
    marginRight: 37
  },
  share: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 50,
    marginRight: 50
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#009688'
  },
  text2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black'
  },
  icon_container: {
    width: 50,
    height: 50
  },
  icon: {
    width: '100%',
    height: '100%'
  },
});

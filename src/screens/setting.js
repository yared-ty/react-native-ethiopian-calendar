import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import  Icon from 'react-native-vector-icons/Feather';
import {lang_read, lang_write, lang_update} from '../db/lang';
import translate, {getCurrentLocale, setLocale} from '../utils/language';

export default class Setting extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      lang: getCurrentLocale()
    }
  }
  handleSelect = (id) => {
    setLocale(id);
    //store the change
    let d = lang_read();
    let lang = {
      id: d[0].id,
      locale: id
    }
    d[0] = lang;
    //updating language store
    lang_update(d, {id: lang.id});
    //Broacast the change
    this.props.navigator.handleDeepLink({link: 'lang'});
    this.setState({lang: id})
    //update drawer
    this.props.navigator.pop();

  }
  renderIcon = (id) => {
    if(id === this.state.lang){
      return (
        <Icon name='check' size={25} color={'#009688'}/>
      )
    }
    return null;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
        <View style={styles.content}>
          <TouchableOpacity onPress={()=> {this.handleSelect('am')}} style={styles.row}>
            <Text style={{fontFamily: 'sans-serif'}}>{translate('LANG_am')}</Text>
            {this.renderIcon('am')}
          </TouchableOpacity>
          <View style={styles.line}/>
          <TouchableOpacity onPress={()=> {this.handleSelect('or')}} style={styles.row}>
            <Text>{translate('LANG_or')}</Text>
            {this.renderIcon('or')}
          </TouchableOpacity>
          <View style={styles.line}/>
          <TouchableOpacity onPress={()=> {this.handleSelect('ti')}} style={styles.row}>
            <Text>{translate('LANG_ti')}</Text>
            {this.renderIcon('ti')}
          </TouchableOpacity>
          <View style={styles.line}/>
          <TouchableOpacity onPress={()=> {this.handleSelect('en')}} style={styles.row}>
            <Text>{translate('LANG_en')}</Text>
            {this.renderIcon('en')}
          </TouchableOpacity >
          <View style={styles.line}/>
        </View>
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
    backgroundColor: '#FDF2E9'
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

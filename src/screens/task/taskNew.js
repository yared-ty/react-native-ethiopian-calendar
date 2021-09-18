import React,{Component} from 'react'
import {Keyboard, ToastAndroid, Switch, TouchableOpacity, Text, View, Platform, TextInput, StyleSheet,Image,  ScrollView, ImageBackground} from 'react-native'
import {
  task_write,
  task_read,
  task_update
} from '../../db/tasks'
import {convertToGreg} from '../../algorithms/converter'
import {notify, test_notify} from '../../notif/notif'
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Octicons';
import  IconL from 'react-native-vector-icons/MaterialIcons';
import saveIcon from 'react-native-vector-icons/FontAwesome'
import translate from '../../utils/language';
let moment = require('moment');

export default class TaskNew extends React.Component {
  constructor(props){
    super(props)
    this.placeholder = 'type here...'
    this.state = {
      title: null,
      desc: null,
      time: null,
      notifyMe: false,
      visible: false,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.saveIcon  = ''
  }
  onNavigatorEvent = async(event) => {
    switch(event.id){
      case 'save':
        this.onSave();
        break;
    }
  }
  navigationBar = () => {
    this.props.navigator.setButtons({
      rightButtons: [{
        title: 'Save',
        buttonColor: 'white',
        icon: this.saveIcon,
        buttonFontSize: 14,
        buttonFontWeight: '600',
        buttonColor: 'white',
        id: 'save'
      }],
    });
  }
  componentDidMount(){
    this.navigationBar();
    this.props.navigator.setTitle({title: translate('TASKNEW_title')});

    this.props.navigator.setStyle({ navBarTitleTextCentered: true });
    if(this.props.task){
      this.setState({
        title: this.props.task.title,
        desc: this.props.task.desc,
        time: this.props.task.dueTime,
        notifyMe: this.props.task.notifyMe,
      })
    }
    Promise.all(
      [
        saveIcon.getImageSource('save', 25, 'white'),
      ]
    ).then((values) => {
      this.saveIcon = values[0];
      this.navigationBar();
     });
  }
  onChangeText(type, text) {
    if(type=== 'title')
      this.setState({title: text});
    else if(type=== 'desc')
      this.setState({desc: text});
  }
  onSave = () => {
    if(this.state.title && this.state.desc){
      let d = []
      let result = null
      let date =this.props.task?this.props.task.dueDate: this.props.selectedDate;
      let greg = convertToGreg(date.day, date.month, date.year);
      let greg_string = greg.year + '-'+greg.month+'-'+greg.day ;
      let time =   moment(this.state.time, 'seconds').format('LT');

      result = moment(greg_string + ' ' + time, 'YYYY-MM-DD HH:mm:ss').format();
      result = new Date(result);

      if(this.state.notifyMe && !this.state.time){
        alert(translate('Select time'));
       return;
      }
      d.push({
        title: this.state.title,
        desc: this.state.desc,
        id: this.props.task? this.props.task.id: '_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        dueDate:  this.props.task?this.props.task.dueDate: this.props.selectedDate,
        dueTime:  result,
        notifyMe: this.state.notifyMe
      })
      if(this.state.notifyMe){
       notify(d[0]);
      }
      if(!this.props.task)
        task_write(d)
      else
        task_update(d, {id: d[0].id});
      ToastAndroid.showWithGravity(
        'Task successfully saved',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      this.props.updateList();
      this.setState({
        title: null,
        desc: null,
        time: null,
        notifyMe: false,
      })
      this.props.navigator.pop();
    }
    else {
      alert(translate('TASKNEW_alert'));
    }
  }
  handleNotify = (value) => {
    this.setState({
      notifyMe: this.state.notifyMe? false: true
    })
  }
  handleDatePicked = (time) => {
    this.setState({time: time});
    this.hideDateTimePicker();
  }
  hideDateTimePicker = () => {
    this.setState({visible: false });
  }
  renderSelector = () => {
    this.setState({visible: true });
  }
  renderHeader =() => {
    return(
     <View style={{alignItems: 'center', marginTop: 15}}>
      <Text style={{ fontSize: 17, alignItems: 'center'}}>{translate('TASKNEW_title')}</Text>
     </View>
    )
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#D0D3D4'}} contentContainerStyle={{flex:  1}}>
        <View style={{flex: 1, backgroundColor: '#FDF2E9', marginLeft: 20, marginRight: 20,borderColor: '#003a66', borderWidth: 1}}>
          <Image source={require('../../assets/pad.jpg')} style={{height: '6%', width: '100%'}}/>
          {this.renderHeader()}
          <View style={{height: 5}}/>
          <View style={styles.separator}/>
          <View style={{height: 15}}/>
            <TextInput
              style={{height: 40, backgroundColor: '#FDF2E9',textAlignVertical: 'top'}}
              value= {this.state.title}
              accessible
              maxLength = {20}
              numberOfLines={1}
              placeholder={translate('TASK_tl') + ' ...'}
              onChangeText={(text) => this.onChangeText('title', text)}
              enablesReturnKeyAutomatically
              underlineColorAndroid="transparent"
              />
            <View style={styles.separator}/>
            <TextInput
              value={this.state.desc}
              style={{height: 80, backgroundColor: '#FDF2E9',textAlignVertical: 'top'}}
              accessible
              multiline={true}
              editable = {true}
              maxLength = {100}
              numberOfLines={12}
              placeholder={translate('TASK_desc') + ' ....'}
              onChangeText={(text) => this.onChangeText('desc', text)}
              enablesReturnKeyAutomatically
              underlineColorAndroid="transparent"
              />
            <View style={styles.separator}/>
            <View style={{height: 20}}/>
          <View style={styles.partThree}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, justifyContent: 'flex-start'}}>
                <TouchableOpacity
                  onPress={this.renderSelector} style={{flexDirection: 'row'}}>
                  <Icon size={30} name='calendar'/>
                  <Text>{'  ' + translate('TASK_dueAt')}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginRight: 20,flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
                <Switch onValueChange={this.handleNotify} value={this.state.notifyMe}/>
                <Text>{translate('TASK_notify')}</Text>
              </View>
              <DateTimePicker
                isVisible={this.state.visible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                mode={'time'}
                />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
   flex: 1,
    //marginTop: 20,
    backgroundColor: '#FDF2E9',
    justifyContent: 'space-between',
    //alignItems: 'center'
  },
  partOne: {
   flex: 1,
    margin: 20,
    //backgroundColor: '#F9E79F',
    margin: 10
  },
  partTwo: {
    flex: 1,
    margin: 20,
    margin: 10
  },
  partThree: {
    flex: 1,
    marginLeft: 20,
    //backgroundColor:  '#F9E79F',
    justifyContent: 'space-between',
    //alignItems: 'flex-start',
    //marginBottom: 50
  },
  partFour: {
    flex: 1,
    margin: 20,
    backgroundColor: 'orange',
    margin: 10
  },
  separator: {
    backgroundColor: 'black',
    height: 1
  }
});

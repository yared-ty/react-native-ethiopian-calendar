import React from 'react';
import {ToastAndroid,SectionList, FlatList,View,Text,StyleSheet,TouchableOpacity,Image,ImageBackground, Dimensions, ScrollView} from 'react-native';
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import  IconL from 'react-native-vector-icons/MaterialIcons';
import  IconR from 'react-native-vector-icons/Entypo';
import  IconB from 'react-native-vector-icons/FontAwesome5';
import translate from '../../utils/language';
import { CheckBox} from 'react-native-elements'
import {task_read,task_delete} from '../../db/tasks'
import {reqPermission,getToken,listenNotification} from '../../notif/api'
import {getDayName} from '../../algorithms/bahirehasab';
import {getMonths} from '../../utils/global';

import _ from 'lodash';

let moment = require('moment');

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      checked: 0,
      refresh: false
    };
    this.months = getMonths()
    this.tasks = []
    this.menuIcon = ''
    this.newIcon = ''
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = async(event) => {
    if (event.type == 'DeepLink') {
      if (event.link == 'taskNew') {
        this.props.navigator.switchToTab({
          tabIndex: 1
        });
        this.props.navigator.push({
          screen: 'Ethcal.taskNew',
          animated: true,
          animationType: 'fade',
          navigatorStyle: {
            tabBarHidden: true,
            drawUnderTabBar: true
          },
          passProps: {
            updateList: this.updateList,
          }
        })
      }
    }
    switch(event.id){
      case 'add':
      case 'fab-add':
        if(!this.props.info){
          ToastAndroid.showWithGravity(
            'Select Date',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          this.props.navigator.pop();
          return;
        }
        this.props.navigator.push({
          screen: 'Ethcal.taskNew',
          animated: true,
          animationType: 'fade',
          navigatorStyle: {
            tabBarHidden: true,
            drawUnderTabBar: true
          },
          passProps: {
            updateList: this.updateList,
            selectedDate: {
              day: this.props.info.day,
              month: this.props.info.month,
              year: this.props.info.year
            }
          }
        })
        break;
    }
  }
  navigationBar = () => {
    this.props.navigator.setButtons({
        rightButtons: [{
          title: 'Add',
          buttonColor: 'white',
          icon: this.rightIcon,
          buttonFontSize: 14,
          buttonFontWeight: '600',
          buttonColor: 'white',
          id: 'add'
        }],
        fab: this.props.info? {
          collapsedId: 'fab-add',
          collapsedIcon: this.rightIcon,
          backgroundColor: '#009688',
          collapsedIconColor: 'white'
        }: null,
      });
      if(this.props.info){
        this.props.navigator.setTitle({title: this.months[this.props.info.month -1].substring(0, 7) + '  ' +this.props.info.day +', ' + this.props.info.year});
      }
  }
  componentDidMount() {
    let d;

    if(this.props.info){
      let inp = {
        day: this.props.info.day,
        month: this.props.info.month,
        year: this.props.info.year
      };
      d =  task_read({dueDate: inp});
    }
    else {
      d = task_read();
    }
    d =  _.map(d, (i) => {
            i.selected =false;
            return i;
         });
    this.setState({data: this.sectionData(d)});
    Promise.all(
      [
        IconL.getImageSource('add', 20, 'white'),
      ]
    ).then((values) => {
      this.rightIcon = values[0];
      this.navigationBar();
    });
  }
  sectionData = (_data)=> {
    _data  = _.map(_data, (i)=>{
      let m_off = (i.dueDate.month ===13)?5:30;
      m_off = (m_off ===5 && i.dueDate.year%4)? 6 : 5;
      i.order  = i.dueDate.day + i.dueDate.month*m_off + (i.dueDate.year*12*30 + m_off);
      return i;
    });
    _data = _.groupBy(_data, d=> (d.order));
    _data = _.reduce(_data, (acc, next, index)=> {
      acc.push({
        key: index,
        data: _.orderBy(next, ['dueTime'],['asc'])
      })
      return acc;
    }, [])
    _data = _.orderBy(_data, ['key'],['asc']);
    return _data;
  }
  updateList = () => {
    let d;
    if(this.props.info){
      d =  task_read({dueDate: {
        day: this.props.info.day,
        month: this.props.info.month,
        year: this.props.info.year
      }});
    }
    else {
      d = task_read();
    }
    d =  _.map(d, (i) => {
        i.selected =false;
        return i;
      });
    this.setState({data: this.sectionData(d)});
  }
  handleDelete = () => {
    for (let i = 0; i < this.tasks.length; i++){
      task_delete({id: this.tasks[i]});
    }
    this.updateList();
    this.setState({checked: 0});
  }
  renderTaskNew = (item) => {
    this.props.navigator.push({
      screen: 'Ethcal.taskNew',
      animated: true,
      animationType: 'fade',
      navigatorStyle: {
        tabBarHidden: true,
        drawUnderTabBar: true
      },
      passProps: {
        task: item,
        updateList: this.updateList
      }
    });
  }
  onChecked =(item) => {
    if(item.selected === true){
      item.selected = false;
      this.tasks = _.filter(this.tasks, (t)=> t != item.id)
      --this.state.checked;
      this.setState({checked: this.state.checked})

    }
    else {
      item.selected =  true;
      this.tasks.push(item.id);
      ++this.state.checked;
      this.setState({checked: this.state.checked})
    }
  }
  renderItem = (info) => {
    return (
      <View style={{flex: 1}}>
      <View style={styles.container}>
        <CheckBox
          containerStyle={{justifyContent: 'flex-start',   backgroundColor: '#FDF2E9'}}
          size={20}
          checked={info.item.selected}
          onIconPress={()=> {this.onChecked(info.item)}}/>
        <TouchableOpacity style={styles.content}>
          <View style={styles.title}>
            <Text style={{fontWeight: 'bold'}}>{info.item.title}</Text>
            <Text>{info.item.desc}</Text>
            <Text>
              {translate('TASK_dueAt')}: {moment(info.item.dueTime, 'seconds').format('LT')}
            </Text>
          </View>
          <TouchableOpacity style={styles.time} onPress={() => this.renderTaskNew(info.item)}>
            <IconL name={'edit'} size={20} coloe={'#003a66'}/>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={{height: 2, backgroundColor: '#EAF2F8'}}/>
      </View>
    )
  }
  keyExtractor(item, index) {
    return item.id + "" +index;
  }
  renderSeparator = () =>{
    return (
      <View style={styles.separator}/>
    )
  }
  renderHeader =() => {
    return(
     <View style={{alignItems: 'center', marginTop: 15}}>
      <Text style={{fontSize: 17, alignItems: 'center'}}>{translate('TASK_header')}</Text>
     </View>
    )
  }
  renderFooter = () => {
    if(this.state.checked > 0)
      return (
        <TouchableOpacity
          onPress={() => {this.handleDelete()}}
          style={{height: 40, width: '100%', backgroundColor: 'green'}}>
          <Text style={{color: 'white', fontSize: 18, alignSelf: 'center', fontWeight: 'bold'}}>{translate('TASK_delete')} ( {this.state.checked } )</Text>
        </TouchableOpacity>
      );
  }
  renderSectionHeader = ({section: {data}})=> {
    return (
      <View style={{backgroundColor: '#FDF2E9'}}>
        <Text style={{ color: 'black', fontWeight: 'bold'}}>
          {this.months[data[0].dueDate.month -1 ] +' '+data[0].dueDate.day + ', '+data[0].dueDate.year}
        </Text>
        <View style={{height: 4}}/>
      </View>
    )
  }
  renderEmpty = () => {
    let d = [0, 1, 2, 3, 4, 5, 6];

    d = d.map((i) => {
      return(
        <View key={i}>
          <View style={{backgroundColor:'#FDF2E9' , height: Dimensions.get('window').height/13}}/>
          <View style={{backgroundColor:'#009688' , height: 1}}/>
        </View>
      )
    });
    if(!this.props.info) {
      return (
        <View style={{flex: 1}}>
          {d}
          <View style={{flex: 1}}>
            <Text>{translate('TASK_noTask')}</Text>
            <TouchableOpacity onPress={()=> {
              ToastAndroid.showWithGravity(
                'Select Date',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
              this.props.navigator.pop()}}>
              <IconB name={'arrow-left'} size={30} color={'#009688'}/>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={{flex: 1}}>
          {d}
          <View style={{flex: 1}}>
            <Text>{translate('TASK_noTask2')}</Text>
          </View>
        </View>
      )
    }
  }
  render() {

     return (
       <ScrollView style={{ flex: 1, backgroundColor: '#D0D3D4'}} contentContainerStyle={{flex:  1}}>
         <View style={{flex: 1, backgroundColor: '#FDF2E9', marginLeft: 20, marginRight: 20,borderColor: '#009688', borderWidth: 1, marginBottom: 5}}>
          <Image source={require('../../assets/pad.jpg')} style={{height: '7%', width: '100%'}}/>
          {this.renderHeader()}
          <View style={{height: 3}}/>
          <View style={{height: 1, marginLeft:20, marginRight: 20, backgroundColor:'#009688'}}/>
          <SectionList
            style={styles.root}
            extraData={this.state}
            sections={this.state.data}
            renderSectionHeader={this.renderSectionHeader}
            renderSectionFooter={this.renderSeparator}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            />
          </View>
        {this.renderFooter()}
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //width: 200
  },
  title: {
    flex:3,
    flexDirection: 'column',
    alignItems: 'flex-start',
    //width: 200
  },
  time: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  root: {
  //  backgroundColor: '#F9E79F',
    backgroundColor: '#FDF2E9',
    marginRight: 15,
    marginLeft: 15,
    marginTop: 2,
    marginBottom: 5,
  },
  separator: {
    backgroundColor: '#003a66',
    height: 0.5
  }
})

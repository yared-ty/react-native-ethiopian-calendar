import React, {Component} from 'react';
import {Linking,StyleSheet, Text, View, Image, Share, PanResponder, Animated, Dimensions} from 'react-native';
import  Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMonths, getMonthsOptions, getYearsOptions} from '../../utils/global';
import {getPages, getPrevPage, getNextPage,getCurrentPage,renderShare, renderSetting, renderAbout, renderAllHolyDay, renderConvert, renderTaskList, renderRateApp} from './utils'
import {convertToEth, convertToGreg} from '../../algorithms/converter'
import {location} from '../../utils/global'
import {getCurrentLocale} from '../../utils/language';
import translate from '../../utils/language'
import Page from './page'
import {reqPermission,getToken,listenNotification} from '../../notif/api'
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'react-native-admob'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

let moment = require('moment');

export default class Calendar extends Component<Props> {
  bottomSheet: BottomSheet

  constructor(props){
    super(props);
    this.today_et ={}
    this.today_gr = {}

    this.position = new Animated.ValueXY();
    this.swipedPosition = new Animated.ValueXY({x: -SCREEN_WIDTH, y: 0});
    let swiped = {
        transform: this.swipedPosition.getTranslateTransform()
    }
    let swipe = {
      transform: this.position.getTranslateTransform()
    }
    this.pageStyle = [swiped, swipe, {}];
    this.state = {
      animatedData: [],
      curr_y: 2011,
      curr_m: 1,
      refresh:false
    }
    this.today_gr.year = parseInt(moment().format('YYYY'));
    this.today_gr.month = parseInt(moment().format('MM'));
    this.today_gr.day = parseInt(moment().format('DD'));

    this.months = getMonths();
    this.months_options = getMonthsOptions();
    this.years_options = getYearsOptions();

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  componentWillMount(){
    this.today_et = convertToEth(this.today_gr.day, this.today_gr.month, this.today_gr.year);
    this.setState({
      curr_y: this.today_et.year,
      curr_m: this.today_et.month,
    });
    this.initPanResponder();
  }
  componentDidMount(){
    this.setState({
      animatedData: getPages(this.state.curr_m, this.state.curr_y)
    });
    Promise.all(
      [
        Icon.getImageSource('menu', 26, 'white'),
        Icon.getImageSource('calendar-today', 26, 'white'),

      ]
    ).then((values) => {
        this.leftIcon = values[0];
        this.rightIcon = values[1];
        this.navigationBar();
     });
     reqPermission();
     getToken((token) => {
     });
     listenNotification((notif) => {
       // handle when notification Tray is opened.
     });
  }
  initPanResponder = () => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, g) =>{
        return Math.abs(g.dx) > 15
      },
      onPanResponderGrant: (e, gestureState) => {
      },
      onPanResponderMove: (e, gestureState) => {
        if(gestureState.dx > 0){
          this.swipedPosition.setValue({
            x: -SCREEN_WIDTH + gestureState.dx,
            y: 0
          })
        }else {
          this.position.setValue({x: gestureState.dx, y:0});
        }
      },
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if(gestureState.dx > 50 ){
          Animated.timing(this.swipedPosition, {
            toValue: {x: 0, y: 0},
            duration: 100,
            useNativeDriver: true
          }).start( () => {
            this.handleBack();
            this.swipedPosition.setValue({x: -SCREEN_WIDTH, y:0});
          })
        }
        if(-gestureState.dx > 50){
            Animated.timing(this.position, {
              toValue: ({x: -SCREEN_WIDTH, y: 0}),
              duration: 100,
              useNativeDriver: true
            }).start(() => {
              this.handleForward();
              this.position.setValue({ x: 0, y: 0 })
            })
        }
        else {
          Animated.spring(this.position, {
            toValue: ({x: 0, y: 0}),
            useNativeDriver: true
          }).start()
        }
      }
    })
  }
  onNavigatorEvent = async(event) => {
    if (event.type == 'DeepLink') {
      if (event.link == 'share') {
        this.props.navigator.switchToTab({
          tabIndex: 0
        });
        renderShare(Share);
      }
      if (event.link == 'language') {
        this.props.navigator.switchToTab({
          tabIndex: 0
        });
        renderSetting(this.props.navigator);
      }
      if (event.link == 'about') {
        this.props.navigator.switchToTab({
          tabIndex: 0
        });
        renderAbout(this.props.navigator);
      }
      if (event.link == 'rate') {
        renderRateApp(Linking);
      }

      if (event.link == 'holyday') {
        this.props.navigator.switchToTab({
          tabIndex: 0
        });
        renderAllHolyDay(this.props.navigator);
      }
      if (event.link == 'taskList') {
        renderTaskList(this.props.navigator);
      }
      if (event.link == 'converter') {
        renderConvert(this.props.navigator);
      }
      if (event.link == 'lang') {
        this.months = getMonths();
        this.months_options = getMonthsOptions();
        this.years_options = getYearsOptions();
        this.navigationBar();
        this.props.navigator.setTabButton({
          label: translate('CALENDAR_title')
        })
        this.setState({animatedData: getPages(this.state.curr_m, this.state.curr_y)});
      }
    }
    switch(event.id){
      case 'today':
        this.setState({
          curr_y: this.today_et.year,
          curr_m: this.today_et.month,
          animatedData: getPages(this.today_et.month, this.today_et.year)
        });
        break;
      case 'menu':
        this.props.navigator.toggleDrawer({
          side: 'left'
        });
        break;
    }
  }
  setTitle = () => {
    this.props.navigator.setTitle({title: translate('CONVERT_today') + ', ' + this.months[this.today_et.month -1].substring(0, 7) + '  ' +this.today_et.day +', ' + this.today_et.year});
    this.props.navigator.setStyle({ 
      navBarTitleTextCentered: true,
      navBarTextFontSize:18
    });
  }
  navigationBar = () => {
    this.props.navigator.setButtons({
      rightButtons: [{
        title: translate('CONVERT_today'),
        buttonColor: 'white',
        buttonFontSize: 16,
        icon: this.rightIcon,
        id: 'today'
      }],
      leftButtons: [{
        title: 'Menu',
        buttonFontSize: 14,
        icon: this.leftIcon,
        id: 'menu'
      }],

      animated: true
    });
    this.setTitle();
  }
  handleBack = () => {
    let m = this.state.curr_m -1 ? this.state.curr_m - 1: 13;
    let y = this.state.curr_m - 1 ? this.state.curr_y: this.state.curr_y - 1;

    let t = [];
    t.push(getPrevPage(m, y))
    t.push(this.state.animatedData[0])
    t.push(this.state.animatedData[1])

    this.setState({
      curr_y: y,
      curr_m: m,
      animatedData: t
    })
  }
  handleForward = () => {
    let y=   (this.state.curr_m === 13)? this.state.curr_y + 1: this.state.curr_y;
    let m =  (this.state.curr_m === 13)? 1: this.state.curr_m + 1;
    let d = this.state.animatedData

    d.splice(0, 1);
    d.push(getNextPage(m, y));

    this.setState({
      curr_y: y,
      curr_m: m,
      animatedData: d
    });
  }
  handleMonthPicker = (m) => {
    this.setState({
      curr_m: parseInt(m),
      animatedData: getPages(parseInt(m), this.state.curr_y),
    })
  }
  handleYearPicker = (y) => {
    this.setState({
      curr_y: parseInt(y),
      animatedData: getPages(this.state.curr_m, parseInt(y)),
    });
  }
  renderAnimated = () => {
    let animatedView =  this.state.animatedData.map((d, index) => {
      let pan = /*index < 2?*/ this.panResponder.panHandlers//: {}

      return (
        <Page
          data={d}
          key={index}
          pageStyle={this.pageStyle[index]}
          pan={pan}
          lang={getCurrentLocale()}
          handleMonthPicker={this.handleMonthPicker}
          handleYearPicker={this.handleYearPicker}
          handleForward={this.handleForward}
          handleBack={this.handleBack}
          today={this.today_et}
          navigator={this.props.navigator}
          />
        )
    }).reverse();
    return animatedView;
  }
  renderPageOne = () => {
      let pan = this.panResponder.panHandlers

      return (
        <Page
          data={this.state.animatedData[0]}
          key={0}
          pageStyle={this.pageStyle[0]}
          pan={pan}
          lang={getCurrentLocale()}
          handleMonthPicker={this.handleMonthPicker}
          handleYearPicker={this.handleYearPicker}
          handleForward={this.handleForward}
          handleBack={this.handleBack}
          today={this.today_et}
          navigator={this.props.navigator}
          />
        )
  }
  renderPageTwo = () => {
      let pan = this.panResponder.panHandlers//: {}

      return (
        <Page
          data={this.state.animatedData[1]}
          key={1}
          pageStyle={this.pageStyle[1]}
          pan={pan}
          lang={getCurrentLocale()}
          handleMonthPicker={this.handleMonthPicker}
          handleYearPicker={this.handleYearPicker}
          handleForward={this.handleForward}
          handleBack={this.handleBack}
          today={this.today_et}
          navigator={this.props.navigator}
          />
        )
  }

  renderPageThree = () => {
      let pan = /*index < 2?*/ this.panResponder.panHandlers//: {}

      return (
        <Page
          data={this.state.animatedData[2]}
          key={2}
          pageStyle={this.pageStyle[2]}
          pan={pan}
          lang={getCurrentLocale()}
          handleMonthPicker={this.handleMonthPicker}
          handleYearPicker={this.handleYearPicker}
          handleForward={this.handleForward}
          handleBack={this.handleBack}
          today={this.today_et}
          navigator={this.props.navigator}
          />
        )
  }
  render() {
    if(!this.state.animatedData.length){
      return(
        <View style={{flex: 1, backgroundColor: '#D0D3D4'}}>
          <View style={{flex: 1,backgroundColor: '#FDF2E9', marginLeft: location.bgLeft, marginRight: location.bgRight,borderColor: '#003a66', borderWidth: 1}}>
              <Image source={require('../../assets/pad.jpg')} style={{height: '7%', width: '100%'}}/>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#009688', fontSize: 16}}>Loading...</Text>
              </View>
            </View>
        </View>
      )
    }
    return(
      <View style={{flex: 1, backgroundColor: '#D0D3D4'}}>
        <View style={{flex: 1,backgroundColor: '#FDF2E9', marginLeft: location.bgLeft, marginRight: location.bgRight,borderColor: '#003a66', borderWidth: 1}}>
        {this.renderPageThree()}
        {this.renderPageTwo()}
        {this.renderPageOne()}
        </View>
      </View>
    )
  }
}
            //testDevices={[AdMobBanner.simulatorId]}
          /*<AdMobBanner
            adSize="fullBanner"
            adUnitID="your-admob-unit-id"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.error(error)}*/

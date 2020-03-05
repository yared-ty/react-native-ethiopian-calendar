import React, {Component} from 'react';
import {TextInput,Platform, StyleSheet, Text, View, Animated} from 'react-native';

export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }
  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const labelStyle = {
      position: 'absolute',
      left: 30,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 16],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
    };
    return (
      <View>
        <Animated.Text style={labelStyle}>
          {this.props.label}
        </Animated.Text>
        <TextInput
          {...this.props}
          style={styles.textInput}
          keyboardType='numeric'
          placeholderTextColor={'#A9A9A9'}
          textAlign={'center'}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid="#003a66"
         />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 20,
    width: 70,
    marginTop: Platform.select({
      ios: 6,
      android: 3,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
});

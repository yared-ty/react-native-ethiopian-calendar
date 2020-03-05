import React, { Component } from 'react'
import ModalSelector from 'react-native-modal-selector'

export default class MyPicker extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      picked: null
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
   if(this.props.text === nextProps.text) {
     return false;
   }
   return true
  }
  componentDidMount(){
    this.setState({visible: this.props.visible})
  }
  componentWillReceiveProps(nextProps){
    this.setState({visible: nextProps.visible})
  }
  onCancel = ()=> {
    this.setState({visible: false});
    this.props.onCancel();
  }
  handlePicker = (picked) => {
    this.props.handlePicker(picked.key)
  }
  render() {
    return (
      <ModalSelector
        visible={this.state.visible}
        onChange={this.handlePicker}
        data={this.props.options}
        supportedOrientations={['landscape']}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onModalClose={this.onCancel}
        initValue={this.props.text}
        animationType	={'slide'}
        optionTextStyle={{color: '#009688'}}
      />
    )
  }
}

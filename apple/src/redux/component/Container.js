import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../actions/action';
import Header from './Header';
import Content from './Content';
import {ThemeContext} from './ThemeContext';


 class Container extends Component{

    render(){

      let {color, actions} = this.props;
      let test1 = {
        test:"get value from parent by context"
      }


      return (
        <ThemeContext.Provider value={test1}>
          <div>
            <Header color={color.color} changeColor={actions.changeRed} />
            <Content color={color.color} changeColor={actions.changeBlue}/>
          </div>
        </ThemeContext.Provider>

      );
    }





}
const mapStateToProps = state => ({
    color : state.color
})

const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
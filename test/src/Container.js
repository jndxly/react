import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import actions from './redux/actions/action';
import Header from './redux/component/Header';
import Content from './redux/component/Content';




class Container extends Component{



  // 返回Context对象，方法名是约定好的
  getChildContext () {
    return {
      test:"test"
    }
  }

    render(){

        let {color, actions} = this.props;


        return (
            <div>
                <Header color={color.color} changeColor={actions.changeRed} />
                <Content color={color.color} changeColor={actions.changeBlue}/>
            </div>
        );
    }





}

Container.childContextTypes = {
  test: PropTypes.string
}
const mapStateToProps = state => ({
    color : state.color
 })

const mapDispatchToProps = dispatch => ({
     actions:bindActionCreators(actions, dispatch)
 })

 export default connect(mapStateToProps, mapDispatchToProps)(Container)
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import actions from './redux/actions/action';
import Header from './redux/component/Header';
import Content from './redux/component/Content';
import {ThemeContext} from './ThemeContext'




class Container extends Component{





    render(){

        let {color, actions} = this.props;
        let test1 = {
          test:"aaa"
        }

      return (
        <div>
          <Header color={color.color} changeColor={actions.changeRed} />
          <Content color={color.color} changeColor={actions.changeBlue}/>
        </div>
      );


        // return (
        //   <ThemeContext.Provider value={test1}>
        //     <div>
        //       <Header color={color.color} changeColor={actions.changeRed} />
        //       <Content color={color.color} changeColor={actions.changeBlue}/>
        //     </div>
        //   </ThemeContext.Provider>
        //
        // );
    }





}


const mapStateToProps = state => ({
    color : state.color
 })

const mapDispatchToProps = dispatch => ({
     actions:bindActionCreators(actions, dispatch)
 })

 export default connect(mapStateToProps, mapDispatchToProps)(Container)
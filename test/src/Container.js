import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from './redux/actions/action';
import Header from './redux/component/Header';
import Content from './redux/component/Content';

//
// const mapStateToProps = state => ({
//     color : state.color
// })
//
// const mapDispatchToProps = dispatch => ({
//     actions:bindActionCreators(actions, dispatch)
// })
//
// @connect(mapStateToProps, mapDispatchToProps)
 class Container extends Component{

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
const mapStateToProps = state => ({
    color : state.color
})

const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
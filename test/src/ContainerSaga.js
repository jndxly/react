import React,{Component} from 'react';
import {connect} from "react-redux";


import Header from './saga/component/Header';
import Content from './saga/component/Content';


class ContainerSaga extends Component{

    render(){

        let {color} = this.props;


        return (
            <div>
                <Header  />
                <Content />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    color : state.color
})

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerSaga)



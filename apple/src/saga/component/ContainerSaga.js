import React,{Component} from 'react';
import {connect} from "react-redux";


import Header from './Header';
import Content from './Content';


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



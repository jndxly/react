import React, { Component } from 'react';
import {connect} from "react-redux";

class Header extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }


    render () {
        let {color, changeColor} = this.props;

        return (
            <div>
                <h1 style={{ color: color.color }}>this is header</h1>
                <button
                    style={{ color: color.color }}
                    onClick={()=>this.props.changeColor("blue")}>Red</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    color : state.color
})

const mapDispatchToProps = dispatch => {
    return {
        changeColor: (color)=>dispatch({
            type:"CHANGE_COLOR",
            color:"red"
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
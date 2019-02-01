import React, { Component } from 'react'
import {connect} from "react-redux";

class Content extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }

    render () {

        let {color, changeColor} = this.props;

        return (
            <div>
                <h2 style={{ color: color.color }}>this is content</h2>
                <button
                    style={{ color: color.color }}
                    onClick={()=>this.props.changeColor("blue")}>Blue</button>
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
            color:color
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)
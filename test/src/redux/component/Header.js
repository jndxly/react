import React, { Component } from 'react'

class Header extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }


    render () {
        let {color, changeColor} = this.props;

    	return (
          <div>
       		   <h1 style={{ color: color }}>this is header</h1>
             <button
              style={{ color: color }}
              onClick={changeColor.bind(this)}>Red</button>
          </div>
        )
    }
}

export default Header
import React, { Component } from 'react'

class Header extends Component {

    static defaultProps = {
      color: 'gray',
      switchColor: function(){}
    }

    render () {
    	return (
          <div>
       		   <h1 style={{ color: this.props.color }}>this is header</h1>
             <button
              style={{ color: this.props.color }}
              onClick={this.props.switchColor.bind(this, 'red')}>Red</button>
          </div>
        )
    }
}

export default Header
import React, { Component } from 'react'

class Content extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }

  render () {

    let {color, changeColor} = this.props;

    return (
      <div>
        <h2 style={{ color: color }}>this is content</h2>
        <button
          style={{ color: color }}
          onClick={changeColor.bind(this)}>Blue</button>
      </div>
    )
  }
}

export default Content
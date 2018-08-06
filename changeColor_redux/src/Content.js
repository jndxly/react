import React, { Component } from 'react'

class Content extends Component {

  static defaultProps = {
    color: 'gray',
    switchColor: function(){}
  }

  render () {
    return (
      <div>
        <h2 style={{ color: this.props.color }}>this is content</h2>
        <button
          style={{ color: this.props.color }}
          onClick={this.props.switchColor.bind(this, 'blue')}>Blue</button>
      </div>
    )
  }
}

export default Content
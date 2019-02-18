import React, { Component } from 'react';
import {observer} from 'mobx-react';

@observer
class Content extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }

  render () {

    let {color, changeBlue} = this.props.store;

    return (
      <div>
        <h2 style={{ color: color }}>this is content</h2>
        <button
          style={{ color: color }}
          onClick={changeBlue.bind(this)}>Blue</button>
      </div>
    )
  }
}

export default Content
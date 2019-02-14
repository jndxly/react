import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Content extends Component {

    static defaultProps = {
        color: 'gray',
        changeColor: function(){}
    }

  render () {

    const {
      test
    } = this.context;

    let {color, changeColor} = this.props;

    return (
      <div>
        <h2 style={{ color: color }}>{test}</h2>
        <button
          style={{ color: color }}
          onClick={changeColor.bind(this)}>Blue</button>
      </div>
    )
  }
}
Content.contextTypes = {
  test:PropTypes.string
}

export default Content
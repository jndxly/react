import React, { Component } from 'react';
import {ThemeContext} from './ThemeContext';

class Content extends Component {



  render () {

    let {color, changeColor} = this.props;

    return (
      <ThemeContext.Consumer>
        {name => <div>
          <h2 style={{ color: color }}>
            {name.test}
          </h2>
          <button
            style={{ color: color }}
            onClick={changeColor.bind(this)}>Blue</button>
        </div>}

      </ThemeContext.Consumer>

    )
  }
}

export default Content
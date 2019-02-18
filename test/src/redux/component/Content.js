import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ThemeContext} from '../../ThemeContext'


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

    // return (
    //   <ThemeContext.Consumer>
    //     {name => <div>
    //       <h2 style={{ color: color }}>
    //         {name.test}
    //       </h2>
    //       <button
    //         style={{ color: color }}
    //         onClick={changeColor.bind(this)}>Blue</button>
    //     </div>}
    //
    //   </ThemeContext.Consumer>
    //
    // )
  }
}


export default Content
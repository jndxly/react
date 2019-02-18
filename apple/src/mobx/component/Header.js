import React, { Component } from 'react';
import {observer} from 'mobx-react';

@observer
class Header extends Component {

    render () {
        let {color, changeRed} = this.props.store;

    	return (
          <div>
       		   <h1 style={{ color: color }}>this is header</h1>
             <button
              style={{ color: color }}
              onClick={changeRed.bind(this)}>Red</button>
          </div>
        )
    }
}

export default Header
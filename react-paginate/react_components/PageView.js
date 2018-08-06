'use strict';

import React, { Component } from 'react';

class PageView extends Component{

  render(){
    let cssClassName = this.props.pageClassName;
    const linkClassName = this.props.pageLinkClassName;
    const onClick = this.props.onClick;
    const href = this.props.href;
    let ariaLabel = 'Page ' + this.props.page +
      (this.props.extraAriaContext ? ' ' + this.props.extraAriaContext : '');
    let ariaCurrent = null;

    if (this.props.selected) {
      ariaCurrent = 'page';
      ariaLabel = 'Page ' + this.props.page + ' is your current page';
      if (typeof(cssClassName) !== 'undefined') {
        cssClassName = cssClassName + ' ' + this.props.activeClassName;
      } else {
        cssClassName = this.props.activeClassName;
      }

    }

    return (
      <li className={cssClassName}>
        <a onClick={onClick}
           role="button"
           className={linkClassName}
           href={href}
           tabIndex="0"
           aria-label={ariaLabel}
           aria-current={ariaCurrent}
           onKeyPress={onClick}>
          {this.props.page}
        </a>
      </li>
    )
  }

}

// const PageView = (props) => {
//   let cssClassName = props.pageClassName;
//   const linkClassName = props.pageLinkClassName;
//   const onClick = props.onClick;
//   const href = props.href;
//   let ariaLabel = 'Page ' + props.page +
//     (props.extraAriaContext ? ' ' + props.extraAriaContext : '');
//   let ariaCurrent = null;
//
//   if (props.selected) {
//     ariaCurrent = 'page';
//     ariaLabel = 'Page ' + props.page + ' is your current page';
//     if (typeof(cssClassName) !== 'undefined') {
//       cssClassName = cssClassName + ' ' + props.activeClassName;
//     } else {
//       cssClassName = props.activeClassName;
//     }
//   }
//
//   return (
//       <li className={cssClassName}>
//           <a onClick={onClick}
//              role="button"
//              className={linkClassName}
//              href={href}
//              tabIndex="0"
//              aria-label={ariaLabel}
//              aria-current={ariaCurrent}
//              onKeyPress={onClick}>
//             {props.page}
//           </a>
//       </li>
//   )
// }

export default PageView;

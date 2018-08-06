import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Square extends React.Component {

    constructor(){
        super();

    }

    render() {
        return (
            <button className="square" onClick={()=>this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}


export  default Square;
// module.exports = {
//     Square:Square
// };

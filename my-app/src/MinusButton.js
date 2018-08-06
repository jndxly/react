import React from 'react';
import ReactDOM from 'react-dom';

class MinusButton extends React.Component{

    constructor(props){
        super(props);
        this.btnMinHandler = this.btnMinHandler.bind(this);
    }

    btnMinHandler(){
        this.props.btnMinusHandler();
    }

    render(){
        return (
            <button onClick={this.btnMinHandler}>-1</button>
        );
    }
}
export default MinusButton;
import React from 'react';
import ReactDOM from 'react-dom';

class CountButton extends React.Component{

    constructor(props){
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(){
        this.props.clickHandler();
    }

    render(){
        let text = this.props.btnText;
        return (
            <button onClick={this.clickHandler}>{text}</button>
        );
    }
}

export default CountButton
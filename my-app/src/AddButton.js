import React from 'react';
import ReactDOM from 'react-dom';

class AddButton extends React.Component{

    constructor(props){
        super(props);
        this.btnAddHandler = this.btnAddHandler.bind(this);
    }

    btnAddHandler(){
        this.props.btnAddHandler();
    }

    render(){
        return (
            <button onClick={this.btnAddHandler}>+1</button>

        );
    }
}

export default AddButton
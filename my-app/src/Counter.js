import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component{

    constructor(props){
        super(props);
    }



    render(){
        var count = this.props.count;
        return (
            <span>{count}</span>
        );
    }
}

export default Counter
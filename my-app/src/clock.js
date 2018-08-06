import React from 'react';
import ReactDOM from 'react-dom';
class Clock extends React.Component{
    constructor(props){
        super(props);
        this.state = {date:new Date()};
    }

    handlerClick = ()=>{
        console.log('this is : ' + this);
    }

    componentDidMount(){
        this.timeId = setInterval(()=>this.tick(), 1000);
    }

    componentWillUnmount(){
        clearInterval(this.timeId);
    }

    tick(){
        this.setState({
            date:new Date()
        });
    }

    render(){
        return(
            <div>
                <h1>hello world</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
                <button onClick={this.handlerClick}>aaa</button>
            </div>

        );
    }
}

ReactDOM.render(<Clock/>,
    document.getElementById('root')
);
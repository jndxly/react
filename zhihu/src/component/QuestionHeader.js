import React from 'react';
import ReactDOM from 'react-dom';

class QuestionHeader extends React.Component{

    constructor(props){
        super(props);
        this.btnAddHandler = this.btnAddHandler.bind(this);
    }

    btnAddHandler(){
        this.props.btnAddHandler();
    }


    render(){
        return (
            <div>
                <h1>React问答</h1>
                <button className="btn-add" onClick={this.btnAddHandler}>添加问题</button>
            </div>
        );

    }

}

export default QuestionHeader;
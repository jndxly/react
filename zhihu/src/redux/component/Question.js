import React from 'react';
import ReactDOM from 'react-dom';

class  Question extends React.Component{


    constructor(props){
        super(props);
        this.btnAddQuestion = this.btnAddQuestion.bind(this);
    }
    btnAddQuestion(){
        var title = this.refs.title.value;
        var desc = this.refs.desc.value;

        this.props.submitQuestion({
            title:title,
            description:desc
        });
    }



    render(){
        const visible = this.props.questionVisible;
        if(visible){
            return (
                <div>
                    <div>
                        <label>问题：</label>
                        <input placeholder="标题" ref="title"/>
                    </div>
                    <div>
                        <textarea placeholder="问题的描述" ref="desc"></textarea>
                    </div>
                    <div>
                        <button onClick={this.btnAddQuestion}>确认</button>
                        <button onClick={this.props.cancelQuestion}>取消</button>
                    </div>
                </div>
            );
        }
        else{
            return (
                ""
            );
        }



    }
}
export default Question;
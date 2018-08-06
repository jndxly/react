import React from 'react';
import ReactDOM from 'react-dom';

class QuestionHeader extends React.Component{






    render(){

        let {addQuestion} = this.props;

        return (
            <div>
                <h1>React问答</h1>
                <button className="btn-add" onClick={addQuestion}>添加问题</button>
            </div>
        );

    }

}

export default QuestionHeader;
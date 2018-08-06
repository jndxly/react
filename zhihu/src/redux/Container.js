import  React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from './actions/questionAction';


import QuestionHeader from './component/QuestionHeader';
import Question from './component/Question';
import QuestionList from './component/QuestionList'


class Container extends React.Component{

    constructor(props){
        super(props);


    }



    render(){

        const {question, actions} = this.props;
        const list = question.questionList;

        return (
            <div>
                <QuestionHeader addQuestion={actions.addQuestion}/>
                <Question submitQuestion={actions.submitQuestion} cancelQuestion={actions.cancelQuestion} questionVisible={question.questionVisible}/>
                <QuestionList questionList={list} addVotes={actions.addVotes} minusVotes={actions.minusVotes}></QuestionList>
            </div>
        )


    }

}
const mapStateToProps = state => ({
    question: state.question
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);

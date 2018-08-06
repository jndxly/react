import React,{Component} from 'react';
import QuestionItem from './QuestionItem';

class QuestionList extends Component{

    constructor(props){
        super(props);
        this.votesHander = this.votesHander.bind(this);
    }

    votesHander(add, id){
        this.props.votesHander(add, id);
    }

    render(){
        var me = this;
        const {questionList} = this.props;

        const arr = questionList.map(
            function(item, index){
                return (
                    <QuestionItem votesHander={me.votesHander} key={item.id} item={item}/>
                )
            }
        );

        return (
            <div>
                {arr}
            </div>
        )


    }


}

export default QuestionList ;
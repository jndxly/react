import React,{Component} from 'react';
import QuestionItem from './QuestionItem';

class QuestionList extends Component{





    render(){
        const {questionList, addVotes, minusVotes} = this.props;

        const arr = questionList.map(
            function(item, index){
                return (
                    <QuestionItem addVotes={addVotes} minusVotes={minusVotes} key={item.id} item={item}/>
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
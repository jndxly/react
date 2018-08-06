import React,{Component} from 'react';
import ListTitle from './ListTitle';
import ListContent from './ListContent';

class   QuestionItem extends Component{





    render(){

        const {id,title, description,voteCount} = this.props.item;

        return (
            <div>
                <ListTitle addVotes={this.props.addVotes} minusVotes={this.props.minusVotes} id={id} title={title} votes={voteCount}/>
                <ListContent desc={description}/>
            </div>
        )
    }

}

export default QuestionItem;
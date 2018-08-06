import React,{Component} from 'react';
import ListTitle from './ListTitle';
import ListContent from './ListContent';

class   QuestionItem extends Component{

    constructor(props){
        super(props);
        this.votesHander = this.votesHander.bind(this);
    }

    votesHander(add, id){
        this.props.votesHander(add, id);
    }

    render(){

        const {id,title, description,voteCount} = this.props.item;

        return (
            <div>
                <ListTitle votesHandler={this.props.votesHander} id={id} title={title} votes={voteCount}/>
                <ListContent desc={description}/>
            </div>
        )
    }

}

export default QuestionItem;
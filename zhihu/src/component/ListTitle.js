import React,{Component} from 'react';

class ListTitle extends Component{


    constructor(props){
        super(props);
        this.addVotes = this.addVotes.bind(this);
        this.minusVotes = this.minusVotes.bind(this);
    }

    addVotes(){
        this.props.votesHandler(true, this.props.id);
    }

    minusVotes(){
        this.props.votesHandler(false, this.props.id);
    }

    render(){
        const votes = this.props.votes;
        const title = this.props.title;
        return (
            <div>
                <button onClick={this.addVotes}>{votes}</button>
                <button onClick={this.minusVotes}></button>
                <h2>{title}</h2>
            </div>
        );
    }

}

export default ListTitle;
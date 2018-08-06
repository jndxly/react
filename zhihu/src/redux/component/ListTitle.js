import React,{Component} from 'react';

class ListTitle extends Component{






    render(){

        const {addVotes, minusVotes, id, title, votes} = this.props;
        return (
            <div>
                <button onClick={addVotes.bind(this, id)}>{votes}</button>
                <button onClick={minusVotes.bind(this,id)}></button>
                <h2>{title}</h2>
            </div>
        );
    }

}

export default ListTitle;
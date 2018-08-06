import React,{Component} from 'react';

class ListContent extends Component{





    render(){
        const desc = this.props.desc;
        return (
            <div>
                <span>{desc}</span>
            </div>
        );
    }

}

export default ListContent;
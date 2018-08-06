import React,{Component} from 'react';

class ListContent extends Component{


    constructor(props){
        super(props);
    }



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
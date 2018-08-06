import React from 'react';
import ReactDOM from 'react-dom';
import AddButton from "./AddButton";
import MinusButton from "./MinusButton";
import Counter from "./Counter";
import CountButton from "./CountButton";


class ButtonBar extends React.Component{

    constructor(props){
        super(props);

        this.btnAddHandler = this.btnAddHandler.bind(this);
        this.btnMinusHandler = this.btnMinusHandler.bind(this);
    }

    btnAddHandler(){

        this.props.btnClickHandler(true);
    }

    btnMinusHandler(){
        this.props.btnClickHandler(false);
    }
    render(){

        let count = this.props.count;

        return (
            <div>


                <CountButton btnText={'+1'} clickHandler={this.btnAddHandler}/>
                {'  '}
                <CountButton btnText={'-1'}  clickHandler={this.btnMinusHandler}/>
                {'     '}
               <Counter count={count}/>
            </div>
        );
    }
}
export default ButtonBar;
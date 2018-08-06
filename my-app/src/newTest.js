import React from 'react';
import ReactDOM from 'react-dom';

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
                <button onClick={this.btnAddHandler}>+1</button>
                {' '}
                <button onClick={this.btnMinusHandler}>-1</button>
                {'   '}
                <span >{count}</span>
            </div>
        );
    }
}

class RecordBar extends React.Component{

    constructor(){
        super();

        this.btnClickHandler = this.btnClickHandler.bind(this);

        this.state = {
            click:'',
            num:0,
            record:'',
            arr:[]
        }
    }

    btnClickHandler(isAdd){
        let count = this.state.num, recordStr = this.state.record;
        if(isAdd){
            count += 1;
        }
        else{
            count -= 1;
        }
        // count += isAdd?1:-1;
        let date = new Date();
        let dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
         recordArr = this.state.arr.slice(0);
        recordArr.push(dateStr);

            recordStr +=    '<p>' + dateStr + '</p>';
            // arr.push(dateStr);
            // recordStr +=  '<p>' + dateStr + '</p>';


        this.setState({
            click:isAdd,
            record:recordStr,
            num:count,
            arr:recordArr
        });
    }


    render(){

        let isAdd = this.state.click;
        let recordStr = {__html:this.state.record};
        let recordArr = this.state.arr;






        return (
            <div>
                <ButtonBar
                    btnClickHandler={ this.btnClickHandler}
                    count={this.state.num}
                />
                <hr/>
                <div>
                    {
                        recordArr.map((item, index)=>(
                            <p key={index}>{item}</p>
                        ))
                    }
                </div>


                {/*// /!*<div >{this.state.record}</div>*!/*/}
            </div>
        );
    }
}



ReactDOM.render(
    <RecordBar />,
    document.getElementById('root')
);
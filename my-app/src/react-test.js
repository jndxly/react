import React from 'react';
import ReactDOM from 'react-dom';
import ButtonBar1 from "./ButtonBar";









class RecordBar extends React.Component{

    constructor(){
        super();

        this.btnClickHandler = this.btnClickHandler.bind(this);

        this.state = {
            click:'',
            num:0,
            record:''
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
        let date = new Date();
        let dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        recordStr +=    '<p>' + dateStr + '</p>';


        this.setState({
            click:isAdd,
            record:recordStr,
            num:count
        });
    }


    render(){

        let isAdd = this.state.click;
        var recordStr = {__html:this.state.record};





        return (
            <div>
                <ButtonBar1
                    btnClickHandler={ this.btnClickHandler}
                    count={this.state.num}
                />
                <hr/>
                <div
                    dangerouslySetInnerHTML={{
                        __html: this.state.record
                    }}>
                </div>


            </div>
        );
    }
}



ReactDOM.render(
    <RecordBar />,
    document.getElementById('root')
);
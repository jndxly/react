import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from './actions/btnActions';
import DateItem from './DateItem';

class Container extends React.Component{

    getItem(records){
        let arr = [];
        records.forEach((item,index ) =>{
            arr.push(
                <DateItem dateStr={item} key={index}/>
            );
        })
        return arr;
    }

    render(){
        let {btnState, actions}  = this.props;
        let {count, records}  = btnState;


        return (
            <div>
                <div className="tool-bar">
                    <button onClick={actions.add}>+1</button>
                    <button  onClick={actions.minus}>-1</button>
                    <span>{count}</span>
                </div>
                <hr/>
                <div>
                    {this.getItem(records)}
                </div>
            </div>
        );
    }


}

const mapStateToProps = state=>({
    btnState : state.btnReducer
})

const mapDispatchToProps = dispatch=>({
    actions:bindActionCreators(actions, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Container);
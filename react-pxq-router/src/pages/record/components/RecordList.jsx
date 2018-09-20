import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '@/api/api';
import './recordList.less';

export default class RecordList extends Component{

    state = {
        recordData :[]
    }

    getRecord = async type => {
        try{
            let result = await API.getRecord({type});
            this.setState({
                recordData : result.data || []
            });
        }
        catch (e) {
            console.log(e)
        }
    }

    componentWillReceiveProps(nextProps){
        let currentype = this.props.location.pathname.split("/")[2];
        let type = nextProps.location.pathname.split("/")[2];
        if(currentype != type){
            this.getRecord(type);
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }

    componentWillMount(){
        let type = this.props.location.pathname.split("/")[2];
        this.getRecord(type);
    }





    render(){
        return (
            <ul className="record-list-con">
                {
                    this.state.recordData.map((item, index)=>{
                        return <li className="record-item" key={index}>
                            <section className="record-item-header">
                                <span >创建时间:{item.created_at}</span>
                                <span> {item.type_name}</span>
                            </section>
                            <section className="record-item-content">
                                <p><span>用户名:</span>{item.customer_name} &emsp; {item.customer_phone}</p>
                                <p><span>商&emsp;品:</span>{item.product[0].product_name}</p>
                                <p><span>金&emsp;额</span>{item.sales_money} &emsp; 佣金{item.commission}</p>
                            </section>
                            <p className="record-item-footer">等待管理员审核，审核通过后，佣金将结算至账户</p>
                        </li>
                    })
                }
            </ul>
        );
    }
}
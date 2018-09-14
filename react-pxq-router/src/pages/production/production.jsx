import React,{Component} from 'react';
import {is, formJS} from 'immutable';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import PublicHeader from '../../components/header/header';


class Production extends Component{
    
    static propTypes = {
        proData : PropTypes.object.isRequired,
        getProData:PropTypes.func.isRequired,
        togSelectPro:PropTypes.func.isRequired,
        editPro:PropTypes.func.isRequired
    }

    toggleSelect = index =>{
        this.props.toggleSelectPro(index);
    }

    handleEdit = (index, num)=>{
        let currentNum = this.props.proData.dataList[index].selectNum + num;
        if(currentNum < 0){
            return;
        }
        this.props.editPro(index, currentNum)
    }

    shouldComponentUpdate(nextProps, nextState){
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    componentDidMount(){
        if(!this.props.proData.dataList.length){
            this.props.getProData();
        }
    }
    

    
    render(){
        
        return (
            <main>
                <PublicHeader title="首页" confirm />
                <section className="pro-list-con">
                    <ul className="pro-list-ul">
                        {
                            this.props.proData.dataList.map((item, index)=>{
                                return <li className="pro-item" key={index}>
                                    <div className="pro-item-select" onClick={this.toggleSelect.bind(this, index)}>
                                        <span className={`icon-xuanze pro-select-status ${item.selectStatus?'pro-selected' : ''}`}></span>
                                        <span className="pro-name">{item.product_name}</span>
                                    </div>
                                    <div className="pro-item-edit">
                                        <span className="icon-jian" onClick={this.handleEdit.bind(this, -1)}></span>
                                        <span className="pro-num">{item.selectNum}</span>
                                        <span className="icon-jia" onClick={this.handleEdit(this, 1)}></span>
                                    </div>

                                </li>
                            })
                        }
                        
                    </ul>
                </section>
            </main>
        );
        
    }

}
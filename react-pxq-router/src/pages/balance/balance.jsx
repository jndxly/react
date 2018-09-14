import React, {Component} from 'react';
import PublicHeader from "../../components/header/header";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import PublicAlert from "../../components/alert/alert";
import API  from '../../api/api'
import './balance.less';




class BrokeRage extends Component{

    state = {
        applyNum : '',
        alertTip:'',
        alertStatus:false,
        balance:{
            balance:0
        }
    }

    handleInput = (event)=>{
        let value = event.target.value;
        if(/^\d*?\.?\d{0,2}$/gi.test(value)){
            if(/^0+[1-9]+/.test(value)){
                value = value.replace(/^0+/,'');
            }
            if(/0{2}\./.test(value)){
                value.replace(/^0+/,'0')
            }
            value = value.replace(/^\./gi,'0.');
            if(parseFloat(value) > 200){
                value = '200.00'
            }
            this.setState({

            })
        }
    }

    submitForm = ()=>{
        let alertTip;
        if(!this.state.applyNum){
            alertTip = "请输入提现金额";
        }
        else if(parseFloat(this.state.applyNum) > this.state.balance.balance){
            alertTip = "申请提现金额不能大于余额";
        }
        else{
            alertTip = "提现成功"
        }
        this.setState({
            alertTip,
            applyNum:'',
            alertStatus:true
        })
    }

    cloAlert = ()=>{
        this.setState({
            alertStatus:false,
            alertTip:''
        })
    }


    componentDidMount(){
        this.initData();
    }
    initData = async()=>{
        try{
            let result = await API.getBalance()
            this.setState({
                balance:result
            })
        }
        catch (e) {

        }
    }


    render(){
        return (
            <main className="home-container">
                <PublicHeader title="提现" record/>

                <div className="broke-main-content">
                    <p className="broke-header">您的可提现金额为：¥{this.state.balance.balance}</p>
                    <form className="broke-form">
                        <p>请输入提现金额（元）</p>
                        <p>¥ <input type="text" value={this.state.applyNum} placeholder="0.00" onInput={this.handleInput} maxLength="5"/></p>
                    </form>
                    <TouchableOpacity className="submit-btn" clickCallBack={this.submitForm} text="申请提现"/>
                </div>
                <PublicAlert closeAlert={this.cloAlert} alertTip={this.state.alertTip} alertStatus={this.state.alertStatus}/>
            </main>
        );
    }
}
export default BrokeRage;
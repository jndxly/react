import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Login.css';
import { Base64 } from 'js-base64';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AppID: 'wxa8db9d8cb328d179',
            redirect_uri: 'http%3a%2f%2fweixin.91smart.net',
            phone: '15850035363',
            code: '111111',
            code_btntxt: '获 取',
            pwd: '',
            showpwd: false,
            userName:"",
            password:""
        };
    }

    componentWillMount() {
        let code = this.getparses(window.location.search).code;
        let state = this.getparses(window.location.search).state;
        try {
            if (code) {
                if ((state === 'weixin' && window.location.host === 'weixin.91smart.net') || (state === 'test_weixin' && window.location.host === '172.168.11.124:8060')) {
                    if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== undefined && sessionStorage.getItem('user') !== '') {
                        this.props.sessionLogged(JSON.parse(Base64.decode(sessionStorage.user)));
                    } else if (localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== '') {
                        this.props.sessionLogged(JSON.parse(Base64.decode(localStorage.user)));
                    } else {
                        this.props.wxLogin(code);
                    }
                } else if ((state === 'qq' && window.location.host === 'weixin.91smart.net') || (state === 'test_qq' && window.location.host === '172.168.11.124:8060')) {
                    if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== undefined && sessionStorage.getItem('user') !== '') {
                        this.props.sessionLogged(JSON.parse(Base64.decode(sessionStorage.user)));
                    } else if (localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== '') {
                        this.props.sessionLogged(JSON.parse(Base64.decode(localStorage.user)));
                    } else {
                        this.props.qqLogin(code);
                    }
                } else {
                    if (state === 'test_qq' || state === 'test_weixin') {
                        window.location.href = window.location.href.replace('weixin.91smart.net', '172.168.11.124:8060');
                    }
                }
            } else {
                if (sessionStorage.getItem('user') !== null && sessionStorage.getItem('user') !== undefined && sessionStorage.getItem('user') !== '') {
                    this.props.sessionLogged(JSON.parse(Base64.decode(sessionStorage.user)));
                } else if (localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== '') {
                    this.props.sessionLogged(JSON.parse(Base64.decode(localStorage.user)));
                }
            }
        } catch (e) {
            // console.log(e);
            sessionStorage.setItem('user', '');
            localStorage.setItem('user', '');
            window.location.reload();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    getparses = (str) => {
        var obj = {};
        var reg = /[?&][^?&]+=[^?&]+/g;
        var arr = str.match(reg);
        if (arr) {
            arr.forEach(function (item) {
                var tempArr = item.substring(1).split('=');
                var key = decodeURIComponent(tempArr[0]);
                var val = decodeURIComponent(tempArr[1]);
                obj[key] = val;
            });
        }
        return obj;
    };

    getcode_login = () => {
        const { setLoginError } = this.props;
        const { phone, code_btntxt } = this.state;
        if (phone === '') {
            setLoginError('请输入手机号！');
        } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
            setLoginError('请输入有效的手机号！');
        } else {
            setLoginError('');
            if (code_btntxt === '获 取') {
                this.props.sendPhoneMsgLogin(phone);
                this.setState({ code_btntxt: '60s重新获取' });
                this.timer = setInterval(() => {
                    if (isNaN(parseInt(this.state.code_btntxt, 10))) {
                        this.setState({ code_btntxt: '60s重新获取' });
                    } else if (parseInt(this.state.code_btntxt, 10) - 1 !== 0) {
                        this.setState({ code_btntxt: parseInt(this.state.code_btntxt, 10) - 1 + 's重新获取' });
                    } else {
                        this.setState({ code_btntxt: '获 取' });
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000);
            }
        }
    }

    getcode_bind = () => {
        const { setLoginError } = this.props;
        const { phone, code_btntxt } = this.state;
        if (phone === '') {
            setLoginError('请输入手机号！');
        } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
            setLoginError('请输入有效的手机号！');
        } else {
            setLoginError('');
            if (code_btntxt === '获 取') {
                this.props.sendPhoneMsgBind(phone);
                this.setState({ code_btntxt: '60s重新获取' });
                this.timer = setInterval(() => {
                    const time = parseInt(this.state.code_btntxt, 10);
                    if (time > 1) {
                        this.setState({ code_btntxt: parseInt(this.state.code_btntxt, 10) - 1 + 's重新获取' });
                    } else {
                        this.setState({ code_btntxt: '获 取' });
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000);
            }
        }
    }

    userLogin = ()=>{
        const {userName, password} = this.state;
        const { setLoginError } = this.props;
        if(userName === ""){
            setLoginError('请输入用户名！');
        }
        else if(password === ""){
            setLoginError('请输入密码！');
        }
        if((userName == "ihchen1" && password == "ihchen1") || (userName == "ihchen2" && password == "ihchen2")){
            this.props.phoneLogin({
                code:this.state.code,
                userName,
                password
            });
        }
        else {
            setLoginError('用户名或密码错误！');
        }
    }

    phonelogin = () => {
        const { phone, code } = this.state;
        const { setLoginError } = this.props;
        if (phone === '') {
            setLoginError('请输入手机号！');
        } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
            setLoginError('请输入有效的手机号！');
        } else {
            if (code === '') {
                setLoginError('请输入验证码！');
            } else {
                this.props.phoneLogin(code);
            }
        }

    }

    accountlogin = () => {
        const { phone, pwd } = this.state;
        const { setLoginError } = this.props;
        if (phone === '') {
            setLoginError('请输入手机号！');
        } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
            setLoginError('请输入有效的手机号！');
        } else {
            if (pwd === '') {
                setLoginError('请输入密码！');
            } else {
                this.props.accountLogin(phone, pwd);
            }
        }
    }

    phonebind = () => {
        const { phone, code } = this.state;
        const { setLoginError } = this.props;
        if (phone === '') {
            setLoginError('请输入手机号！');
        } else if (phone.match(/^[1][3,4,5,7,8][0-9]{9}$/) === null) {
            setLoginError('请输入有效的手机号！');
        } else {
            if (code === '') {
                setLoginError('请输入验证码！');
            } else {
                this.props.phoneBind(code);
            }
        }
    }

    userNameChange = (e)=>{
      this.setState({
          userName:e.target.value
      })
    }
    passwordChange = (e)=>{
      this.setState({
          password:e.target.value
      })
    }

    phonechange = (e) => {
        this.setState({ phone: e.target.value });
    }

    toggleshowpwd = () => {
        this.setState({ showpwd: !this.state.showpwd });
    }

    codechange = (e) => {
        this.setState({ code: e.target.value });
    }

    pwdchange = (e) => {
        this.setState({ pwd: e.target.value });
    }

    logintabchange = (way) => {
        this.props.setRouter('Login-' + way);
    }

    backlogin = () => {
        sessionStorage.setItem('user', '');
        window.location.href = 'http://' + window.location.host;
    }

    randerloginbox = () => {
        let temp = null;
        const showpwd = this.state.showpwd;
        switch (this.props.router.split('-')[1]) {
            case 'Phone':
                temp =
                    <div className="with-phone">
                        <div className="login-way">
                            {/*<span className="current" onClick={() => this.logintabchange('Phone')}>手机登录</span>*/}
                            {/*<span className="current" onClick={() => this.logintabchange('Phone')}>用户名</span>*/}
                            {/*<span onClick={() => this.logintabchange('WeiXin')}>微信登录</span>*/}
                            {/*<span onClick={() => this.logintabchange('QQ')}>QQ登录</span>*/}
                        </div>
                        <div className="phone-group">
                            <input type="text" placeholder="手机号" className="phone-input" value={this.state.phone} onChange={this.phonechange} />
                            <input type="text" placeholder="用户名" value={this.state.userName} onChange={this.userNameChange} />
                        </div>
                        {/*<div className="code-group">*/}

                        <input type="text" className="phone-input" placeholder="验证码" value={this.state.code} onChange={this.codechange} />
                        {/*<div className={'code-btn ' + (this.state.code_btntxt === '获 取' ? '' : 'disabled')} onClick={this.getcode_login}>{this.state.code_btntxt}</div>*/}
                        {/*</div>*/}
                        <div className="pwd-group">
                            <input type={showpwd ? 'text' : 'password'} autocomplete = 'new-password' placeholder="密码"  onChange={this.passwordChange} />
                            <div className={'showpwd fa ' + (showpwd ? 'fa-eye' : 'fa-eye-slash')} title={showpwd ? '隐藏密码' : '显示密码'} onClick={this.toggleshowpwd}></div>
                        </div>
                        <div className="login-btn" onClick={this.userLogin}>登 录</div>
                        {/*<p className="loginwith-password"><i onClick={() => this.logintabchange('Account')}>账号密码登录</i></p>*/}
                        {this.props.loginerror === '' ? null : <p className="error">{this.props.loginerror}</p>}
                    </div>;
                break;
            case 'PhoneBind':
                temp =
                    <div className="with-phone">
                        <div className="back-login" onClick={this.backlogin}>{'<返回'}</div>
                        <h3>手机绑定</h3>
                        <div className="phone-group">
                            <input type="text" placeholder="手机号" value={this.state.phone} onChange={this.phonechange} />
                        </div>
                        <div className="code-group">
                            <input type="text" placeholder="验证码" value={this.state.code} onChange={this.codechange} />
                            <div className={'code-btn ' + (this.state.code_btntxt === '获 取' ? '' : 'disabled')} onClick={this.getcode_bind}>{this.state.code_btntxt}</div>
                        </div>
                        <div className="login-btn" onClick={this.phonebind}>确认绑定</div>
                        {this.props.loginerror === '' ? null : <p className="error">{this.props.loginerror}</p>}
                    </div>;
                break;
            case 'Account':

                temp =
                    <div className="with-account">
                        <div className="login-way">
                            <span className="current" onClick={() => this.logintabchange('Phone')}>手机登录</span>
                            <span onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
                            <span onClick={() => this.logintabchange('QQ')}>QQ登录</span>
                        </div>
                        <div className="phone-group">
                            <input type="text" placeholder="手机号" value={this.state.phone} onChange={this.phonechange} />
                        </div>
                        <div className="pwd-group">
                            <input type={showpwd ? 'text' : 'password'} placeholder="密码" value={this.state.pwd} onChange={this.pwdchange} />
                            <div className={'showpwd fa ' + (showpwd ? 'fa-eye' : 'fa-eye-slash')} title={showpwd ? '隐藏密码' : '显示密码'} onClick={this.toggleshowpwd}></div>
                        </div>
                        <div className="login-btn" onClick={this.accountlogin}>登 录</div>
                        <p className="loginwith-password"><i onClick={() => this.logintabchange('Phone')}>手机验证码登录</i></p>
                        {this.props.loginerror === '' ? null : <p className="error">{this.props.loginerror}</p>}
                    </div>;
                break;
            case 'WeiXin':
                temp = <div className="with-weixin">
                    <div className="login-way">
                        <span onClick={() => this.logintabchange('Phone')}>手机登录</span>
                        <span className="current" onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
                        <span onClick={() => this.logintabchange('QQ')}>QQ登录</span>
                    </div>
                    <iframe title="微信登录" src={'https://open.weixin.qq.com/connect/qrconnect?appid=' + this.state.AppID + '&redirect_uri=' + this.state.redirect_uri + '&response_type=code&href=https://web-1251001942.cossh.myqcloud.com/css/wxcode.css&scope=snsapi_login&state=' + (window.location.host === 'weixin.91smart.net' ? '' : 'test_') + 'weixin#wechat_redirect'}></iframe>
                </div>;
                break;
            case 'QQ':
                temp = <div className="with-qq">
                    <div className="login-way">
                        <span onClick={() => this.logintabchange('Phone')}>手机登录</span>
                        <span onClick={() => this.logintabchange('WeiXin')}>微信登录</span>
                        <span className="current" onClick={() => this.logintabchange('QQ')}>QQ登录</span>
                    </div>
                    <a href={'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101461919&redirect_uri=http%3a%2f%2fweixin.91smart.net%2findex.html&state=' + (window.location.host === 'weixin.91smart.net' ? '' : 'test_') + 'qq'}>一键登录</a>
                </div >;
                break;
            default:
                break;
        }
        return temp;
    }

    render() {
        return (
            <div className="login">
                <div className="loginbox">
                    <div className="login-logo">LianLian · <b>作者专区</b></div>
                    {this.randerloginbox()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    router: state.app.router, loginerror: state.app.loginerror,
});

const mapDispatchToProps = (dispatch) => ({
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    sessionLogged: (user) => dispatch({ type: 'LOGIN_WITH_SESSION', user }),
    sendPhoneMsgLogin: (phone) => dispatch({ type: 'SEND_PHONEMSG_LOGIN', phone }),
    sendPhoneMsgBind: (phone) => dispatch({ type: 'SEND_PHONEMSG_BIND', phone }),
    phoneBind: (code) => dispatch({ type: 'PHONE_BIND', code }),
    phoneLogin: (params) => dispatch({ type: 'LOGIN_WITH_PHONE', params }),
    accountLogin: (phone, pwd) => dispatch({ type: 'LOGIN_WITH_ACCOUNT', phone, pwd }),
    wxLogin: (wxcode) => dispatch({ type: 'LOGIN_WITH_WEIXIN', wxcode }),
    qqLogin: (qqcode) => dispatch({ type: 'LOGIN_WITH_QQ', qqcode }),
    setLoginError: (loginerror) => dispatch({ type: 'SET_LOGIN_ERROR', loginerror }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


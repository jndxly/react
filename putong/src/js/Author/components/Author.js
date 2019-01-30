import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/Author.css';

class Author extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentWillMount() {
    if (!this.state.user) {
      this.setState({ user: this.props.user });
    }
  }

  toedit = () => {
    this.props.setRouter('Home-Author-Edit');
  }

  changeqq = (e) => {
    this.setState({ user: { ...this.state.user, qq: e.target.value } });
  }

  changename = (e) => {
    this.setState({ user: { ...this.state.user, name: e.target.value } });
  }

  changename = (e) => {
    this.setState({ user: { ...this.state.user, name: e.target.value } });
  }

  changeemail = (e) => {
    this.setState({ user: { ...this.state.user, email: e.target.value } });
  }

  changebrief = (e) => {
    this.setState({ user: { ...this.state.user, brief: e.target.value } });
  }

  getuploadurl = (url) => {
    this.setState({ user: { ...this.state.user, profile: url } });
  }

  updateuserinfo = () => {
    const user = { ...this.state.user };
    this.props.updateUserInfo(user);
  }

  render() {
    // const setRouter = this.props.setRouter;
    if (this.props.router.split('-')[2] === 'Show') {
      return (
        <div className="author">
          <table>
            <tbody>
              <tr>
                <td className="table-txt" style={{ verticalAlign: 'middle' }}>头像:</td>
                <td className="table-content"><img className="userprofile" src={this.state.user.profile} alt="" /></td>
              </tr>
              <tr>
                <td className="table-txt">作者ID:</td>
                <td className="table-content">{this.state.user.id}</td>
              </tr>
              <tr>
                <td className="table-txt">笔名:</td>
                <td className="table-content">{this.state.user.name}</td>
              </tr>
              <tr>
                <td className="table-txt">QQ:</td>
                <td className="table-content">{this.state.user.qq ? this.state.user.qq : '暂未填写'}</td>
              </tr>
              <tr>
                <td className="table-txt">手机号:</td>
                {/* <td className="table-content">{this.state.user.phone}<i className="link-btn" onClick={() => setRouter('Home-Account-OldPhone')}>更改绑定</i><i className="link-btn" onClick={() => setRouter('Home-Account-Setpwd')}>重设密码</i></td> */}
                <td className="table-content">{this.state.user.phone}</td>
              </tr>
              <tr>
                <td className="table-txt">邮箱:</td>
                <td className="table-content">{this.state.user.email ? this.state.user.email : '暂未填写'}</td>
              </tr>
              <tr>
                <td className="table-txt">简介:</td>
                <td className="table-content">{this.state.user.brief}</td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m" onClick={this.toedit}>修改资料</div>
        </div>
      );
    } else {
      return (
        <div className="author">
          <table>
            <tbody>
              <tr>
                <td className="table-txt" style={{ verticalAlign: 'middle' }}>头像:</td>
                <td className="table-content"><div className="userprofile"><FileUpload getuploadurl={this.getuploadurl.bind(this)} src={this.state.user.profile} filetype="img1"></FileUpload></div></td>
              </tr>
              <tr>
                <td className="table-txt">作者ID:</td>
                <td className="table-content">{this.state.user.id}</td>
              </tr>
              <tr>
                <td className="table-txt">笔名:</td>
                <td className="table-content">
                  <input className="form-control" type="text" value={this.state.user.name} onChange={this.changename} />
                  <p className="table-alert">笔名最多十个字</p>
                </td>
              </tr>
              <tr>
                <td className="table-txt">QQ:</td>
                <td className="table-content">
                  <input className="form-control" type="text" value={this.state.user.qq ? this.state.user.qq : ''} onChange={this.changeqq} />
                  {this.state.user.qq === '' ? <div className="table-alert">请填写常用的QQ号码，便于编辑快速联系到您</div> : ''}
                </td>
              </tr>
              <tr>
                <td className="table-txt">邮箱:</td>
                <td className="table-content">
                  <input className="form-control" type="text" value={this.state.user.email ? this.state.user.email : ''} onChange={this.changeemail} />
                  {this.state.user.email ? (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.state.user.email) ? null : <div className="table-alert">请填写正确的邮箱地址</div>) : <div className="table-alert">请填写常用的邮箱地址，便于编辑快速联系到您</div>}
                </td>
              </tr>
              <tr>
                <td className="table-txt">简介:</td>
                <td className="table-content">
                  <textarea className="form-control" type="text" rows="5" cols="60" maxLength="200" value={this.state.user.brief ? this.state.user.brief : ''} onChange={this.changebrief} ></textarea>
                  <div className="table-alert">个人简介，不超过200字</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-m" onClick={this.updateuserinfo} >确认修改</div>
        </div>
      );
    }

  }
}

const mapStateToProps = (state) => {
  return { user: state.user, router: state.app.router };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: (user) => dispatch({ type: 'UPDATE_USER', user }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Author);



// WEBPACK FOOTER //
// ./src/Author/components/Author.js
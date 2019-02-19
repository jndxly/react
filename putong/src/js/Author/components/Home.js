import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectList from './ProjectList';
import IdolList from './IdolList';
import NewProject from './NewProject';
import NewIdol from './NewIdol';
import IdolInfo from './IdolInfo';
import Author from './Author';
import config from '../../config/';
// import Account from './Account';
import MsgList from './MsgList';
import NoticeList from './NoticeList';
import defaultimg from '../../images/user_default.jpg';
import '../css/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      defaultimg: defaultimg,
    };
  }

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000'  + '/v1/ws/regist?token=' + encodeURIComponent(this.props.user.token) + '&identity=editor');
    this.ws.onopen = (evt) => {
      this.timer = setInterval(() => {
        this.ws.send('heartbeat');
      }, 50000);
    };
    this.ws.onmessage = (evt) => {
      if (evt.data === 'message') {
        this.props.getMsgs(0, 10);
      } else if (evt.data === 'notice') {
        this.props.getNotices(0, 10);
      }
    };
    this.ws.onclose = (evt) => {
      clearInterval(this.timer);
      this.timer = null;
    };
  }

  componentWillUnmount() {
    this.ws.close();
    this.ws = null;
  }

  logout = () => {
    this.props.logOut();
  }

  changerouter = (router) => {
    this.props.setRouter(router);
  }

  showdetail = (router, item) => {
    if (router.split('-')[2] === 'MsgDetail' && !item.is_read) {
      this.props.readMsg(item.id);
    }
    this.props.setRouter(router);
  }

  renderCrumbs() {
    const screen = this.props.router.split('-')[1];
    const { setRouter, notices } = this.props;
    if (screen === 'List') {
      if (notices.length > 0) {
        return (
          <div className="notice-banner">
            <p onClick={() => setRouter('Home-Notice-NoticeDetail-' + notices[0].id)}>系统公告：{notices[0].title}</p>
            <span className="notice-more" onClick={() => setRouter('Home-Notice-NoticeList')}>查看更多</span>
          </div>
        )
      } else {
        return null;
      }
    } else if (screen === 'Newproject') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Production')}>主页</li>
          <li>创建作品</li>
        </ul>
      )
    } else if (screen === 'Newidol') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Production')}>主页</li>
          <li>创建偶像</li>
        </ul>
      )
    } else if (screen === 'Editidol') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Idol')}>主页</li>
          <li>编辑偶像</li>
        </ul>
      )
    } else if (screen === 'Msg') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Production')}>主页</li>
          <li>消息</li>
        </ul>
      )
    } else if (screen === 'Notice') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Production')}>主页</li>
          <li>公告</li>
        </ul>
      )
    } else if (screen === 'Author') {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('Home-List-Production')}>主页</li>
          <li>作者资料</li>
        </ul>
      )
    }
    // else if (screen === "Account") {
    //   return (
    //     <ul className="crumbs">
    //       <li onClick={() => setRouter('Home-List-Production')}>主页</li>
    //       <li onClick={() => setRouter('Home-Author-Show')}>作者资料</li>
    //       <li>{this.props.router.split('-')[2] === 'Setpwd' ? '重设密码' : '更换绑定'}</li>
    //     </ul>
    //   )
    // }
  }

  rendertabs() {
    const tab = this.props.router.split('-')[2];
    const setRouter = this.props.setRouter;
    if (tab === 'Production') {
      return (
        <ul className="tabs">
          <li className="current" onClick={() => setRouter('Home-List-Production')}>我的作品</li>
          {/*<li onClick={() => setRouter('Home-List-Idol')}>我的偶像</li>*/}
        </ul>
      )
    } else {
      return (
        <ul className="tabs">
          <li onClick={() => setRouter('Home-List-Production')}>我的作品</li>
          <li className="current" onClick={() => setRouter('Home-List-Idol')}>我的偶像</li>
        </ul>
      )
    }
  }

  renderContent() {
    const screen = this.props.router.split('-')[1];
    const tab = this.props.router.split('-')[2];
    if (screen === 'List') {
      if (tab === 'Production') {
        return (
          <div className="container">
            {this.rendertabs()}
            <ProjectList></ProjectList>
          </div>
        );
      } else {
        return (
          <div className="container">
            {this.rendertabs()}
            <IdolList></IdolList>
          </div>
        );
      }
    } else if (screen === 'Newproject') {
      return (
        <div className="content">
          <NewProject></NewProject>
        </div>
      )
    } else if (screen === 'Newidol') {
      return (
        <div className="content">
          <NewIdol></NewIdol>
        </div>
      )
    } else if (screen === 'Editidol') {
      return (
        <div className="content">
          <IdolInfo></IdolInfo>
        </div>
      )
    } else if (screen === 'Author') {
      return (
        <div className="content">
          <div className="controls"></div>
          <Author></Author>
        </div>
      )
    } else if (screen === 'Notice') {
      return (
        <div className="content">
          <NoticeList></NoticeList>
        </div>
      )
    } else if (screen === 'Msg') {
      return (
        <div className="content">
          <MsgList></MsgList>
        </div>
      )
    }
    //  else if (screen === "Account") {
    //   return (
    //     <div className="content">
    //       <div className="controls"></div>
    //       <Account></Account>
    //     </div>
    //   )
    // }
  }

  render() {
    const { msgs, notread, setRouter, readAllMsgs } = this.props;
    const msgslist = msgs.map((item, key) => {
      if (key < 3) {
        return <div className="notice-pop-item" key={key} onClick={() => this.showdetail('Home-Msg-MsgDetail-' + item.id, item)} title={`【${item.title}】${item.text}`}>{`【${item.title}】${item.text}`}</div>
      } else {
        return null
      }
    });
    return (
      <div className="home">
        <div className="header">
          <div className="title">LianLian · <b>作者专区</b></div>
          <div className="user">
            <img className="user-photo" alt="头像" src={this.props.user.profile === '' ? this.state.defaultimg : this.props.user.profile} />
            <ul className="user-menu">
              <li className="text-center" onClick={() => setRouter('Home-Author-Show')}><span className="fa fa-user-circle"></span>作者资料</li>
              <li className="text-center" onClick={this.logout}><span className="fa fa-sign-out"></span>退出登录</li>
            </ul>
            <div className="user-name">{this.props.user.name}</div>
          </div>
          <div className="notice">
            <span className="fa  fa-bell notice-icon">{notread > 0 ? <b></b> : null}</span>
            <div className="notice-pop">
              <div className="notice-pop-title">
                <span className="notice-pop-text">新消息</span>
                <span className="all-read" onClick={readAllMsgs}>全部标记为已读</span>
              </div>
              {msgslist.length > 0 ? msgslist : <div className="notnewmsg">暂无新消息</div>}
              <div className="more-notice" onClick={() => setRouter('Home-Msg-MsgList')}>查看全部消息</div>
            </div>
          </div>
        </div>
        {this.renderCrumbs()}
        {this.renderContent()}
        <div className="footer">Copyright © 2018 All Right Reserverd    版权所有 上海扬讯计算机科技股份有限公司</div>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    outline: state.outline,
    projects: state.projects.list,
    idols: state.idols.list,
    user: state.user,
    router: state.app.router,
    msgs: state.app.msgs,
    notices: state.app.notices,
    notread: state.app.notread,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch({ type: 'LOGOUT' }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    readMsg: (id) => dispatch({ type: 'READ_MSG', id }),
    readAllMsgs: () => dispatch({ type: 'READ_ALL_MSGs' }),
    getMsgs: (index, pagecapacity) => dispatch({ type: 'REQUEST_MSGS', index, pagecapacity }),
    getNotices: (index, pagecapacity) => dispatch({ type: 'REQUEST_NOTICES', index, pagecapacity }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


// WEBPACK FOOTER //
// ./src/Author/components/Home.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import '../css/MsgNotice.css';

class MsgNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pagecapacity: 15,
      wantPage: '',
    };
  }

  calculatePageIndex(index) {
    const pagecapacity = this.state.pagecapacity;
    const { totalnotices } = this.props;
    let total = Math.ceil(totalnotices / pagecapacity);

    if (index < 0) {
      return 0;
    }
    else if (index >= total) {
      return total - 1;
    }
    else {
      return index;
    }
  }

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value.replace(/\D/g, '') });
  }

  changetab = (tab) => {
    this.setState({ tab });
  }

  pageUp = () => {
    const pagecapacity = this.state.pagecapacity;
    const pageIndex = this.calculatePageIndex(this.state.pageIndex - 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
    this.props.getNotices(pageIndex, pagecapacity);
  };

  pageDown = () => {
    const pagecapacity = this.state.pagecapacity;
    const pageIndex = this.calculatePageIndex(this.state.pageIndex + 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
    this.props.getNotices(pageIndex, pagecapacity);
  };

  pageTo = (index) => {
    const pagecapacity = this.state.pagecapacity;
    const pageIndex = this.calculatePageIndex(parseInt(index, 10) - 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
    this.props.getNotices(pageIndex, pagecapacity);
  };

  pageTowantpage = () => {
    const pagecapacity = this.state.pagecapacity;
    const pageIndex = this.calculatePageIndex(parseInt(this.state.wantPage, 10) - 1) || 0;
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
      wantPage: pageIndex + 1,
    }));
    this.props.getNotices(pageIndex, pagecapacity);
  }

  showdetail = (router, item) => {
    this.props.setRouter(router);
  }

  getdate = (inputTime) => {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }

  renderPageMenu() {
    const { pageIndex, pagecapacity } = this.state;
    const { totalnotices } = this.props;
    let total = Math.ceil(totalnotices / pagecapacity);
    if (total === 0) {
      return null;
    }

    let first = 0;
    let last = 0;

    if (total <= 7) {
      first = 0;
      last = total - 1;
    } else {
      if (pageIndex < 4) {
        first = 0;
        last = 6;
      } else if (pageIndex > total - 5) {
        last = total - 1;
        first = last - 6;
      } else {
        first = pageIndex - 3;
        last = pageIndex + 3;
      }
    }
    const buttons = [];
    for (let i = first; i <= last; i++) {
      buttons.push(<div className={i === pageIndex ? 'btn-pagination current' : 'btn-pagination'}
        key={i}
        onClick={() => this.pageTo(i + 1)}>{i + 1}</div>);
    }
    return (
      <div className='pagination'>
        <div className='fa fa-arrow-left pageup' onClick={this.pageUp}></div>
        {buttons}
        <div className='fa fa-arrow-right pagedown' onClick={this.pageDown}></div>
        <div className="pageto"><span>跳转到</span><input type="text" value={this.state.wantPage} onChange={this.changewantpage} /><div className="btn-blue-s" onClick={this.pageTowantpage}>确定</div></div>
      </div>
    );
  }

  render() {
    const { notices, router, readAllMsgs, setRouter } = this.props;
    // console.log(router);
    if (router.split('-')[2] === 'NoticeList') {
      let noticelist = null;
      if (notices.length === 0) {
        noticelist = <div className='isnull'>暂无公告</div>;
      } else {
        noticelist = notices.map((item, index) => {
          return (
            <div className="msg-row" key={index} onClick={() => this.showdetail('Home-Notice-NoticeDetail-' + item.id, item)}>
              <div className="flex-8 msg-title">{item.title}</div>
              <div className="flex-2 msg-time">{this.getdate(item.time)}</div>
            </div>
          );
        });
      }
      return (
        <div className="msgnoticetab">
          <div className="controls">
            <ul className="tabs">
              <li className={router.split('-')[2] === 'MsgList' ? 'current' : ''} onClick={() => setRouter('Home-Msg-MsgList')}>消息</li>
              <li className={router.split('-')[2] === 'NoticeList' ? 'current' : ''} onClick={() => setRouter('Home-Notice-NoticeList')}>公告</li>
            </ul>
            {router.split('-')[2] === 'MsgList' ? <div className="btn-green-m allreaded" onClick={() => readAllMsgs}>全部标记为已读</div> : null}
          </div>
          <div className='msglist'>
            {noticelist}
          </div>
          {this.renderPageMenu()}
        </div>
      );
    } else {
      let detail = null;
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].id === parseInt(router.split('-')[3], 10)) {
          detail = notices[i];
          break;
        }
      }

      return (
        <div className="detail">
          <div className="detailtitle">{detail.title}</div>
          <div className="detailtime">{this.getdate(detail.time)}</div>
          <div className="detailtext"><ReactMarkdown source={detail.text} /></div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({ notices: state.app.notices, totalnotices: state.app.totalnotices, router: state.app.router });

const mapDispatchToProps = (dispatch) => ({
  getNotices: (index, pagecapacity) => dispatch({ type: 'REQUEST_NOTICES', index, pagecapacity }),
  setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MsgNotice);



// WEBPACK FOOTER //
// ./src/Author/components/NoticeList.js
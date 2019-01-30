import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import defaultimg from '../../images/default.png';
import noneimg from '../../images/none.jpg';
import uuid from 'uuid-js';
import '../css/Extras.css';

class Extras extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editroletype: 0,
      pageIndex: 0,
      pagecapacity: 5,
      wantPage: '',
      currentextra: null,
      infotype: 0,
      title: '',
      idol: '',
      online: '',
      rarity: '',
      searchAll: true,
    }
  }

  componentWillMount() {
    this.tosearch();
  }

  getstatus = (status) => {
    switch (status) {
      case 0:
        return '未投稿';

      case 1:
        return '待审核';

      case 5:
        return '审核中';

      case 2:
        return '已过审';

      case 3:
        return '未过审';

      default:
        return '未投稿'

    }
  }

  calculatePageIndex(index) {
    const pagecapacity = this.state.pagecapacity;
    const totalextras = this.props.extras.length;
    let total = Math.ceil(totalextras / pagecapacity);

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

  changesearchtitle = (e) => {
    this.setState({ title: e.target.value });
  }

  changesearchidol = (e) => {
    this.setState({ idol: e.target.value });
  }

  changesearchonline = (e) => {
    this.setState({ online: e.target.value });
  }

  changesearchrarity = (e) => {
    this.setState({ rarity: e.target.value });
  }

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value.replace(/\D/g, '') });
  }

  pageUp = () => {
    const pageIndex = this.calculatePageIndex(this.state.pageIndex - 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
  };

  pageDown = () => {
    const pageIndex = this.calculatePageIndex(this.state.pageIndex + 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
  };

  pageTo = (index) => {
    const pageIndex = this.calculatePageIndex(parseInt(index, 10) - 1);
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
    }));
  };

  pageTowantpage = () => {
    const pageIndex = this.calculatePageIndex(parseInt(this.state.wantPage, 10) - 1) || 0;
    this.setState(prev => ({
      ...prev,
      pageIndex: pageIndex,
      wantPage: pageIndex + 1,
    }));
  }

  renderPageMenu() {
    const { pageIndex, pagecapacity } = this.state;
    const totalextras = this.props.extras.length;
    let total = Math.ceil(totalextras / pagecapacity);
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

  initextratitle = () => {
    const ex = this.state.currentextra;
    if (ex.title === '') {
      this.setState({ currentextra: { ...ex, title: '未命名番外' } });
    } else if (ex.title === '未命名番外') {
      this.setState({ currentextra: { ...ex, title: '' } });
    }
  }

  newextra = () => {
    const linkidols = this.props.outline.idols;
    if (linkidols.length > 0) {
      const _uuid = uuid.create(4).toString();
      this.setState({ infotype: 0, currentextra: { uuid: _uuid, game_id: this.props.outline.id, preview: '', title: '未命名番外', text: '', paragraphs: [{ id: 1, type: 'Node', title: '1', text: '', next_id: -1 }], content: '', online_status: 0, status: 0, rarity: 2, idol_id: -1, level: 0 } });
    } else {
      this.props.showMessage('error', '作品未关联偶像，请联系责编！');
    }
  }

  changetitle = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, title: e.target.value } });
  }

  changetext = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, text: e.target.value } });
  }

  changeupload = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, upload: parseInt(e.target.value, 10) } });
  }

  changerarity = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, rarity: parseInt(e.target.value, 10) } });
  }

  changeidol_id = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, idol_id: parseInt(e.target.value, 10) } });
  }

  changelevel = (e) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, level: parseInt(e.target.value.replace(/\D/g, ''), 10) - 1 | 0 } });
  }

  getuploadurl = (url) => {
    const ex = this.state.currentextra;
    this.setState({ currentextra: { ...ex, preview: url } });
  }

  saveextrainfo = () => {
    const currentextra = this.state.currentextra;
    if (currentextra.preview === '') {
      this.props.showMessage('error', '未上传头像！');
    } else if (currentextra.title === '') {
      this.props.showMessage('error', '番外名称不能为空！');
    } else if (currentextra.title.length > 15) {
      this.props.showMessage('error', '番外名称长度超出限制！');
    } else if (currentextra.idol_id === -1) {
      this.props.showMessage('error', '关联偶像未选择！');
    } else if (currentextra.text.length > 150) {
      this.props.showMessage('error', '简介字数不在限制范围内！');
    } else {
      this.props.saveExtra(currentextra);
      this.setState({ currentextra: null });
    }
  }

  deleteextra = (extra) => {
    if (extra.online_status === 0) {
      this.props.deleteExtraConfirm('确认删除番外《' + extra.title + '》吗？', { type: 'DELETE_EXTRA', uuid: extra.uuid });
    } else {
      this.props.showMessage('error', '番外《' + extra.title + '》已上架不可删除！');
    }
  }

  toeditextra = (extra_uuid) => {
    this.props.setSelectedExtraUUId(extra_uuid);
    this.props.setRouter('ProjectEditor-ExtraEditor');
  }

  getidolname = (idol_id) => {
    const idol = this.props.idols.find(idol => idol.id === idol_id);
    if (idol) {
      return idol.name;
    } else {
      return '无';
    }
  }

  toshowinfo = (extra) => {
    this.setState({ infotype: 1, currentextra: extra });
  }

  tohideinfo = () => {
    this.setState({ currentextra: null });
  }

  tosearch = () => {
    const { idol, title, rarity, online } = this.state;
    const game_id = this.props.outline.id;
    if (idol === '' && title === '' && rarity === '' && online === '') {
      this.setState({ searchAll: true });
    } else {
      this.setState({ searchAll: false });
    }
    this.props.getExtras(game_id, title, idol, online, rarity);
  }

  renderextraedit = () => {
    const currentextra = this.state.currentextra;
    const idols = this.props.idols;
    const idolids = this.props.outline.idols;
    let idolitems = [];
    idols.forEach((idol, key) => {
      if (idolids.find(id => id === idol.id) !== undefined) {
        idolitems.push(
          <option key={key} value={idol.id}>{idol.name}</option>
        );
      }
    });
    if (currentextra === null) {
      return null
    } else {
      return (
        <div className="extraedit-box">
          <div className="extraedit">
            <div className="extrainfo">
              <div className="extrapreview">
                <FileUpload getuploadurl={this.getuploadurl.bind(this)} src={currentextra.preview} filetype="img2"></FileUpload>
                <p>封面</p>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td className="table-txt">番外名</td>
                    <td className="table-content">
                      <input className="form-control extraname" value={currentextra.title} type="text" maxLength="7" onBlur={this.initextratitle} onFocus={this.initextratitle} onChange={this.changetitle} />
                      <p className="table-alert">名字最多7个字</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="table-txt">稀有度</td>
                    <td className="table-content">
                      <select className="form-control" value={currentextra.rarity} onChange={this.changerarity}>
                        <option value="2">R</option>
                        <option value="1">SR</option>
                        <option value="0">SSR</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="table-txt">关联偶像</td>
                    <td className="table-content">
                      <select className="form-control" value={currentextra.idol_id} onChange={this.changeidol_id}>
                        <option value="-1">请选择偶像</option>
                        {idolitems}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="table-txt">亲密度等级</td>
                    <td className="table-content">
                      <input className="form-control intimacy" type="text" value={currentextra.level + 1} onChange={this.changelevel} />
                    </td>
                  </tr>
                  <tr>
                    <td className="table-txt">简介</td>
                    <td className="table-content">
                      <textarea className="form-control" rows="6" cols="40" value={currentextra.text} onChange={this.changetext}></textarea>
                      <p className="table-alert">最多150字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="btn-green-s" onClick={this.saveextrainfo}>{this.state.infotype === 1 ? '保 存' : '创 建'}</div>
            <div className="btn-blue-s" onClick={this.tohideinfo}>取 消</div>
          </div >
        </div>
      );
    }
  }

  render() {
    const extras = this.props.extras;
    const { pagecapacity, idol, title, rarity, online, searchAll } = this.state;
    if (extras.length > 0 || (extras.length <= 0 && !searchAll)) {
      const pageIndex = this.state.pageIndex;
      const idols = this.props.idols;
      const idolids = this.props.outline.idols;
      let idolitems = [];
      idols.forEach((idol, key) => {
        if (idolids.find(id => id === idol.id) !== undefined) {
          idolitems.push(
            <option key={key} value={idol.id}>{idol.name}</option>
          );
        }
      });
      const extralist = extras.filter((item, index) => index >= pageIndex * pagecapacity && index < (pageIndex + 1) * pagecapacity).map((item, index) => {
        return (
          <div className="extra-row" key={index}>
            <div className='flex-2'><img className="extra-preview" src={item.preview ? item.preview + '?imageView2/1/w/400/q/85!' : defaultimg} alt="图片" /></div>
            <div className='flex-2'>{item.title}</div>
            <div className='flex-1'>{item.rarity === 0 ? 'SSR' : item.rarity === 1 ? 'SR' : 'R'}</div>
            <div className='flex-1'>{this.getidolname(item.idol_id)}</div>
            <div className='flex-1'>{item.level + 1}</div>
            <div className='flex-1'>{item.online_status === 0 ? '未上架' : '已上架'}</div>
            <div className='flex-1'>{this.getstatus(item.status)}</div>
            <div className='flex-3'>
              <div className="btn-red-s" onClick={() => this.deleteextra(item)}>删除</div>
              <div className="btn-green-s" onClick={() => this.toshowinfo(item)}>详情</div>
              <div className="btn-blue-s" onClick={() => this.toeditextra(item.uuid)}>编辑</div>
            </div>
          </div>
        )
      });
      return (
        <div className="extras">
          <div className="controls">
            <div className="total">番外总数<b>{extralist.length}</b>本</div>
            <div className="searchgroup"><div className="btn-green-s" onClick={this.newextra}>新建</div></div>
            <div className="searchgroup"><span title="搜索" className="refresh fa fa-search" onClick={this.tosearch}></span></div>
            <div className="searchgroup">上架：
            <select className="form-control" value={online} onChange={this.changesearchonline}>
                <option value="">全部</option>
                <option value="0">未上架</option>
                <option value="1">已上架</option>
              </select>
            </div>
            <div className="searchgroup">稀有度：
            <select className="form-control" value={rarity} onChange={this.changesearchrarity}>
                <option value="">全部</option>
                <option value="0">SSR</option>
                <option value="1">SR</option>
                <option value="2">R</option>
              </select>
            </div>
            <div className="searchgroup">偶像：
            <select className="form-control" value={idol} onChange={this.changesearchidol}>
                <option value="">全部</option>
                {idolitems}
              </select>
            </div>
            <div className="searchgroup">番外名：<input className="form-control" value={title} onChange={this.changesearchtitle} /></div>
          </div>
          <div className='extralist'>
            <div className='extralist-title'>
              <div className='flex-2'>封面</div>
              <div className='flex-2'>番外名</div>
              <div className='flex-1'>稀有度</div>
              <div className='flex-1'>关联偶像</div>
              <div className='flex-1'>亲密度等级</div>
              <div className='flex-1'>上架</div>
              <div className='flex-1'>审核</div>
              <div className='flex-3'>操作</div>
            </div>
            {extralist.length > 0 ? extralist : <div>未找到任何番外</div>}
          </div>
          {this.renderPageMenu()}
          {this.renderextraedit()}
        </div>
      );
    } else {
      return (
        <div className="extras-none">
          <img className="none-img" src={noneimg} alt="" />
          <p className="none-txt">还没有番外哦！</p>
          <div className="btn-green-m" onClick={this.newextra}>创 建</div>
          {this.renderextraedit()}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    content: state.editor.content,
    outline: state.editor.outline,
    errors: state.editor.errors,
    idols: state.idols.list,
    extras: state.extras.list,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getExtras: (game_id, title, idol, online, rarity) => dispatch({ type: 'REQUEST_EXTRAS', game_id, title, idol, online, rarity }),
    saveExtra: (extra) => dispatch({ type: 'SAVE_EXTRA', extra }),
    deleteExtraConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
    uploadFile: (file, filetype, callback) => dispatch({ type: 'UPLOAD_FILE', file, filetype, callback }),
    showMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
    setSelectedExtraUUId: (extra_uuid) => dispatch({ type: 'SET_SELECTED_EXTRA_UUID', extra_uuid }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Extras);


// WEBPACK FOOTER //
// ./src/Author/components/Extras.js
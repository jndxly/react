import React, { Component } from 'react';
import { connect } from 'react-redux';
import Roles from './Roles';
import '../css/ProjectEditor.css';
import ParagraphEditor from './ParagraphEditor';
import ExtraParagraphEditor from './ExtraParagraphEditor';
import ProjectInfo from './ProjectInfo';
import Galleries from './Galleries';
import Numbers from './Numbers';
import Extras from './Extras';
import ParagraphTree from './paragraph/ParagraphTree';
import ExtraParagraphTree from './extra/ParagraphTree';


class ProjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorshow: true,
      showglobalcomment: true,
    };
  }

  toggleglobalcomment = () => {
    this.setState({ showglobalcomment: !this.state.showglobalcomment });
  }

  toextras = () => {
    const { idols, setRouter, showMessage } = this.props;
    if (idols.length > 0) {
      setRouter('ProjectEditor-Setings-Extras');
    } else {
      showMessage('normal', '您还没有任何偶像，番外模块暂未开启！');
    }
  }

  hidecomment = () => {
    this.setState({ showglobalcomment: false });
  }

  componentWillMount() {
    this.timer = setInterval(() => {
      this.props.autoSaveProject('auto');
    }, 15 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    // this.props.clearEditor();
  }

  renderglobalcomment = () => {
    let { comments, selected_extra_uuid, router } = this.props;
    let showglobalcomment = this.state.showglobalcomment;
    let comment = null;
    let title = null;
    if (router.split('-')[1] === 'Editor') {
      title = '全文批注';
      comment = comments.content.find(c => !c.extra_uuid && c.id === 0);
    } else if (router.split('-')[1] === 'ExtraEditor') {
      title = '番外批注';
      comment = comments.content.find(c => c.extra_uuid && c.extra_uuid === selected_extra_uuid && c.id === 0);
    }
    if (showglobalcomment && comment) {
      return (
        <div className="glogalcomment">
          <div className="glogalcomment-title">{title}</div>
          <div className="glogalcomment-text" >{comment.text}</div>
          <div className="glogalcomment-footer">
            <div className="comment-yes" onClick={this.hidecomment}>确认</div>
          </div>
        </div>
      );
    }
  }

  rendertab = () => {
    const { router } = this.props;
    switch (router.split('-')[2]) {
      case 'Outline':
        return <ProjectInfo></ProjectInfo>
      case 'Roles':
        return <Roles></Roles>
      case 'Galleries':
        return <Galleries></Galleries>
      case 'Numbers':
        return <Numbers></Numbers>
      case 'Extras':
        return <Extras></Extras>
      default:
        return <ProjectInfo></ProjectInfo>
    }
  }

  renderHeader() {
    const { outline, extras, selected_extra_uuid, setRouter, saveProject, commitProject, saveExtra, commitExtra, previewExtra, previewProject, router } = this.props;
    if (router.split('-')[1] === 'ExtraEditor') {
      const extra = extras.find(ex => ex.uuid === selected_extra_uuid);
      return (
        <div className="header">
          <div className="back" onClick={() => setRouter('ProjectEditor-Config-Extras')} title="返回番外列表"><span className="fa fa-arrow-left"></span></div>
          <div className="projecttitle">{extra.title}(番外)</div>
          <div className="toolbar">
            <div className="icon-btn" onClick={() => { window.open('http://web.putong.91smart.net/%E7%BC%96%E8%BE%91%E5%99%A8%E5%86%99%E4%BD%9C%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3.pdf') }}><span className="fa fa-question-circle-o"></span>帮助</div>
            <div className="icon-btn" onClick={this.toggleglobalcomment}><span className="fa fa-edit"></span>番外批注</div>
            <div className="icon-btn" onClick={previewExtra}><span className="fa fa-caret-square-o-right"></span>真机预览</div>
            <div className="icon-btn" onClick={commitExtra}><span className="fa fa-send-o"></span>投稿</div>
            <div className="icon-btn" onClick={() => saveExtra(extra)}><span className="fa fa-floppy-o"></span>保存</div>
          </div>
        </div>
      )
    } else if (router.split('-')[1] === 'Editor') {
      return (
        <div className="header">
          <div className="back" onClick={() => setRouter('Home-List-Production')} title="返回首页"><span className="fa fa-arrow-left"></span></div>
          <div className="projecttitle">{outline.title}</div>
          <div className="toolbar">
            {/*<div className="icon-btn" onClick={() => { window.open('http://web.putong.91smart.net/%E7%BC%96%E8%BE%91%E5%99%A8%E5%86%99%E4%BD%9C%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3.pdf') }}><span className="fa fa-question-circle-o"></span>帮助</div>*/}
            <div className="icon-btn" onClick={() => { this.props.showTotalAlert('字数总计：' + this.props.outline.character_count) }}><span className="fa fa-bar-chart-o"></span>字数统计</div>
            {/*<div className="icon-btn" onClick={this.toggleglobalcomment}><span className="fa fa-edit"></span>全文批注</div>*/}
            <div className="icon-btn" onClick={() => setRouter('ProjectEditor-Setings-Outline-o')}><span className="fa fa-sliders seting-icon" ></span>作品设置</div>
            {/*<div className="icon-btn" onClick={previewProject}><span className="fa fa-caret-square-o-right"></span>真机预览</div>*/}
            <div className="icon-btn" onClick={commitProject}><span className="fa fa-send-o"></span>投稿</div>
            {router.split('-')[1] === 'Editor' ? <div className="icon-btn" onClick={saveProject}><span className="fa fa-floppy-o"></span>保存</div> : null}
          </div>
        </div>
      )
    } else {
      return (
        <div className="header">
          <div className="back" onClick={() => setRouter('Home-List-Production')} title="返回首页"><span className="fa fa-arrow-left"></span></div>
          <div className="projecttitle">{outline.title}</div>
          <div className="toolbar">
            <div className="icon-btn" onClick={() => { window.open('http://web.putong.91smart.net/%E7%BC%96%E8%BE%91%E5%99%A8%E5%86%99%E4%BD%9C%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3.pdf') }}><span className="fa fa-question-circle-o"></span>帮助</div>
          </div>
        </div>
      )
    }
  }

  renderCrumbs() {
    const { router, setRouter } = this.props;
    if (router.split('-')[1] === 'Editor' || router.split('-')[1] === 'ExtraEditor') {
      return null;
    } else {
      return (
        <ul className="crumbs">
          <li onClick={() => setRouter('ProjectEditor-Editor')}>剧本编辑器</li>
          <li onClick={() => setRouter('ProjectEditor-Setings-Outline')}>作品设置</li>
        </ul>
      )
    }
  }

  rendercontent = () => {
    const { selected_paragraph_id, router, setRouter } = this.props;
    if (router.split('-')[1] === 'Editor') {
      return (
        <div className="editor">
          <ParagraphTree />
          <ParagraphEditor editorshow={selected_paragraph_id !== null} ></ParagraphEditor>
          {this.renderglobalcomment()}
        </div>
      )
    } else if (router.split('-')[1] === 'ExtraEditor') {
      return (
        <div className="editor">
          <ExtraParagraphTree />
          <ExtraParagraphEditor editorshow={selected_paragraph_id !== null} ></ExtraParagraphEditor>
          {this.renderglobalcomment()}
        </div>
      )
    } else {
      return (
        <div className="setings">
          <div className="tab">
            <ul className="tabs">
              <li className={router.split('-')[2] === 'Outline' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Outline')}>详情</li>
              <li className={router.split('-')[2] === 'Roles' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Roles')}>角色</li>
              <li className={router.split('-')[2] === 'Galleries' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Galleries')}>回忆</li>
              <li className={router.split('-')[2] === 'Numbers' ? 'current' : ''} onClick={() => setRouter('ProjectEditor-Setings-Numbers')}>数值</li>
              {/*<li className={router.split('-')[2] === 'Extras' ? 'current' : ''} onClick={this.toextras}>番外</li>*/}
            </ul>
            {this.rendertab()}
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="projecteditor">
        {this.renderHeader()}
        {this.renderCrumbs()}
        {this.rendercontent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    outline: state.editor.outline,
    extras: state.extras.list,
    comments: state.editor.comments,
    errors: state.editor.errors,
    selected_paragraph_id: state.editor.selected_paragraph_id,
    selected_extra_uuid: state.editor.selected_extra_uuid,
    router: state.app.router,
    idols: state.idols.list
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
    saveExtra: (extra) => dispatch({ type: 'SAVE_EXTRA', extra }),
    autoSaveProject: (mode) => dispatch({ type: 'SAVE_PROJECT', mode }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
    commitProject: () => dispatch({ type: 'COMMIT_PROJECT' }),
    commitExtra: () => dispatch({ type: 'COMMIT_EXTRA' }),
    previewExtra: () => dispatch({ type: 'PREVIEW_EXTRA' }),
    previewProject: () => dispatch({ type: 'PREVIEW_PROJECT' }),
    showTotalAlert: (content) => dispatch({ type: 'SET_APP_ALERT', alert: { content: content, cback: null } }),
    showMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEditor);


// WEBPACK FOOTER //
// ./src/Author/components/ProjectEditor.js
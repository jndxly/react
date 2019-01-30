import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/ParagraphEditor.css';

class ExtraParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '35%',
      placeholder: '扑通小课堂\n角色名前面需要加@，每条消息之间用空格隔开\n图片视频可以直接拖到文本框，会自动生成链接\n@韩梅梅\n月色真美\n\n@李雷\n是啊，月亮好大，像个饼。\n\n@韩梅梅\n#图片#\nhttp://aa.bb.cc.jpg\n\n@李雷\n#视频#\n假装此处有视频简介\nhttp://dd.ee.ff.mp4\n\n@我\nemmmmmm，教练，我要学扑通扑通编辑器~',
      toolbox: 'none',
      addtxt: null,
      showcomment: true,
    };
  }

  changetitle = (e, paragraph) => {
    paragraph.title = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  inittitle = (paragraph) => {
    if (paragraph.title === '未命名段落' || paragraph.title === '未命名选项' || paragraph.title === '未命名结局' || paragraph.title === '未命名锁') {
      paragraph.title = '';
    } else if (paragraph.title === '') {
      if (paragraph.type === 'Node') {
        paragraph.title = '未命名段落';
      } else if (paragraph.type === 'End') {
        paragraph.title = '未命名结局';
      } else if (paragraph.type === 'Lock') {
        paragraph.title = '未命名锁';
      }
    }
    this.props.updateParagraph(paragraph);
  }

  changetext = (e, paragraph) => {
    paragraph.text = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  rangevaluechange = (e, paragraph, range_index) => {
    const value = e.target.value.replace(/\D/g, '');
    paragraph.ranges[range_index].value = parseInt(value, 10) | 0;
    this.props.updateParagraph(paragraph);
  }

  selectiontitlechange = (e, paragraph, branch_index) => {
    paragraph.selections[branch_index].title = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  initselectiontitle = (paragraph, branch_index) => {
    if (paragraph.selections[branch_index].title === '未命名选项') {
      paragraph.selections[branch_index].title = '';
    } else if (paragraph.selections[branch_index].title === '') {
      paragraph.selections[branch_index].title = '未命名选项';
    }
    this.props.updateParagraph(paragraph);
  }

  changeendgalleryid = (e, paragraph) => {
    paragraph.gallery_id = parseInt(e.target.value, 10);
    this.props.updateParagraph(paragraph);
  }

  addparagraphfile = (url, filename, paragraph) => {
    paragraph.text = paragraph.text.replace('\n' + filename, '\n' + url + '\n');
    this.props.updateParagraph(paragraph);
  }

  dropFile = (e, paragraph) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    let texteditor = this.refs.texteditor;
    var startPos = texteditor.selectionStart;
    var endPos = texteditor.selectionEnd;

    // 保存滚动条  
    var restoreTop = texteditor.scrollTop;
    paragraph.text = paragraph.text.substring(0, startPos) + file.name + paragraph.text.substring(endPos, paragraph.text.length);

    if (restoreTop > 0) {
      texteditor.scrollTop = restoreTop;
    }

    texteditor.focus();
    texteditor.selectionStart = startPos + texteditor.length;
    texteditor.selectionEnd = startPos + texteditor.length;

    this.props.updateParagraph(paragraph);
    this.props.uploadFile(file, 'both', (path) => { this.addparagraphfile(path, file.name, paragraph) });
  };

  togglecomment = (id) => {
    const { comments, selected_extra_uuid, setAppMessage } = this.props;
    let comment = null;
    if (comments) {
      comment = comments.content.find(c => c.extra_uuid && c.extra_uuid === selected_extra_uuid && c.id === id);
    }
    if (comment) {
      this.setState({ showcomment: !this.state.showcomment });
    } else {
      setAppMessage('normal', '段落无批注！');
    }
  }

  //小白模式表单控制
  changewidth = () => {
    if (parseInt(this.state.width, 10) < 50) {
      this.setState({ width: '50%' });
    } else if (parseInt(this.state.width, 10) > 50) {
      this.setState({ width: '35%' });
    } else {
      this.setState({ width: '60%' });
    }
  }

  renderlinno = (paragraph) => {
    const line = paragraph.text.split('\n').length;
    const search_lineno = this.props.search_lineno;
    const errorlines = this.props.errors.map(error => {
      if (error.extra.id === paragraph.id) {
        return error.extra.line_number;
      } else {
        return null;
      }
    });
    let lineno = [];
    for (let i = 0; i < line; i++) {
      let haserror = false;
      for (let j = 0; j < errorlines.length; j++) {
        if (errorlines[j] === (i + 1)) {
          haserror = true;
          break;
        }
      }
      if (haserror) {
        if (search_lineno === i) {
          lineno.push(<div className="error-line searched" key={i + 1}><b>{i + 1}</b></div>);
        } else {
          lineno.push(<div className="error-line" key={i + 1}><b>{i + 1}</b></div>);
        }
      } else {
        if (search_lineno === i) {
          lineno.push(<div className="searched" key={i + 1}><b>{i + 1}</b></div>);
        } else {
          lineno.push(<div key={i + 1}><b>{i + 1}</b></div>);
        }
      }
    }
    return { lineno: lineno, h: line * 24 };
  }

  rendercommentbox = (id) => {
    const { comments, selected_extra_uuid } = this.props;
    const { showcomment } = this.state;
    let comment = null;
    if (comments) {
      comment = comments.content.find(c => c.extra_uuid && c.extra_uuid === selected_extra_uuid && c.id === id);
    }
    if (showcomment && comment) {
      return (
        <div className="commentbox">
          <div className="commentbox-title">批注</div>
          <div className="commenttextbox">{comment.text}</div>
        </div>
      );
    } else {
      return null;
    }
  }

  rendereditor = () => {
    const { extras, selected_paragraph_id, selected_extra_uuid } = this.props;
    const currentparagraph = extras.find(ex => ex.uuid === selected_extra_uuid).paragraphs.find(p => p.id === selected_paragraph_id);
    if (!currentparagraph) {
      return null;
    } else {
      let lineno = null;
      switch (currentparagraph.type) {
        case 'Node':
          lineno = this.renderlinno(currentparagraph);
          return (
            <div className="paragrapheditor" style={{ width: this.state.width }} >
              <table>
                <tbody>
                  <tr>
                    <td>段落备注：</td>
                    <td><input className="form-control" maxLength="30" style={{ width: '320px' }} value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} /></td>
                  </tr>
                </tbody>
              </table>
              <div className="toolicons">
                <span className="toolicon fa fa-arrows-h" title="扩展" onClick={this.changewidth}></span>
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <div className="extratxteditor">
                <div style={{ height: lineno.h + 'px' }} className="lineno">{lineno.lineno}</div>
                <pre className="placeholder">{currentparagraph.text === '' && currentparagraph.id === 1 ? this.state.placeholder : ''}</pre>
                <textarea ref="texteditor" onDrop={(e) => this.dropFile(e, currentparagraph)} style={{ height: lineno.h + 'px' }} value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
              </div>
              {this.rendercommentbox(currentparagraph.id)}
            </div>
          );
        case 'Branch':
          const branchs = currentparagraph.selections.map((item, key) => {
            return (
              <tr key={key}>
                <td>选项内容{key + 1}：</td>
                <td><input className="form-control" maxLength="15" type="text" value={item.title} onBlur={() => this.initselectiontitle(currentparagraph, key)} onFocus={() => this.initselectiontitle(currentparagraph, key)} onChange={(e) => this.selectiontitlechange(e, currentparagraph, key)} /></td>
              </tr>
            )
          });
          return (
            <div className="paragrapheditor-selection">
              <div className="toolicons">
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <table>
                <tbody>
                  {branchs}
                  <tr>
                    <td></td>
                    <td><div className="table-alert">选项内容最多15字</div></td>
                  </tr>
                </tbody>
              </table>
              {this.rendercommentbox(currentparagraph.id)}
            </div>
          )
        default:
          break;
      }
    }
  }

  render() {
    return this.rendereditor();
  }
}

const mapStateToProps = (state) => {
  return {
    extras: state.extras.list,
    selected_paragraph_id: state.editor.selected_paragraph_id,
    selected_extra_uuid: state.editor.selected_extra_uuid,
    errors: state.editor.errors.filter(error => error.extra.extra_uuid === state.editor.selected_extra_uuid),
    comments: state.editor.comments,
    search_lineno: state.editor.search_lineno
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file, filetype, callback) => dispatch({ type: 'UPLOAD_FILE', file, filetype, callback }),
    updateParagraph: (paragraph) => dispatch({ type: 'EXTRA_UPDATE_PARAGRAPH', paragraph }),
    setAppMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtraParagraphEditor);


// WEBPACK FOOTER //
// ./src/Author/components/ExtraParagraphEditor.js
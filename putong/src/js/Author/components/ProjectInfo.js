import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/ProjectInfo.css';

class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outline: { ...this.props.outline },
      inittags: ['暖男', '霸道总裁', '腹黑', '高冷', '傲娇', '温柔', '高智商', '忠犬', '妖孽', '小奶狗', '黑道', '渣男', '禁欲', '阳光', '校草', '痴汉', '正太', '黑化', '绅士', '毒舌'
      ],
    };
  }

  componentWillMount() {
    this.props.requestIdols();
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

  addothertags = () => {
    let outline = { ...this.state.outline };
    let tagsarr = outline.tags;
    if (tagsarr.length < 5) {
      tagsarr.push('自定义标签');
    }
    outline.tags = tagsarr;
    this.setState({ outline });
  }

  deleteothertags = (index) => {
    let outline = { ...this.state.outline };
    let tagsarr = [];
    let arrothertags = [...outline.tags];
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    arrothertags.splice(index, 1);
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr;
    this.setState({ outline });
  }

  changeothertags = (e, index) => {
    let outline = { ...this.state.outline };
    let tagsarr = [];
    let arrothertags = [...outline.tags];
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    arrothertags[index] = e.target.value;
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr;
    this.setState({ outline });
  }

  initothertags = (e, index) => {
    let outline = { ...this.state.outline };
    let tagsarr = [];
    let arrothertags = [...outline.tags];
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          tagsarr.push(this.state.inittags[j]);
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    if (arrothertags[index] === '') {
      arrothertags[index] = '自定义标签';
    } else if (arrothertags[index] === '自定义标签') {
      arrothertags[index] = '';
    }
    tagsarr = tagsarr.concat(arrothertags);
    outline.tags = tagsarr;
    this.setState({ outline });
  }

  tagschange = (e) => {
    let outline = { ...this.state.outline };
    let tagsarr = [...outline.tags];
    for (let i = 0; i < tagsarr.length; i++) {
      if (tagsarr[i] === e.target.value) {
        tagsarr.splice(i, 1);
        outline.tags = tagsarr;
        this.setState({ outline });
        return
      }
    }
    if (tagsarr.length < 5) {
      tagsarr.push(e.target.value);
      outline.tags = tagsarr;
      this.setState({ outline });
    }
  }

  textchange = (e) => {
    let outline = { ...this.state.outline };
    outline.text = e.target.value;
    this.setState({ outline });
  }

  sketchchange = (e) => {
    let outline = { ...this.props.outline };
    outline.sketch = e.target.value;
    this.setState({ outline });
  }

  titlechange = (e) => {
    let outline = { ...this.state.outline };
    outline.title = e.target.value;
    this.setState({ outline });
  }

  changeprojectimage = (url) => {
    let outline = { ...this.state.outline };
    outline.image = url;
    this.setState({ outline });
  }

  changeprojectvideo = (url) => {
    let outline = { ...this.state.outline };
    outline.video = url;
    this.setState({ outline });
  }

  savechange = () => {
    let outline = { ...this.state.outline };
    if (outline.image === '') {
      this.props.showMessage('error', '必须上传作品图片！');
    } else if (outline.title === '') {
      this.props.showMessage('error', '作品名称不能为空！');
    } else if (outline.tags === '') {
      this.props.showMessage('error', '至少要有1个作品标签！');
    } else if (outline.title.length > 15) {
      this.props.showMessage('error', '作品名称字数不在限制范围内！');
    } else if (outline.text.length < 20) {
      this.props.showMessage('error', '作品简介字数不在限制范围内！');
    } else if (outline.text.length > 200) {
      this.props.showMessage('error', '作品简介字数不在限制范围内！');
    } else {
      this.props.saveProjectOutline(outline);
    }
  }

  renderothertags = () => {
    let outline = { ...this.state.outline };
    let arrothertags = [...outline.tags];
    for (let i = 0; i < arrothertags.length; i++) {
      for (let j = 0; j < this.state.inittags.length; j++) {
        if (arrothertags[i] === this.state.inittags[j]) {
          arrothertags.splice(i, 1);
          i--;
        }
      }
    }
    let othertags = arrothertags.map((tag, key) => {
      return <div key={key}><input className="form-control" type="text" value={tag} maxLength="7" onBlur={(e) => this.initothertags(e, key)} onFocus={(e) => this.initothertags(e, key)} onChange={(e) => this.changeothertags(e, key)} /><div className="fa fa-minus-square delete-tag-item" onClick={(e) => this.deleteothertags(key)}></div></div>
    });
    return (
      <tr>
        <td className="table-txt"></td>
        <td className="table-content">
          {othertags}
          <div className="fa fa-plus-square add-tag-item" onClick={this.addothertags}></div>
          <p className="table-alert">点击添加自定义标签，最多7个字；标签总数最多5个</p>
        </td>
      </tr>
    )
  }

  render() {
    const outline = this.state.outline;
    const idols = this.props.idols;
    const tags = this.state.inittags.map((tag, key) => {
      return (
        <label className="checkbox" key={key}><input type="checkbox" value={tag} checked={outline.tags.join(',').indexOf(tag) !== -1} onChange={this.tagschange} /><i>{tag}</i></label>
      );
    });
    let linkidols = [];
    if (outline.idols.length > 0) {
      outline.idols.forEach((id, key) => {
        for (let i = 0; i < idols.length; i++) {
          if (id === idols[i].id) {
            const idol = idols[i];
            linkidols.push(
              <div key={i} className="idolgroup">
                <img src={idol.image} alt="" />
                <p>{idol.name}</p>
              </div>
            );
          }
        }
      });
    }
    return (
      <div className="projectinfo">
        <div className="project-preview">
          <FileUpload getuploadurl={this.changeprojectimage} src={outline.image} filetype="img2"></FileUpload>
          <p>作品封面</p>
          <FileUpload getuploadurl={this.changeprojectvideo} src={outline.video} filetype="video"></FileUpload>
          <p>预览视频</p>
          <p className="table-alert">封面及视频建议分辨率750 x 1334，格式分别为JPG、MP4</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td className="table-txt">作品名称：</td>
              <td className="table-content">
                <input className="form-control" value={outline.title} type="text" maxLength="15" onChange={this.titlechange} />
                <p className="table-alert">15字以内，请勿添加书名号符号</p>
              </td>
            </tr>
            <tr>
              <td className="table-txt">作品ID：</td>
              <td className="table-content">{outline.id}</td>
            </tr>
            <tr>
              <td className="table-txt">字数：</td>
              <td className="table-content">{outline.character_count}</td>
            </tr>
            <tr>
              <td className="table-txt">上架状态：</td>
              <td className="table-content">{outline.online_status === 0 ? '未上架' : '已上架'}</td>
            </tr>
            <tr>
              <td className="table-txt">审核状态：</td>
              <td className="table-content">{this.getstatus(outline.status)}</td>
            </tr>
            <tr>
              <td className="table-txt">作品标签：</td>
              <td className="table-content tag-items">
                {tags}
              </td>
            </tr>
            {this.renderothertags()}
            <tr>
              <td className="table-txt">关联偶像：</td>
              <td className="table-content">
                <div className="idols">
                  {linkidols.length > 0 ? linkidols : <p>无</p>}
                </div>
              </td>
            </tr>
            <tr>
              <td className="table-txt">作品简介：</td>
              <td className="table-content">
                <textarea className="form-control noresize" rows="6" cols="60" maxLength="200" value={outline.text} onChange={this.textchange}></textarea>
                <p className="table-alert">20~200字以内,简介介绍作品故事梗概</p>
              </td>
            </tr>
            <tr>
              <td className="table-txt">作品大纲：</td>
              <td className="table-content">
                <textarea className="form-control" rows="10" cols="90" value={outline.sketch} onChange={this.sketchchange}></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn-green-s savechange" onClick={this.savechange}>保 存</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, projects: state.projects.list, outline: state.editor.outline, idols: state.idols.list };
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestIdols: () => dispatch({ type: 'REQUEST_IDOLS' }),
    saveProjectOutline: (outline) => dispatch({ type: 'SAVE_PROJECT_OUTLINE', outline: outline }),
    showMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);


// WEBPACK FOOTER //
// ./src/Author/components/ProjectInfo.js
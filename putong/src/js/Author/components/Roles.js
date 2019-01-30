import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import defaultimg from '../../images/user_default.jpg';
import '../css/Roles.css';

class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentrole: null,
      editroletype: 0,
      defaultimg: defaultimg,
      currentindex: null,
    }
  }

  componentWillMount() {
    const roles = this.props.content.roles;
    const currentrole = this.state.currentrole;
    if (roles.length === 0 && currentrole === null) {
      this.newrole();
    } else {
      this.setState({ currentrole: roles[0], editroletype: 1, currentindex: null });
    }
  }

  newrole = () => {
    const id = this.props.content.roles.length > 0 ? (Math.max.apply(Math, this.props.content.roles.map((item) => { return item.id })) + 1) : 1;
    const newrole = { id: id, chat_id: id, "type": "NPC", name: "", profile: "", animations: [], gallery_ids: [], has_memory: true, remark: '' };
    this.setState({ ...this, currentrole: newrole, editroletype: 0 });
  }

  changerolename = (e) => {
    let currentrole = this.state.currentrole;
    currentrole.name = e.target.value;
    this.setState({ ...this, currentrole: currentrole });
  }

  changeroleremark = (e) => {
    let currentrole = this.state.currentrole;
    currentrole.remark = e.target.value;
    this.setState({ ...this, currentrole: currentrole });
  }

  changehasmemory = () => {
    this.setState({ currentrole: { ...this.state.currentrole, has_memory: !this.state.currentrole.has_memory } });
  }

  changeroleimg = (url) => {
    let currentrole = this.state.currentrole;
    currentrole.profile = url;
    this.setState({ currentrole });
  }

  editrole = (id) => {
    let currentrole = null;
    for (let i = 0; i < this.props.content.roles.length; i++) {
      if (this.props.content.roles[i].id === id) {
        currentrole = { ...this.props.content.roles[i] };
        this.setState({ currentrole: currentrole, editroletype: 1 });
        break;
      }
    }
  }

  saveroleinfo = () => {
    if (this.state.currentrole.profile === '') {
      this.props.showMessage('error', '未上传角色头像！');
    } else if (this.state.currentrole.name === '') {
      this.props.showMessage('error', '角色名不能为空！');
    } else if (this.state.currentrole.name.length > 7) {
      this.props.showMessage('error', '角色名称长度超出限制！');
    } else if (this.state.currentrole.remark.length > 200) {
      this.props.showMessage('error', '人设备注字数不在限制范围内！');
    } else {
      let content = { ...this.props.content };
      let currentrole = this.state.currentrole;
      if (currentrole.animations) {
        for (let i = 0; i < currentrole.animations.length; i++) {
          for (let j = 0; j < currentrole.animations[i].frames.length; j++) {
            for (let k = 0; k < currentrole.animations[i].frames[j].images.length; k++) {
              if (currentrole.animations[i].frames[j].images[k].offset_x === '') {
                currentrole.animations[i].frames[j].images[k].offset_x = 0;
              }
              if (currentrole.animations[i].frames[j].images[k].offset_y === '') {
                currentrole.animations[i].frames[j].images[k].offset_y = 0;
              }
            }
          }
        }
      }
      if (this.state.editroletype === 0) {
        content.roles.push(this.state.currentrole);
      } else {
        for (let i = 0; i < content.roles.length; i++) {
          if (content.roles[i].id === this.state.currentrole.id) {
            content.roles[i] = { ...this.state.currentrole };
            break;
          }
        }
      }
      this.setState({ editroletype: 1 });
      this.props.saveProjectContent(content);
    }
  }

  deleterole = (e, id) => {
    e.stopPropagation();
    let content = { ...this.props.content };
    let roles = content.roles.filter(r => r.id !== id);
    content.roles = roles;
    this.setState({ currentrole: null });
    this.props.deletroleConfirm({ type: 'SAVE_PROJECT_CONTENT', content: content });
  }

  toggleanimation = (index) => {
    if (this.state.currentindex === index) {
      this.setState({ currentindex: null });
    } else {
      this.setState({ currentindex: index });
    }
  }

  changeanimationname = (e, index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map(a => ({ ...a }));
    animations[index].name = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  initanimationname = (index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map(a => ({ ...a }));
    if (animations[index].name === '未命名立绘') {
      animations[index].name = '';
    } else if (animations[index].name === '') {
      animations[index].name = '未命名立绘';
    }
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  changeframeimgurl = (url, index, frame_index, img_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        const frames = [...a.frames];
        let images = [...frames[frame_index].images];
        images[img_index].url = url;
        frames[frame_index].images = images;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  changeoffset_x = (e, index, frame_index, img_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        const frames = [...a.frames];
        let images = [...frames[frame_index].images];
        if (/^(-)?[0123456789]+/.test(e.target.value)) {
          images[img_index].offset_x = parseInt(e.target.value, 10);
        } else if (e.target.value === '-' || e.target.value === '') {
          images[img_index].offset_x = e.target.value;
        }
        frames[frame_index].images = images;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  changeoffset_y = (e, index, frame_index, img_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        const frames = [...a.frames];
        let images = [...frames[frame_index].images];
        if (/^(-)?[0123456789]+/.test(e.target.value)) {
          images[img_index].offset_y = parseInt(e.target.value, 10);
        } else if (e.target.value === '-' || e.target.value === '') {
          images[img_index].offset_y = e.target.value;
        }
        frames[frame_index].images = images;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  changeframetime = (e, index, frame_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        let frames = [...a.frames];
        frames[frame_index].time = parseInt(e.target.value.replace(/\D/g, ''), 10) | 0;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  newanimation = () => {
    let currentrole = this.state.currentrole;
    let animations = [];
    if (currentrole.animations && currentrole.animations.length > 0) {
      animations = currentrole.animations.map(a => ({ ...a }));
    }
    animations.push({
      name: '未命名立绘',
      frames: [{ images: [{ url: '', offset_x: 0, offset_y: 0 }], time: 100 }],
    });
    currentrole.animations = animations;
    this.setState({ currentrole, currentindex: animations.length - 1 });
  }

  deleteanimation = (e, index) => {
    e.stopPropagation();
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map(a => ({ ...a }));
    animations.splice(index, 1);
    currentrole.animations = animations;
    if (this.state.currentindex === index) {
      this.setState({ currentrole, currentindex: null });
    } else {
      this.setState({ currentrole });
    }
  }

  addframe = (index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        let frames = [...a.frames];
        frames.push({ images: [{ url: '', offset_x: 0, offset_y: 0 }], time: 100 });
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  deleteframe = (index, frame_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        let frames = [...a.frames];
        if (frames.length > 1) {
          frames.splice(frame_index, 1);
        }
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  addimg = (index, frame_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        const frames = [...a.frames];
        const images = [...frames[frame_index].images];
        images.push({ url: '', offset_x: 0, offset_y: 0 });
        frames[frame_index].images = images;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  deleteimg = (index, frame_index, image_index) => {
    let currentrole = this.state.currentrole;
    let animations = currentrole.animations.map((a, _index) => {
      if (_index === index) {
        const frames = [...a.frames];
        let images = [...frames[frame_index].images];
        if (images.length > 1) {
          images.splice(image_index, 1);
        }
        frames[frame_index].images = images;
        return { ...a, frames }
      } else {
        return { ...a };
      }
    });
    currentrole.animations = animations;
    this.setState({ currentrole });
  }

  renderroleeditor = () => {
    if (this.state.currentrole === null) {
      return null;
    } else {
      return (
        <div className="roleseditor">
          <table>
            <tbody>
              <tr>
                <td className="table-txt">头像</td>
                <td className="table-content">
                  <FileUpload getuploadurl={this.changeroleimg} src={this.state.currentrole.profile} filetype="img1"></FileUpload>
                </td>
              </tr>
              <tr>
                <td className="table-txt">角色名</td>
                <td className="table-content">
                  <input className="form-control" value={this.state.currentrole.name} type="text" maxLength="7" onChange={this.changerolename} />
                  <p className="table-alert">名字最多7个字</p>
                </td>
              </tr>
              {/* <tr>
              <td className="table-txt">回忆按钮</td>
              <td className="table-content">
                <label className="radio"><input type="checkbox" checked={this.state.currentrole.has_memory} onChange={this.changehasmemory} />有</label>
                <label className="radio"><input type="checkbox" checked={!this.state.currentrole.has_memory} onChange={this.changehasmemory} />没有</label>
                <p className="table-alert">选择是否在该角色的聊天界面右上角出现回忆按钮</p>
              </td>
            </tr> */}
              <tr>
                <td className="table-txt">人设备注</td>
                <td className="table-content">
                  <textarea className="form-control noresize" maxLength="200" rows="6" cols="40" value={this.state.currentrole.remark} onChange={this.changeroleremark}></textarea>
                  <p className="table-alert">选填，供作者写作参考，长度不得超过200</p>
                </td>
              </tr>
              <tr>
                <td className="table-txt">立绘</td>
                <td className="table-content"></td>
              </tr>
            </tbody>
          </table>
          <div className="animations">
            {this.renderanimation()}
            <div className="add-animation" onClick={this.newanimation} title="添加立绘"><span className="fa fa-plus"></span></div>
          </div>
          <div className="btn-green-s savechange" onClick={this.saveroleinfo}>保 存</div>
        </div>
      );
    }
  }

  renderanimation = () => {
    const animations = this.state.currentrole ? this.state.currentrole.animations : null;
    const list = [];
    if (animations) {
      animations.forEach((item, index) => {
        const frames = item.frames.map((frame, frame_index) => {
          const imgs = frame.images.map((img, img_index) => (
            <div key={img_index} className="img-group">
              <span className="fa fa-times-circle delete-img" title="删除" onClick={() => this.deleteimg(index, frame_index, img_index)}></span>
              <FileUpload getuploadurl={(url) => this.changeframeimgurl(url, index, frame_index, img_index)} src={img.url} filetype="img1"></FileUpload>
              <div className="frame-group">水平偏移<input className="form-control" value={img.offset_x} onChange={(e) => this.changeoffset_x(e, index, frame_index, img_index)} /></div>
              <div className="frame-group">垂直偏移<input className="form-control" value={img.offset_y} onChange={(e) => this.changeoffset_y(e, index, frame_index, img_index)} /></div>
            </div>
          ));
          return (
            <tr key={frame_index}>
              <td className="table-txt">{'第' + (frame_index + 1) + '帧'}<span className="fa fa-trash-o delete-frame" title="删除帧" onClick={() => this.deleteframe(index, frame_index)}></span></td>
              <td className="table-content">
                <div className="frameimgs">
                  {imgs}
                  <div className="add-img"><span className="fa fa-plus-circle" title="添加图片" onClick={() => this.addimg(index, frame_index)}></span></div>
                </div>
                <div className="interval">持续时长<input className="form-control" type="text" value={frame.time} onChange={(e) => this.changeframetime(e, index, frame_index)} />ms</div>
              </td>
            </tr>
          )
        });
        let animation = null;
        if (this.state.currentindex === index) {
          animation = (
            <div key={index} className="animation">
              <div className="animation-title current" onClick={() => this.toggleanimation(index)}>{item.name + (index === 0 ? ' (默认)' : '')}<span className="delete-animation" onClick={(e) => this.deleteanimation(e, index)}>删除</span></div>
              <div className="animation-body">
                <table>
                  <tbody>
                    <tr>
                      <td className="table-txt">名称</td>
                      <td className="table-content"><input className="form-control" type="text" value={item.name} onBlur={(e) => this.initanimationname(index)} onFocus={(e) => this.initanimationname(index)} onChange={(e) => this.changeanimationname(e, index)} /></td>
                    </tr>
                    {frames}
                    <tr>
                      <td className="table-txt"></td>
                      <td className="table-content">
                        <div className="add-frame" onClick={() => this.addframe(index)}>添加帧</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        } else {
          animation = (
            <div key={index} className="animation">
              <div className="animation-title" onClick={() => this.toggleanimation(index)}>{item.name + (index === 0 ? ' (默认)' : '')}<span className="delete-animation" onClick={(e) => this.deleteanimation(e, index)}>删除</span></div>
            </div>
          );
        }
        list.push(animation);
      });
    }
    return list;
  }

  render() {
    const roles = this.props.content.roles;
    const currentrole = this.state.currentrole;
    const rolelist = roles.map((item) => {
      return (
        <li className={"role-item " + (currentrole ? (currentrole.id === item.id ? 'current-role' : '') : '')} key={item.id} onClick={() => this.editrole(item.id)}>
          <img className="role-photo" alt="头像" src={item.profile === '' ? this.state.defaultimg : item.profile + '?imageView2/2/w/400/q/85!'} />
          <b>{item.name}</b>
          <span className="fa fa-trash-o role-delete" onClick={(e) => { this.deleterole(e, item.id) }} title="删除角色"></span>
        </li>
      );
    });
    return (
      <div className="roles">
        <div className="rolelist ">
          <h3>角色列表</h3>
          <span className="fa fa-user-plus addrole" onClick={this.newrole} title="新建角色"></span>
          <ul className="role-items">
            {rolelist}
          </ul>
        </div>
        {this.renderroleeditor()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletroleConfirm: (cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content: '删除角色将会导致剧本中角色引用错误，需要修改相应的剧本引用，确定删除该角色吗？', cback } }),
    saveProjectContent: (content) => dispatch({ type: 'SAVE_PROJECT_CONTENT', content: content }),
    showMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles);


// WEBPACK FOOTER //
// ./src/Author/components/Roles.js
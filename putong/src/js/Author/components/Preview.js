import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultimg from '../../images/icon_default_profile@3x.png';
import defaultendbg from '../../images/endbg.jpg';
import play from '../../images/play.png';
import '../css/Preview.css';
import LianLianUtil from '../utils/lianlianUtil'
import { is, fromJS } from 'immutable';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: '',
      videoplay: false,
    };
    this.posArr = [];
      //如果是因为1)textarea滚动事件导致preview scrollTop的调整 2)因为textarea focus导致的preview重新render
      // ，则置为false，此时不触发scrollTop
    this.shouldDispatchScroll = true;
  }


  stopplay = () => {
    this.setState({ videoplay: false });
  }
  toplay = (video) => {
    this.setState({ video, videoplay: true });
  }

  trimParagraphText = (text) => {
    // 移除首尾的多余空行和空格
    return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
  }

  getRoleByName(name) {
    const out_roles = this.props.roles;
    if (name === '我') {
      return 0;
    } else {
      return out_roles.find(r => r.name === name);
    }
  }

  getRoleById(id) {
    const out_roles = this.props.roles;
    return out_roles.find(r => r.id === id);
  }

  buildParagraphNodes = (text) => {
    const nodes = [];
    const trimmed_text = this.trimParagraphText(text);
    const blocks = trimmed_text.split(/\n[\s\n]*\n/);
    let incall = false;
    for (let i = 0; i < blocks.length; i++) {
      const nodeText = blocks[i];//将每个node所有文本内容保存下来，用于滚动条联动

      const lines = blocks[i].split(/\n/);
      if (lines[0].startsWith('@')) {
        // 有角色的内容，例如@我、@旁白、@角色名
        const role = this.getRoleByName(lines[0].substring(1).trim());
        if (role !== undefined) {
          if (!incall && lines[1] && lines[1].startsWith('#图片#')) {                                // 图片
            const image = lines[2] ? lines[2].trim() : '';
            if (image !== '') {
              nodes.push({ type: 'Image', role, image, nodeText });
            }
          } else if (!incall && lines[1] && lines[1].startsWith('#音频#')) {                         // 音频
            const audio = lines[2] ? lines[2].trim() : '';
            const time = parseInt(audio.match(/\d+\.mp3$/), 10);
            if (audio !== '') {
              nodes.push({ type: 'Audio', role, audio, time,nodeText });
            }
          } else if (!incall && lines[1] && lines[1].startsWith('#视频#')) {                         // 视频
            const text = lines[2] ? lines[2].trim() : '';
            const video = lines[3] ? lines[3].trim() : '';
            if (video !== '') {
              nodes.push({ type: 'Video', role, text, video, nodeText });
            }
          } else if (!incall && lines[1] && lines[1].startsWith('#电话开始#')) {                     // 电话开始
            incall = true;
            const title = lines[2] ? lines[2].trim() : '';
            const image = lines[3] ? lines[3].trim() : '';

            let nodeText = [];//电话过程可能包含多个block
            for(let j = i; j < blocks.length; j++){
              nodeText.push(blocks[j]);
              if(blocks[j].includes("#电话结束#")){
                break;
              }
            }

            nodes.push({ type: 'Call', role, title, image, nodeText });
          } else if (!incall && lines[1] && lines[1].startsWith('#链接#')) {                         // 链接
            const title = lines[2] ? lines[2].trim() : '';
            const text = lines[3] ? lines[3].trim() : '';
            const link = lines[4] ? lines[4].trim() : '';
            const image = lines[5] ? lines[5].trim() : '';
            if (image !== '') {
              nodes.push({ type: 'Link', title, text, link, image, role, nodeText });
            }
          } else if (!incall && lines[1] && lines[1].startsWith('#忙碌#')) {                         // 忙碌
            const text = lines[2] ? lines[2].trim() : '';
            // nodes.push({ type: 'Busy', text, role });
            nodes.push({ type: 'Text', role: -1, text: '忙碌：' + text, nodeText });
          } else if (!incall) {
            const text = blocks[i].substring(lines[0].length + 1).trim();
            if (text !== '') {
              nodes.push({ type: 'Text', text, role, nodeText });                                             // 文本
            }
          }
        }
      } else if (lines[0].startsWith('#电话结束#')) {                                               // 电话结束
        incall = false;
      } else {
        // 不需要@角色的内容
        if (!incall && lines[0].startsWith('#图片#')) {                                             // 旁白图片
          const image = lines[1] ? lines[1].trim() : '';
          if (image !== '') {
            nodes.push({ type: 'Image', role: -1, image, nodeText });
          }
        } else if (!incall && lines[0].startsWith('#视频#')) {                                      // 旁白视频
          const text = lines[1] ? lines[1].trim() : '';
          const video = lines[2] ? lines[2].trim() : '';
          if (video !== '') {
            nodes.push({ type: 'Video', role: -1, text, video, nodeText });
          }
        } else if (!incall && lines[0].startsWith('==')) {                                          // 延迟

        } else if (!incall && lines[0].startsWith('#数值#')) {                                      // 数值
          nodes.push({ type: 'Text', role: -1, text: '数值：' + lines[1], nodeText });
        } else if (!incall && lines[0].length > 0) {
          nodes.push({ type: 'Text', role: -1, text: blocks[i].trim(), nodeText });                           // 旁白文本
        }
      }
    }
    return nodes;
  }

  getroleinfoByid = (id) => {
    return this.props.roles.find(item => item.id === id);
  }

  getroleinfoByname = (name) => {
    return this.props.roles.find(item => item.name === name);
  }

    updatePosArr(){
        const childArr = this.refs.chatbox.children;
        if(childArr.length > 0){
            let firstTop = childArr[0].getBoundingClientRect().top;
            this.posArr.push({
                top:0,
                nodeText : childArr[0].children[0].innerText
            });
            for(let len = 1; len < childArr.length; len++){
                let curTop = childArr[len].getBoundingClientRect().top;
                this.posArr.push({
                    top:curTop - firstTop,
                    nodeText:childArr[len].children[0].innerText
                })
            }
        }
    }

  /*保存当前所有node的相对于第一个node的top值*/
  componentDidMount(){
      this.updatePosArr();
  }

    shouldComponentUpdate(nextProps, nextState) {
      if(this.props.scrollTopText !== nextProps.scrollTopText){
          this.shouldDispatchScroll = true;//说明此时是因为textarea滚动调整导致preview 重新render
      }
      else{
          this.shouldDispatchScroll = false;//
      }
      this.updatePosArr();
      return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

  componentDidUpdate(){
      if(this.shouldDispatchScroll && this.props.scrollTopText !== null && this.posArr){
          let top = 0;
          for(let len = 0; len < this.posArr.length; len++){
              let nodeText = this.posArr[len].nodeText;
              if(nodeText && this.props.scrollTopText && nodeText.includes(this.props.scrollTopText)){
                  top = this.posArr[len].top;
                  break;
              }
          }
          if(this.refs.chatbox.scrollTop !== top){
              this.refs.chatbox.scrollTop = top;
              this.shouldDispatchScroll = false;
          }
      }
  }

  /*滚动时查找当前显示的最顶端的nodeText*/
  chatBoxSrollHandler = ()=>{
      if(this.shouldDispatchScroll){
          let scrollTop = this.refs.chatbox.scrollTop;
          for(let len = 0; len < this.posArr.length; len++){
              let pos = this.posArr[len];
              if(pos.top >= scrollTop){
                  let nodeText = len == 0? this.posArr[0].nodeText : this.posArr[len - 1].nodeText;//向前一个
                  this.props.changeTextAreaScroll(nodeText);
                  break;
              }
          }
      }
      else{
          this.shouldDispatchScroll = true;
      }

  }

  render() {
    let currentparagraph = null;
    const content = this.props.content;
    for (let i = 0; i < content.paragraphs.length; i++) {
      if (content.paragraphs[i].id === this.props.selected_paragraph_id) {
        currentparagraph = content.paragraphs[i];
        break;
      }
    }
    const user = this.props.user;
    const chatrole = this.getRoleById(currentparagraph.chat_id);
    const nodes = this.buildParagraphNodes(currentparagraph.text);
    if (currentparagraph.type === 'Node') {
      const chatlist = nodes.map((node, key) => {
        let nodeText = Array.from(node.nodeText).join("");
        let msgClass = (this.props.focusText && nodeText.includes(this.props.focusText))? " msg-focus":"";
        if (node.type === 'Text') {
          if (node.role === 0) {
            return (
              <pre key={key} className="msg-right">
                <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className={"msg-pop " + msgClass} ><span>{node.text}</span></div>
              </pre>
            )
          } else if (node.role === -1) {
            return (
              <div key={key} className="aside">
                  <span className="hidden-text">{nodeText}</span>
                  <span className={msgClass}>{node.text}</span>
              </div>
            )
          } else {
            return (
              <pre key={key} className="msg-left">
                <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className={"msg-pop " + msgClass}><span>{node.text}</span></div>
              </pre>
            )
          }
        } else if (node.type === 'Image') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className={"img-pop " + msgClass}>
                  <img className="img" alt="" src={node.image} />
                </div>
              </div>
            )
          } else if (node.role === -1) {
            return (
              <div key={key} className="aside">
                  <span className="hidden-text">{nodeText}</span>
                  <img alt="" className={"img " + msgClass} src={node.image} />
              </div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className={"img-pop " + msgClass}>
                  <img className="img" alt="" src={node.image} />
                </div>
              </div>
            )
          }
        } else if (node.type === 'Audio') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className={"audio-pop " + msgClass} style={{ width: Math.min(node.time / 60 * 220, 220) + 'px' }}>
                  <span className="audio-icon fa fa-wifi"></span>
                  <div className="audio-time">{node.time + '"'}</div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className={"audio-pop " + msgClass} style={{ width: Math.min(node.time / 60 * 220, 220) + 'px' }}>
                  <span className="audio-icon fa fa-wifi"></span>
                  <div className="audio-time">{node.time + '"'}</div>
                </div>
              </div>
            )
          }
        } else if (node.type === 'Video') {
          if (node.role === 0) {
            return (
              <div key={key} className="msg-right">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={user.profile === '' ? defaultimg : user.profile} />
                <div className="rolename">{user.name}</div>
                <div className={"video-pop " + msgClass} onClick={() => this.toplay(node.video)}>
                  <img className="img" alt="" src={node.video + '.0_0.p0.jpg'} />
                  <img className="play-btn" alt="" src={play} />
                </div>
              </div>
            )
          } else if (node.role === -1) {
            return (
              <div key={key} className={"aside-box " + msgClass}>
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={chatrole.profile === '' ? defaultimg : chatrole.profile} />
                <div className="meettype">事件</div>
                <div className={"meettitle" }>{node.text}</div>
                <div className="meetbtn" onClick={() => this.toplay(node.video)}>会面</div>
              </div>
            )
          } else {
            return (
              <div key={key} className="msg-left">
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="rolename">{node.role.name}</div>
                <div className={"video-pop " + msgClass} onClick={() => this.toplay(node.video)}>
                  <img className="img" alt="" src={node.video + '.0_0.p0.jpg'} />
                  <img className="play-btn" alt="" src={play} />
                </div>
              </div>
            )
          }
        } else if (node.type === 'Call') {
          if (node.role !== 0 && node.role !== -1) {
            return (
              <div key={key} className={"aside-box "+msgClass}>
                  <span className="hidden-text">{nodeText}</span>
                <img className="profile" alt="" src={node.role.profile === '' ? defaultimg : node.role.profile} />
                <div className="meettype">事件</div>
                <div className="meettitle">{node.title}</div>
                <div className="meetbtn">通话</div>
              </div>
            )
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
      return (
        <div className="preview" >
          <div className="preview-box">
            {this.state.videoplay ? <video className="videoplayer" autoPlay="true" src={this.state.video} onClick={this.stopplay}></video> : null}
            <div className="preview-title">{this.getroleinfoByid(currentparagraph.chat_id) === undefined ? '匿名' : this.getroleinfoByid(currentparagraph.chat_id).name}</div>
            <div className="chat-box" ref="chatbox" onScroll={LianLianUtil.debounce(this.chatBoxSrollHandler, 300).bind(this)}>
              {chatlist}
            </div>
          </div>
        </div>
      );
    } else if (currentparagraph.type === 'End') {
      return (
        <div className="preview" >
          <div className="preview-box">
            <img src={currentparagraph.image === '' ? defaultendbg : currentparagraph.image} alt="" className="endbg" />
            <div className="endbox">
              <div className="endcontent">
                <div className="endtitle">{currentparagraph.title}</div>
                <pre className="endtext">{currentparagraph.text}</pre>
              </div>
            </div>
            <div className="endbackbtn">返回</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    content: state.editor.content,
    roles: state.editor.content.roles,
    user: state.user,
    selected_paragraph_id: state.editor.selected_paragraph_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);


// WEBPACK FOOTER //
// ./src/Author/components/Preview.js
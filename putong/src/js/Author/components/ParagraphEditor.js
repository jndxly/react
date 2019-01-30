import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/ParagraphEditor.css';
import Preview from './Preview';

class ParagraphEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '35%',
      preview: true,
      placeholder: '扑通小课堂\n角色名前面需要加@，每条消息之间用空格隔开\n图片视频可以直接拖到文本框，会自动生成链接\n@韩梅梅\n月色真美\n\n@李雷\n是啊，月亮好大，像个饼。\n\n@韩梅梅\n#图片#\nhttp://aa.bb.cc.jpg\n\n@李雷\n#视频#\n假装此处有视频简介\nhttp://dd.ee.ff.mp4\n\n@我\nemmmmmm，教练，我要学扑通扑通编辑器~',
      toolbox: 'none',
      addtxt: null,
      showcomment: true,
      position: null,
      move: false,
      showoptions: null,
    };
  }

  //切换聊天对象
  changechatid = (e, paragraph) => {
    paragraph.chat_id = parseInt(e.target.value, 10);
    this.props.updateParagraph(paragraph);
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

  initendtext = (paragraph) => {
    if (paragraph.type === 'End') {
      if (paragraph.text === '') {
        paragraph.text = '结局描述';
      } else if (paragraph.text === '结局描述') {
        paragraph.text = '';
      }
    }
    this.props.updateParagraph(paragraph);
  }

  changetext = (e, paragraph) => {
    const move = (paragraph.text.indexOf(e.target.value) === 0 || e.target.value.indexOf(paragraph.text) === 0);
    this.setState({ move });
    paragraph.text = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changebranchtype = (paragraph) => {
    let newparagraph = null;
    const numbers = this.props.content.numbers;
    let nums = {};
    Object.keys(numbers).forEach(n => {
      nums = Object.assign(nums, numbers[n].nums);
    });
    if (paragraph.type === 'Branch') {
      newparagraph = {
        id: paragraph.id,
        chat_id: paragraph.chat_id,
        type: 'NumberBranch',
        expanded: paragraph.expanded,
        selections: paragraph.selections.map(s => ({ operator: '&', conditions: [{ key: '', operator: '<', value: 0 }], next_id: s.next_id }))
      };
    } else {
      newparagraph = {
        id: paragraph.id,
        type: 'Branch',
        chat_id: paragraph.chat_id,
        expanded: paragraph.expanded,
        selections: paragraph.selections.map(s => ({ title: '未命名选项', next_id: s.next_id }))
      };
    }
    this.props.updateParagraph(newparagraph);
  }

  changenumber = (e, paragraph) => {
    paragraph.key = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changeselectiontitle = (e, paragraph, branch_index) => {
    paragraph.selections[branch_index].title = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changeselectionshow_type = (e, paragraph, branch_index) => {
    paragraph.selections[branch_index].show_type = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changeselectionoperator = (e, paragraph, branch_index) => {
    paragraph.selections[branch_index].operator = e.target.value;
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

  changecoin = (e, paragraph) => {
    const coin = e.target.value.replace(/\D/g, '');
    paragraph.coin = parseInt(coin, 10) | 0;
    this.props.updateParagraph(paragraph);
  }

  initcoin = (e, paragraph) => {
    let coin = e.target.value;
    if (coin === '' || coin === '0') {
      coin = 1;
    }
    paragraph.coin = parseInt(coin, 10) | 0;
    this.props.updateParagraph(paragraph);
  }

  changepaytype = (e, paragraph) => {
    paragraph.pay_type = e.target.value;
    if (paragraph.pay_type === 'WaitOrPay') {
      paragraph.title = '币/时 ' + paragraph.coin;
    } else {
      paragraph.title = '币 ' + paragraph.coin;
    }
    this.props.updateParagraph(paragraph);
  }

  changeshowtype = (e, paragraph) => {
    paragraph.show_type = e.target.value;
    if (paragraph.show_type === 'Off') {
      paragraph.title = '待续：隐藏';
    } else {
      paragraph.title = '待续：显示';
    }
    this.props.updateParagraph(paragraph);
  }

  changeendimg = (url) => {
    let selected_paragraph_id = this.props.selected_paragraph_id;
    let paragraphs = [...this.props.content.paragraphs];
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].id === selected_paragraph_id) {
        paragraphs[i].image = url;
        this.props.updateParagraph(paragraphs[i]);
        break;
      }
    }
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

  togglepreview = () => {
    this.setState({ preview: !this.state.preview });
  }

  togglecomment = (id) => {
    const { comments, setAppMessage } = this.props;
    let comment = null;
    if (comments) {
      comment = comments.content.find(c => !c.extra_uuid && c.id === id);
    }
    if (comment) {
      this.setState({ showcomment: !this.state.showcomment });
    } else {
      setAppMessage('normal', '段落无批注！');
    }
  }

  //小白模式工具栏控制
  changetoolbox = (toolbox, id, chat_id) => {
    const texteditor = this.refs.texteditor;
    let role = '我';
    if (toolbox === 'addbusy') {
      for (let i = 0; i < this.props.content.roles.length; i++) {
        if (this.props.content.roles[i].id === chat_id) {
          role = this.props.content.roles[i].name;
          break;
        }
      }
    }
    this.setState({
      toolbox,
      addtxt: {
        role,
        title: '',
        url: '',
        img: '',
        video: '',
        text: '',
        gallery: '不收集',
        preview: '',
      },
      position: { id, index: texteditor.selectionStart },
    });
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

  changeaddtxtrole = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, role: e.target.value } });
  }

  changeaddtxtgallery = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, gallery: e.target.value } });
  }

  changeaddtxttext = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, text: e.target.value } });
  }

  changeaddtxttitle = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, title: e.target.value } });
  }

  changeaddtxturl = (e) => {
    this.setState({ addtxt: { ...this.state.addtxt, url: e.target.value } });
  }

  changeaddtxtimg = (img) => {
    this.setState({ addtxt: { ...this.state.addtxt, img } });
  }

  changeaddtxtvideo = (video) => {
    this.setState({ addtxt: { ...this.state.addtxt, video } });
    // this.setState({ addtxt: { ...this.state.addtxt, video }, toolbox: 'addpreview' });
  }

  changeaddtxtpreview = (preview) => {
    this.setState({ addtxt: { ...this.state.addtxt, preview } });
  }

  toaddusername = (currentparagraph) => {
    const elem = this.refs.texteditor;
    let paragraph = { ...currentparagraph };
    paragraph.text = paragraph.text.substring(0, elem.selectionStart) + '{username}' + paragraph.text.substring(elem.selectionStart);
    this.props.updateParagraph(paragraph);
    const index = elem.selectionStart + 10;
    setTimeout(function () {
      elem.focus()
      if (elem.setSelectionRange) { // 标准浏览器
        elem.setSelectionRange(index, index)
      } else { // IE9-
        const range = elem.createTextRange();
        range.moveStart("character", -paragraph.text.length);
        range.moveEnd("character", -paragraph.text.length);
        range.moveStart("character", index);
        range.moveEnd("character", 0);
        range.select();
      }
    });
  }

  toaddtxt = (currentparagraph) => {
    const position = this.state.position;
    const addtxt = this.state.addtxt;
    let paragraph = { ...currentparagraph };
    let index = paragraph.text.length - 1;
    if (position && position.id === currentparagraph.id) {
      index = position.index;
    }
    let temptext = '';
    switch (this.state.toolbox) {
      case 'addtext':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += addtxt.text + '\n';
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      case 'addimg':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += '#图片#\n' + addtxt.img;
        if (addtxt.gallery !== '不收集') {
          temptext += '\n>' + addtxt.gallery + '\n';
        } else {
          temptext += '\n';
        }
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      case 'addaudio':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += '#音频#\n' + addtxt.img;
        if (addtxt.gallery !== '不收集') {
          temptext += '\n>' + addtxt.gallery + '\n';
        } else {
          temptext += '\n';
        }
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      case 'addvideo':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += '#视频#\n';
        temptext += addtxt.text + '\n';
        temptext += addtxt.video + '\n';
        temptext += addtxt.preview;
        if (addtxt.gallery !== '不收集') {
          temptext += '\n>' + addtxt.gallery + '\n';
        } else {
          temptext += '\n';
        }
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      case 'addlink':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += '#链接#\n';
        temptext += addtxt.title + '\n';
        temptext += addtxt.text + '\n';
        temptext += addtxt.url + '\n';
        temptext += addtxt.img + '\n';
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      case 'addbusy':
        if (addtxt.role === '旁白') {
          temptext += '\n\n';
        } else {
          temptext += '\n\n@' + addtxt.role + '\n';
        }
        temptext += '#忙碌#\n' + addtxt.text + '\n';
        if (index === 0 || paragraph.text === '') {
          temptext = temptext.substring(2);
        }
        paragraph.text = paragraph.text.substring(0, index) + temptext + paragraph.text.substring(index);
        paragraph.text = paragraph.text.replace(/\n\n+/g, '\n\n');
        this.props.updateParagraph(paragraph);
        break;

      default:
        break;
    }
    const elem = this.refs.texteditor;
    index = index + temptext.length - 1;
    setTimeout(function () {
      elem.focus()
      if (elem.setSelectionRange) { // 标准浏览器
        elem.setSelectionRange(index, index)
      } else { // IE9-
        const range = elem.createTextRange();
        range.moveStart("character", -paragraph.text.length);
        range.moveEnd("character", -paragraph.text.length);
        range.moveStart("character", index);
        range.moveEnd("character", 0);
        range.select();
      }
    });
    this.setState({ toolbox: 'none', position: null, move: true });
  }

  addoption = (paragraph, branch_index) => {
    if (paragraph.type === 'Branch') {
      if (paragraph.selections[branch_index].show_type) {
        paragraph.selections[branch_index].conditions.push({ key: '', operator: '>=', value: 0 });
      } else {
        paragraph.selections[branch_index].show_type = 'hide';
        paragraph.selections[branch_index].operator = '&';
        paragraph.selections[branch_index].conditions = [{ key: '', operator: '>=', value: 0 }];
      }
    } else {
      paragraph.selections[branch_index].conditions.push({ key: '', operator: '>=', value: 0 });
    }
    this.props.updateParagraph(paragraph);
  }

  deleteoption = (paragraph, branch_index, option_index) => {
    const options = [...paragraph.selections[branch_index].conditions];
    options.splice(option_index, 1);
    if (options.length > 0) {
      paragraph.selections[branch_index].conditions = options;
    } else {
      if (paragraph.type === 'Branch') {
        delete paragraph.selections[branch_index].show_type;
        delete paragraph.selections[branch_index].operator;
        delete paragraph.selections[branch_index].conditions;
      }
    }
    this.props.updateParagraph(paragraph);
  }

  toggleoption = (paragraph, branch_index) => {
    const showoptions = this.state.showoptions;
    if (showoptions != null) {
      const options = [...showoptions];
      options[branch_index] = !options[branch_index];
      this.setState({ showoptions: options });
    } else {
      const options = [];
      for (let i = 0; i < paragraph.selections.length; i++) {
        if (i === branch_index) {
          options.push(false);
        } else {
          options.push(true);
        }
      }
      this.setState({ showoptions: options });
    }
  }

  changeoptionkey = (e, paragraph, branch_index, option_index) => {
    paragraph.selections[branch_index].conditions[option_index].key = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changeoptionoperator = (e, paragraph, branch_index, option_index) => {
    paragraph.selections[branch_index].conditions[option_index].operator = e.target.value;
    this.props.updateParagraph(paragraph);
  }

  changeoptionvalue = (e, paragraph, branch_index, option_index) => {
    paragraph.selections[branch_index].conditions[option_index].value = e.target.value.replace(/[^- 0-9]/g, '');
    this.props.updateParagraph(paragraph);
  }

  // buildpreview = () => {
  //   const { video, preview } = this.refs;
  //   const ctx = preview.getContext('2d');
  //   ctx.drawImage(video, 0, 0, preview.width, preview.height);
  //   const dataURL = preview.toDataURL('image/jpg');
  //   const arr = dataURL.split(',');
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   const u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   const file = new File([u8arr], 'preview.jpg', { type: mime });
  // }

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

  rendercommentbox = (currentparagraph) => {
    const { comments } = this.props;
    const { preview, showcomment } = this.state;
    let comment = null;
    if ((currentparagraph.type !== 'End' && currentparagraph.type !== 'Node' && showcomment && comments) || ((currentparagraph.type === 'End' || currentparagraph.type === 'Node') && showcomment && comments && !preview)) {
      comment = comments.content.find(c => c.id === currentparagraph.id && !c.extra_uuid);
    }
    if (comment) {
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

  rendertoolbox = (currentparagraph) => {
    const rolelist = this.props.content.roles.map((item) => {
      return <option key={item.name} value={item.name}>{item.name}</option>
    })
    const gallarylist = this.props.content.galleries.map((item) => {
      return <option key={item.id} value={item.title}>{item.title}</option>
    })
    switch (this.state.toolbox) {
      case 'addtext':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入对白</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <textarea className="form-control" cols="30" rows="10" maxLength="200" value={this.state.addtxt.text} onChange={this.changeaddtxttext}></textarea>
                      <p className="table-alert">对白内容最多200字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addimg':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入图片</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>回忆收集：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收集">不收集</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>图片：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg} src={this.state.addtxt.img} filetype="img1"></FileUpload>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addaudio':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入语音</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>回忆收集：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收集">不收集</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>语音：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg} src={this.state.addtxt.img} filetype="audio"></FileUpload>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addvideo':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入视频</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="旁白">旁白</option>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>回忆收集：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.galleries} onChange={this.changeaddtxtgallery}>
                        <option value="不收集">不收集</option>
                        {gallarylist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>简介：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.text} onChange={this.changeaddtxttext} />
                    </td>
                  </tr>
                  <tr>
                    <td>视频封面：</td>
                    <td>
                      视频>
                      <FileUpload getuploadurl={this.changeaddtxtvideo} src={this.state.addtxt.video} filetype="video"></FileUpload>
                      封面>
                      <FileUpload getuploadurl={this.changeaddtxtpreview} src={this.state.addtxt.preview} filetype="img2"></FileUpload>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addlink':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入链接</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        <option value="我">我</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>标题：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.title} onChange={this.changeaddtxttitle} />
                    </td>
                  </tr>
                  <tr>
                    <td>简介：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.text} onChange={this.changeaddtxttext} />
                    </td>
                  </tr>
                  <tr>
                    <td>链接：</td>
                    <td>
                      <input className="form-control" type="text" value={this.state.addtxt.url} onChange={this.changeaddtxturl} />
                    </td>
                  </tr>
                  <tr>
                    <td>预览图：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeaddtxtimg} src={this.state.addtxt.img} filetype="img1"></FileUpload>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      case 'addbusy':
        return (
          <div className="toolbox">
            <div className="toolbox-content">
              <div className="toolbox-title">插入忙碌</div>
              <table>
                <tbody>
                  <tr>
                    <td>角色：</td>
                    <td>
                      <select className="form-control" value={this.state.addtxt.role} onChange={this.changeaddtxtrole}>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>提示内容：</td>
                    <td>
                      <textarea className="form-control" cols="24" rows="2" maxLength="15" value={this.state.addtxt.text} onChange={this.changeaddtxttext} ></textarea>
                      <p className="table-alert">不得超过15字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="toolbox-footer">
                <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
                <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
              </div>
            </div>
          </div>
        );

      // case 'addpreview':
      //   return (
      //     <div className="toolbox">
      //       <div className="toolbox-content">
      //         <div className="toolbox-title">选择预览图</div>
      //         <div className="previewbox">
      //           <video ref="video" width={parseInt(this.state.addtxt.video.split('_')[1], 10) / 4 + 'px'} height={parseInt(this.state.addtxt.video.split('_')[2], 10) / 4 + 'px'} crossorigin="anonymous" src={this.state.addtxt.video} controls={true}></video>
      //           <canvas ref="preview" width={parseInt(this.state.addtxt.video.split('_')[1], 10) / 4} height={parseInt(this.state.addtxt.video.split('_')[2], 10) / 4}></canvas>
      //           <div className="btn-green-s" onClick={this.buildpreview}>生成预览图</div>
      //         </div>
      //         <div className="toolbox-footer">
      //           <div className="confirm-yes" onClick={() => this.toaddtxt(currentparagraph)}>确定</div>
      //           <div className="confirm-no" onClick={() => this.changetoolbox('none')}>取消</div>
      //         </div>
      //       </div>
      //     </div>
      //   );

      default:
        return null;
    }
  }

  rendereditor = () => {
    let currentparagraph = null;
    const content = this.props.content;
    for (let i = 0; i < content.paragraphs.length; i++) {
      if (content.paragraphs[i].id === this.props.selected_paragraph_id) {
        currentparagraph = content.paragraphs[i];
        break;
      }
    }
    const rolelist = this.props.content.roles.map((item) => {
      return <option key={item.name} value={item.id}>{item.name}</option>
    });
    if (!currentparagraph) {
      return null;
    } else {
      let lineno = null;
      switch (currentparagraph.type) {
        case 'Node': {
          lineno = this.renderlinno(currentparagraph);
          return (
            <div className="paragrapheditor" style={{ width: this.state.width }} >
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-1">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>段落备注：</td>
                    <td><input className="form-control" maxLength="30" style={{ width: '320px' }} value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} /></td>
                  </tr>
                </tbody>
              </table>
              <div className="toolicons">
                <span className="toolicon fa fa-arrows-h" title="扩展" onClick={this.changewidth}></span>
                <span className="toolicon fa fa-user" title="插入用户昵称" onClick={() => this.toaddusername(currentparagraph)}></span>
                <span className="toolicon fa fa-commenting" title="插入对白" onClick={() => this.changetoolbox('addtext', currentparagraph.id)}></span>
                <span className="toolicon fa fa-image" title="插入图片" onClick={() => this.changetoolbox('addimg', currentparagraph.id)}></span>
                <span className="toolicon fa fa-microphone" title="插入语音" onClick={() => this.changetoolbox('addaudio', currentparagraph.id)}></span>
                <span className="toolicon fa fa-film" title="插入视频" onClick={() => this.changetoolbox('addvideo', currentparagraph.id)}></span>
                <span className="toolicon fa fa-link" title="插入链接" onClick={() => this.changetoolbox('addlink', currentparagraph.id)}></span>
                <span className="toolicon fa fa-clock-o" title="插入忙碌" onClick={() => this.changetoolbox('addbusy', currentparagraph.id, currentparagraph.chat_id)}></span>
                <span className="toolicon fa fa-eye" title="预览" onClick={this.togglepreview}></span>
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <div className="txteditor">
                <div style={{ height: lineno.h + 'px' }} className="lineno">{lineno.lineno}</div>
                <pre className="placeholder">{currentparagraph.text === '' && currentparagraph.id === 1 ? this.state.placeholder : ''}</pre>
                <textarea ref="texteditor" onDrop={(e) => this.dropFile(e, currentparagraph)} style={{ height: lineno.h + 'px' }} value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
              </div>
              {this.state.preview ? <Preview move={this.state.move}></Preview> : null}
              {this.rendercommentbox(currentparagraph)}
              {this.rendertoolbox(currentparagraph)}
            </div>
          )
        }
        case 'Branch': {
          const branchs = currentparagraph.selections.map((item, key) => {
            const showoption = (this.state.showoptions === null || this.state.showoptions[key]);
            if (item.show_type) {
              const numbers = this.props.content.numbers;
              let nums = {};
              Object.keys(numbers).forEach(n => {
                nums = Object.assign(nums, numbers[n].nums);
              });
              const numberitems = Object.keys(nums).map((n, k) => {
                return (
                  <option value={n} key={k}>{n}</option>
                );
              });
              const options = item.conditions.map((option, okey) => {
                return (
                  <div className="option" key={okey}>条件{okey + 1}：
                    <select className="form-control" value={option.key} onChange={(e) => this.changeoptionkey(e, currentparagraph, key, okey)}>
                      <option value="">请选择</option>
                      {numberitems}
                    </select>
                    <select className="form-control small" value={option.operator} onChange={(e) => this.changeoptionoperator(e, currentparagraph, key, okey)}>
                      <option value=">">{'>'}</option>
                      <option value="<">{'<'}</option>
                      <option value=">=">{'≥'}</option>
                      <option value="<=">{'≤'}</option>
                      <option value="=">{'='}</option>
                      <option value="!=">{'≠'}</option>
                    </select>
                    <input type="text" className="form-control small" value={option.value} onChange={(e) => this.changeoptionvalue(e, currentparagraph, key, okey)} />
                    <span className="fa fa-trash-o deleteoption" onClick={() => { this.deleteoption(currentparagraph, key, okey) }} title="删除条件"></span>
                  </div>
                )
              });
              return (
                <tr key={key}>
                  <td>选项内容{key + 1}：</td>
                  <td>
                    <div className="selction">
                      <input className="form-control" maxLength="15" type="text" value={item.title} onBlur={() => this.initselectiontitle(currentparagraph, key)} onFocus={() => this.initselectiontitle(currentparagraph, key)} onChange={(e) => this.changeselectiontitle(e, currentparagraph, key)} />
                      {showoption ?
                        <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-up"></i>条件设置</b> :
                        <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-down"></i>条件设置</b>}
                    </div>
                    {showoption ?
                      <div className="options">
                        <div className="option">当
                          <select className="form-control" value={item.operator} onChange={(e) => this.changeselectionoperator(e, currentparagraph, key)}>
                            <option value="&">满足所有</option>
                            <option value="|">满足其一</option>
                          </select>时，选项
                          <select className="form-control small" value={item.show_type} onChange={(e) => this.changeselectionshow_type(e, currentparagraph, key)}>
                            <option value="???">问号</option>
                            <option value="hide">隐藏</option>
                          </select>
                        </div>
                        {options}
                        <div className="addoption" onClick={() => this.addoption(currentparagraph, key)}>+添加条件</div>
                        <div className="option">当不满足上述条件时，选项正常显示。</div>
                      </div> : null}
                  </td>
                </tr>
              )
            } else {
              return (
                <tr key={key}>
                  <td>选项内容{key + 1}：</td>
                  <td>
                    <div className="selction">
                      <input className="form-control" maxLength="15" type="text" value={item.title} onBlur={() => this.initselectiontitle(currentparagraph, key)} onFocus={() => this.initselectiontitle(currentparagraph, key)} onChange={(e) => this.changeselectiontitle(e, currentparagraph, key)} />
                      {showoption ?
                        <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-up"></i>条件设置</b> :
                        <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-down"></i>条件设置</b>}
                    </div>
                    {showoption ?
                      <div className="options">
                        <div className="addoption" onClick={() => this.addoption(currentparagraph, key)}>+添加条件</div>
                      </div> : null}
                  </td>
                </tr>
              )
            }
          });
          return (
            <div className="paragrapheditor-selection">
              <div className="toolicons">
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <div className="selectionbox">
                <table>
                  <tbody>
                    <tr>
                      <td>联系人：</td>
                      <td>
                        <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                          <option value="-2">请选聊天对象</option>
                          {rolelist}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>分支类型：</td>
                      <td>
                        <select className="form-control" value={currentparagraph.type} onChange={(e) => this.changebranchtype(currentparagraph)}>
                          <option value="Branch">普通分支</option>
                          <option value="NumberBranch">数值分支</option>
                        </select>
                      </td>
                    </tr>
                    {branchs}
                    <tr>
                      <td></td>
                      <td><div className="table-alert">选项内容最多15字</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {this.rendercommentbox(currentparagraph)}
            </div>
          )
        }
        case 'NumberBranch': {
          const branchs = currentparagraph.selections.map((item, key) => {
            const showoption = (this.state.showoptions === null || this.state.showoptions[key]);
            const numbers = this.props.content.numbers;
            let nums = {};
            Object.keys(numbers).forEach(n => {
              nums = Object.assign(nums, numbers[n].nums);
            });
            const numberitems = Object.keys(nums).map((n, k) => {
              return (
                <option value={n} key={k}>{n}</option>
              );
            });
            const options = item.conditions.map((option, okey) => {
              return (
                <div className="option" key={okey}>条件{okey + 1}：
                  <select className="form-control" value={option.key} onChange={(e) => this.changeoptionkey(e, currentparagraph, key, okey)}>
                    <option value="">请选择</option>
                    {numberitems}
                  </select>
                  <select className="form-control small" value={option.operator} onChange={(e) => this.changeoptionoperator(e, currentparagraph, key, okey)}>
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'≥'}</option>
                    <option value="<=">{'≤'}</option>
                    <option value="=">{'='}</option>
                    <option value="!=">{'≠'}</option>
                  </select>
                  <input type="text" className="form-control small" value={option.value} onChange={(e) => this.changeoptionvalue(e, currentparagraph, key, okey)} />
                  {item.conditions.length > 1 ? <span className="fa fa-trash-o deleteoption" onClick={() => { this.deleteoption(currentparagraph, key, okey) }} title="删除条件"></span> : null}
                </div>
              )
            });
            return (
              <tr key={key}>
                <td>数值选项{key + 1}：</td>
                <td>
                  {/* <div className="selction">
                    {showoption ?
                      <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-up"></i>条件设置</b> :
                      <b onClick={() => { this.toggleoption(currentparagraph, key) }}><i className="fa fa-chevron-down"></i>条件设置</b>}
                  </div> */}
                  {showoption ?
                    <div className="options">
                      <div className="option">
                        <select className="form-control" value={item.operator} onChange={(e) => this.changeselectionoperator(e, currentparagraph, key)}>
                          <option value="&">满足所有</option>
                          <option value="|">满足其一</option>
                        </select>
                      </div>
                      {options}
                      <div className="addoption" onClick={() => this.addoption(currentparagraph, key)}>+添加条件</div>
                    </div> : null}
                </td>
              </tr>
            )
          });
          return (
            <div className="paragrapheditor-selection">
              <div className="toolicons">
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <div className="selectionbox">
                <table>
                  <tbody>
                    <tr>
                      <td>联系人：</td>
                      <td>
                        <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                          <option value="-2">请选聊天对象</option>
                          {rolelist}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>分支类型：</td>
                      <td>
                        <select className="form-control" value={currentparagraph.type} onChange={(e) => this.changebranchtype(currentparagraph)}>
                          <option value="Branch">普通分支</option>
                          <option value="NumberBranch">数值分支</option>
                        </select>
                      </td>
                    </tr>
                    {branchs}
                  </tbody>
                </table>
              </div>
              {this.rendercommentbox(currentparagraph)}
            </div>
          )
        }
        case 'End': {
          const gallerylist = this.props.content.galleries.map((item) => {
            return <option key={item.id} value={item.id}>{item.title}</option>
          });
          return (
            <div className="paragrapheditor-end">
              <div className="toolicons">
                <span className="toolicon fa fa-eye" title="预览" onClick={this.togglepreview}></span>
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>结局名称：</td>
                    <td>
                      <input className="form-control" type="text" maxLength="10" value={currentparagraph.title} onBlur={() => this.inittitle(currentparagraph)} onFocus={() => this.inittitle(currentparagraph)} onChange={(e) => this.changetitle(e, currentparagraph)} />
                    </td>
                  </tr>
                  <tr>
                    <td>回忆收集：</td>
                    <td>
                      <select className="form-control " value={currentparagraph.gallery_id} onChange={(e) => this.changeendgalleryid(e, currentparagraph)}>
                        <option value="-1">不收集</option>
                        {gallerylist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>结局描述：</td>
                    <td>
                      <textarea className="form-control" cols="40" rows="10" maxLength="145" value={currentparagraph.text} onFocus={() => this.initendtext(currentparagraph)} onBlur={() => this.initendtext(currentparagraph)} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
                      <p>结局描述最多145字，行数不得超过10行</p>
                    </td>
                  </tr>
                  <tr>
                    <td>背景图片：</td>
                    <td>
                      <FileUpload getuploadurl={this.changeendimg} src={currentparagraph.image} filetype="img2"></FileUpload>
                      <p>不上传则使用默认背景图</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              {this.state.preview ? <Preview></Preview> : null}
              {this.rendercommentbox(currentparagraph)}
            </div>
          )
        }
        case 'Lock': {
          return (
            <div className="paragrapheditor-lock">
              <div className="toolicons">
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>解锁方式：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.pay_type} onChange={(e) => this.changepaytype(e, currentparagraph)}>
                        <option value="WaitOrPay">付费或等待</option>
                        <option value="PayOnly">仅付费</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>消耗扑通币：</td>
                    <td>
                      <input className="form-control " maxLength="8" value={currentparagraph.coin} onBlur={(e) => this.initcoin(e, currentparagraph)} onChange={(e) => this.changecoin(e, currentparagraph)} />
                      <p className="table-alert">1扑通币对应等待时间10分钟</p>
                    </td>
                  </tr>
                  <tr>
                    <td>剧情锁描述：</td>
                    <td>
                      <textarea className="form-control" cols="30" rows="10" value={currentparagraph.text} onChange={(e) => this.changetext(e, currentparagraph)}></textarea>
                      <p className="table-alert">剧情锁描述最多300字</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              {this.rendercommentbox(currentparagraph)}
            </div>
          )
        }
        case 'GoOn': {
          return (
            <div className="paragrapheditor-goon">
              <div className="toolicons">
                <span className="toolicon fa fa-edit" title="查看批注" onClick={() => this.togglecomment(currentparagraph.id)} ></span>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>联系人：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.chat_id} onChange={(e) => this.changechatid(e, currentparagraph)}>
                        <option value="-2">请选聊天对象</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>后续剧情：</td>
                    <td>
                      <select className="form-control" value={currentparagraph.show_type} onChange={(e) => this.changeshowtype(e, currentparagraph)}>
                        <option value="Off">隐藏</option>
                        <option value="On">显示</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              {this.rendercommentbox(currentparagraph)}
            </div>
          )
        }
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
    content: state.editor.content,
    selected_paragraph_id: state.editor.selected_paragraph_id,
    errors: state.editor.errors.filter(error => !error.extra.extra_uuid),
    comments: state.editor.comments,
    search_lineno: state.editor.search_lineno,
    idols: state.idols.list,
    outline: state.editor.outline,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file, filetype, callback) => dispatch({ type: 'UPLOAD_FILE', file, filetype, callback }),
    updateParagraph: (paragraph) => dispatch({ type: 'UPDATE_PARAGRAPH', paragraph }),
    setAppMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParagraphEditor);


// WEBPACK FOOTER //
// ./src/Author/components/ParagraphEditor.js
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Row, Col,Input} from 'antd';

import marked from 'marked'
import hljs from 'highlight.js';

import {getHtml, OldTime} from '../../until';
import {markdownConfig} from "../../config/markdown";
// import './index.less';

const { TextArea } = Input;

const {options,config} = markdownConfig
hljs.configure(config)
marked.setOptions({
  highlight: (code) => hljs.highlightAuto(code).value,
  ...options
});

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewContent: '',
      aceBoxH: null,
      originContent: '',
      inputValue:'',
    }

    this.cacheValue()
    this.containerScroll = this.containerScroll.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }

  componentWillMount() {
    const {editCont = '', createTime = ''} = this.props;
    let decodeOrigin;
    try {
      decodeOrigin = getHtml(decodeURIComponent(editCont))
    } catch (err) {
      decodeOrigin = editCont
    }
    let markedContent = marked(decodeOrigin);
    this.setState({
      previewContent: markedContent,
      originContent: decodeOrigin,
    })
  }

  componentDidMount() {
    this.setState({
      aceBoxH: document.documentElement.clientHeight - document.querySelector('.editor-main-a').offsetHeight + 'px'
    })
  }
  cacheValue() {
    this.currentTabIndex = 1
    this.hasContentChanged = false
    this.scale = 1
  }

  setCurrentIndex(index) {
    this.currentTabIndex = index
  }

  containerScroll(e) {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop = this.editContainer.scrollTop * this.scale
    } else {
      this.editContainer.scrollTop = this.previewContainer.scrollTop / this.scale
    }
  }

  onContentChange(e) {
    let innerText = e.target.innerText;
    innerText=innerText.replace(/script>/img,'script\\>')
    let markCont = marked(innerText)
    const {handleChangeMarkEdit} = this.props;
    handleChangeMarkEdit(innerText)
    this.setState({
      previewContent: markCont
    })
    !this.hasContentChanged && (this.hasContentChanged = true)
  }

  onOldArticleContentChange(e) {
    const {handleChangeMarkEdit} = this.props;
    handleChangeMarkEdit(e.target.innerHTML)
  }

  setScrollValue() {
    // 设置值，方便 scrollBy 操作
    this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
    this.hasContentChanged = false
  }
  onPaste(e){

  }

  render() {

    let {aceBoxH, previewContent, originContent} = this.state;
    const {createTime = '',id=''} = this.props;

    return (
      <div>

        <div className="editor-main-a" style={{height: aceBoxH}}
             key='main'>
          <Row>
            {
              createTime > OldTime || createTime === '' || id===1?
                <div>
                  <Col span={12}>
                    <div style={{height: aceBoxH}}>
                      <div className="  content-edit" onMouseOver={this.setCurrentIndex.bind(this, 1)}
                           onScroll={this.containerScroll} ref={node => this.editContainer = node}>
                        <div contentEditable="plaintext-only"
                             className="common-wrapper " onInput={this.onContentChange}
                             onPaste={this.onPaste}
                             ref={node => this.editWrap = node}>
                          {originContent}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <div className="markdown-style  content-edit"
                           ref={node => this.previewContainer = node}
                           onMouseOver={this.setCurrentIndex.bind(this, 2)} onScroll={this.containerScroll}>
                        <div className=" common-wrapper" ref={node => this.previewWrap = node}
                             dangerouslySetInnerHTML={{__html: previewContent}}></div>
                      </div>
                    </div>
                  </Col>
                </div>
                :
                <div>
                  <Col span={24}>
                  <div className="  content-edit">
                    <div className=" common-wrapper"
                         contentEditable="plaintext-only"
                         onInput={this.onOldArticleContentChange.bind(this)}
                         dangerouslySetInnerHTML={{__html: originContent}}></div>
                  </div>
                </Col>
                </div>
            }
          </Row>

        </div>
        <style jsx>{`
        .content-edit{
          max-height:600px;
          height:600px;
          overflow-y:auto;
          border: 1px solid #ddd;
          border-top:none;
          background-color: #fff;
        }
.editor-main-a  .common-wrapper {
  padding: 20px;
  min-height: 100%;
  outline: none;
}
        `}</style>
      </div>

    );
  }

}

export default connect()(Edit);

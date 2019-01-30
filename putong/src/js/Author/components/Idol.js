import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultimg from '../../images/default.png';
import '../css/Idol.css';

class Idol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultimg: defaultimg
    };
  }

  deleteIdol = (id) => {
    this.props.deleteIdolConfirm('删除剧本将彻底销毁剧本所有内容且无法恢复，你确定要这么做吗？', { type: 'DELETE_IDOL', id: id });
  }

  render() {
    const idol = this.props.idolitem;
    return (
      <div className="list-row">
        <div className="flex-2">
          <img className="project_pic" src={idol.image === '' ? this.state.defaultimg : idol.image + '?imageView2/1/w/400/q/85!'} alt="封面" />
        </div>
        <div className="flex-2">{idol.name}</div>
        <div className="flex-5"><p>{idol.text}</p></div>
        <div className="flex-1">{idol.online_status === 0 ? '未上架' : '已上架'}</div>
        <div className="flex-4">
          <div className="btn-blue-s btn-editor" onClick={() => this.props.readIdol(idol.id)}>查看</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readIdol: (id) => dispatch({ type: 'REQUEST_IDOL', id }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Idol);


// WEBPACK FOOTER //
// ./src/Author/components/Idol.js
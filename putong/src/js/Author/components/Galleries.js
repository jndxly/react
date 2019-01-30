import React, { Component } from 'react';
import { connect } from 'react-redux';
import noneimg from '../../images/none.jpg';
import '../css/Galleries.css';

class Galleries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleries: this.props.content.galleries.map(g => ({ ...g })),
    };
  }

  newgallerygroup = () => {
    let galleries = [...this.state.galleries];
    const id = galleries.length > 0 ? (Math.max.apply(Math, galleries.map((item) => { return item.id })) + 1) : 1;
    const newgallery = { id: id, title: '未命名分组', items: [] };
    galleries.push(newgallery);
    this.setState({ galleries });
  }

  changegallerytitle = (e, id) => {
    let galleries = [...this.state.galleries];
    const issamed = galleries.find(g => g.title === e.target.value);
    if (issamed) {
      this.props.setAppMsg('回忆名称不可重复！');
      for (let i = 0; i < galleries.length; i++) {
        if (galleries[i].id === id) {
          galleries[i].title = '';
        }
      }
      this.setState({ galleries });
    } else {
      for (let i = 0; i < galleries.length; i++) {
        if (galleries[i].id === id) {
          galleries[i].title = e.target.value;
        }
      }
      this.setState({ galleries });
    }
  }

  initgallerytitle = (e, id) => {
    let galleries = [...this.state.galleries];
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].id === id) {
        if (galleries[i].title === '未命名分组') {
          galleries[i].title = '';
        } else if (galleries[i].title === '') {
          galleries[i].title = '未命名分组';
        }
      }
    }
    this.setState({ galleries });
  }

  deletegallery = (id) => {
    let galleries = [...this.state.galleries];
    for (let i = 0; i < galleries.length; i++) {
      if (galleries[i].id === id) {
        galleries.splice(i, 1);
        break;
      }
    }
    this.setState({ galleries });
  }

  savechange = () => {
    let content = { ...this.props.content };
    content.galleries = [...this.state.galleries];
    const notnamed = content.galleries.find(g => g.title === '未命名分组');
    if (notnamed) {
      this.props.setAppMsg('error', '存在未命名分组！');
    } else {
      this.props.deleteGalleryConfirm('修改回忆分组可能会导致剧本中回忆分组引用错误，确定修改吗？', { type: 'SAVE_PROJECT_CONTENT', content: content });
    }
  }

  render() {
    if (this.state.galleries.length === 0) {
      return (
        <div className="galleries-none">
          <img className="none-img" src={noneimg} alt="" />
          <p className="none-txt">作品暂无任何回忆分组</p>
          <div>
            <div className="btn-blue-s" onClick={this.newgallerygroup}>新 建</div>
            <div className="btn-green-s" onClick={this.savechange}>保 存</div>
          </div>
        </div>
      );
    } else {
      const gallerylist = this.state.galleries.map((item, key) => {
        return (
          <tr key={key}>
            <td>{"回忆分组" + (key + 1)}</td>
            <td><input className="form-control" type="text" maxLength="7" value={item.title} onChange={(e) => this.changegallerytitle(e, item.id)} onFocus={(e) => this.initgallerytitle(e, item.id)} onBlur={(e) => this.initgallerytitle(e, item.id)} /></td>
            <td><span className="fa fa-minus-square delete-item" onClick={() => this.deletegallery(item.id)}></span></td>
          </tr>
        );
      });
      return (
        <div className="galleries">
          <table>
            <tbody>
              {gallerylist}
              <tr>
                <td></td>
                <td><span className="fa fa-plus-square add-item" onClick={this.newgallerygroup}></span></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td><p className="table-alert">回忆分组名最多7个字</p></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className="btn-green-s savechange" onClick={this.savechange}>保 存</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteGalleryConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
    setAppMsg: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Galleries);


// WEBPACK FOOTER //
// ./src/Author/components/Galleries.js
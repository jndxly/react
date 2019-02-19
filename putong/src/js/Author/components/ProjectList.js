import React, { Component } from 'react';
import { connect } from 'react-redux';
import Project from './Project';
import noneimg from '../../images/none.jpg';
import '../css/ProjectList.css';

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCapacity: 5,
      wantPage: "",
    };
  }

  componentDidMount() {
    this.props.requestProjects();
  }

  calculatePageIndex(index) {
    const pageCapacity = this.state.pageCapacity;
    const total = Math.ceil(this.props.list.length / pageCapacity);

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

  changewantpage = (e) => {
    this.setState({ wantPage: e.target.value.replace(/\D/g, '') });
  }

  pageUp = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex - 1),
    }));
  };

  pageDown = () => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(this.state.pageIndex + 1),
    }));
  };

  pageTo = (index) => {
    this.setState(prev => ({
      ...prev,
      pageIndex: this.calculatePageIndex(index),
    }));
  };

  pageTowantpage = () => {
    if (this.state.wantPage !== '') {
      const pageCapacity = this.state.pageCapacity;
      const total = Math.ceil(this.props.list.length / pageCapacity);
      if (parseInt(this.state.wantPage, 10) > total) {
        this.setState({ pageIndex: total - 1, wantPage: '' });
      } else {
        this.setState({ pageIndex: parseInt(this.state.wantPage, 10) - 1, wantPage: '' });
      }
    }
  }

  tonewproject = () => {
    const update_time = new Date().getTime();
    const outline = {
      id: 0,
      title: '',
      text: '',
      image: '',
      sketch: '',
      video: '',
      tags: [],
      idols: [],
      character_count: 0,
      update_time: update_time,
      status: 0
    };
    const content = {
      galleries: [
        { id: 1, title: '图片', items: [] },
        { id: 2, title: '视频', items: [] },
        { id: 3, title: '结局', items: [] }
      ],
      roles: [],
      paragraphs: [{
        id: 1,
        type: 'Node',
        title: '1',
        chat_id: 1,
        text: '',
        next_id: -1
      }],
      numbers: [
        {
          id: 1,
          title: '好感度',
          number: 0,
        }
      ],
      extras: []
    };
    this.props.updateProjectOutline(outline);
    this.props.updateProjectContent(content);
    this.props.setRouter('Home-Newproject');
  };


  renderList() {
    const { list } = this.props;
    const { pageIndex, pageCapacity } = this.state;

    if (list.length === 0) {
      return <div className='isnull'>暂无剧本</div>;
    }
    else {
      return list.slice(pageIndex * pageCapacity, (pageIndex + 1) * pageCapacity).map((item, index) => {
        return <Project projectitem={item} key={item.id} />;
      });
    }
  }

  renderPageButtons() {
    const { pageIndex, pageCapacity } = this.state;
    const { list } = this.props;
    const total = Math.ceil(list.length / pageCapacity);
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
        onClick={() => this.pageTo(i)}>{i + 1}</div>);
    }

    return buttons;
  }

  renderPageMenu() {
    return (
      <div className='pagination'>
        <div className='fa fa-arrow-left pageup' onClick={this.pageUp}></div>
        {this.renderPageButtons()}
        <div className='fa fa-arrow-right pagedown' onClick={this.pageDown}></div>
        <div className="pageto"><span>跳转到</span><input type="text" value={this.state.wantPage} onChange={this.changewantpage} /><div className="btn-blue-s" onClick={this.pageTowantpage}>确定</div></div>
      </div>
    );
  }

  render() {
    const projects = this.props.list;
    if (projects.length > 0) {
      return (
        <div className="projectlist">
          <div className="controls">
            <div className="total">当前作品总数<b>{projects.length}</b>本</div>
            <div className="btn-green-m tonewproject" onClick={this.tonewproject}>创建作品</div>
          </div>
          <div className='list'>
            <div className='list-title'>
              <div className='flex-2'>封面</div>
              <div className='flex-3'>作品名</div>
              <div className='flex-3'>标签</div>
              <div className='flex-1'>字数</div>
              {/*<div className='flex-1'>签约</div>*/}
              {/*<div className='flex-1'>上架</div>*/}
              {/*<div className='flex-1'>审核</div>*/}
              <div className='flex-3'>操作</div>
            </div>
            {this.renderList()}
            {this.renderPageMenu()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="projectlist">
          <div className="list-none">
            <img className="none-img" src={noneimg} alt="" />
            <p className="none-txt">你还没有任何作品</p>
            <div className="btn-green-m tonewproject-none" onClick={this.tonewproject}>创建作品</div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({ list: state.projects.list });

const mapDispatchToProps = (dispatch) => ({
  requestProjects: () => dispatch({ type: 'REQUEST_PROJECTS' }),
  updateProjectOutline: (outline) => dispatch({ type: 'UPDATE_PROJECT_OUTLINE', outline: outline }),
  updateProjectContent: (content) => dispatch({ type: 'UPDATE_PROJECT_CONTENT', content }),
  setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);



// WEBPACK FOOTER //
// ./src/Author/components/ProjectList.js
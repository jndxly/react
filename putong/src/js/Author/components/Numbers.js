import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Numbers.css';

class Numbers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentgroup: '系统',
      currentnum: null,
      title: '',
      type: '',
      value: 0,
      show_name: '',
      role_id: -1,
      editortype: 0,
      editorbox: null
    };
  }

  changetitle = (e) => {
    this.setState({ title: e.target.value });
  }

  changetype = (e) => {
    this.setState({ type: e.target.value });
  }

  changevalue = (e) => {
    this.setState({ value: e.target.value.replace(/[^- 0-9]/, '') });
  }

  changerole = (e) => {
    this.setState({ role_id: parseInt(e.target.value, 10) });
  }

  changeshowname = (e) => {
    this.setState({ show_name: e.target.value });
  }

  updategroup = () => {
    let content = { ...this.props.content };
    let numbers = { ...content.numbers };
    const { currentgroup, editortype, title, type } = this.state;
    if (!numbers[title]) {
      if (editortype === 0) {
        numbers[title] = { type, nums: {} };
      } else {
        if (title === currentgroup) {
          numbers[title] = { ...numbers[title], type };
        } else {
          numbers[title] = { ...numbers[currentgroup], title, type };
          delete numbers[currentgroup];
        }
      }
      content.numbers = numbers;
      this.props.saveProjectContent(content);
      this.setState({ currentgroup: title, title: '', type: '', show_name: '', role_id: -1, value: 0, editorbox: null });
    } else {
      this.props.setAppMessage('error', '分组名称不能重复！');
    }
  }

  updatenum = () => {
    const { currentgroup, currentnum, editortype, title, role_id, type, show_name, value } = this.state;
    let content = { ...this.props.content };
    let numbers = { ...content.numbers };
    let hasnum = false;
    Object.keys(numbers).forEach(g => {
      if (editortype === 0) {
        if (numbers[g].nums[title] !== undefined) {
          hasnum = true;
        }
      } else {
        if (g === currentgroup) {
          if (numbers[g].nums[title] !== undefined && title !== currentnum) {
            hasnum = true;
          }
        } else {
          if (numbers[g].nums[title]) {
            hasnum = true;
          }
        }
      }

    });
    if (!hasnum) {
      if (!isNaN(parseInt(value, 10))) {
        if (editortype === 0) {
          if (numbers[currentgroup].type === 'favor') {
            numbers[currentgroup].nums[title] = { type, value: parseInt(value, 10), show_name, role_id }
          } else {
            numbers[currentgroup].nums[title] = { type, value: parseInt(value, 10), show_name }
          }
        } else {
          if (title === currentnum) {
            if (numbers[currentgroup].type === 'favor') {
              numbers[currentgroup].nums[title] = { ...numbers[currentgroup].nums[title], type, show_name, value: parseInt(value, 10), role_id };
            } else {
              numbers[currentgroup].nums[title] = { ...numbers[currentgroup].nums[title], type, show_name, value: parseInt(value, 10) };
            }
          } else {
            if (numbers[currentgroup].type === 'favor') {
              numbers[currentgroup].nums[title] = { ...numbers[currentgroup].nums[title], type, show_name, value: parseInt(value, 10), role_id };
              delete numbers[currentgroup].nums[currentnum];
            } else {
              numbers[currentgroup].nums[title] = { ...numbers[currentgroup].nums[title], type, show_name, value: parseInt(value, 10) };
              delete numbers[currentgroup].nums[currentnum];
            }
          }
        }
        content.numbers = numbers;
        this.props.saveProjectContent(content);
        this.setState({ currentnum: null, title: '', type: '', show_name: '', role_id: -1, value: 0, editorbox: null });
      } else {
        this.props.setAppMessage('error', '数值初始值只能为整数！');
      }
    } else {
      this.props.setAppMessage('error', '所有数值名称不能重复！');
    }
  }

  changecurrentgroup = (group) => {
    this.setState({ currentgroup: group });
  }

  quit = () => {
    this.setState({ currentnum: null, title: '', type: '', role_id: -1, value: 0, show_name: '', editorbox: null });
  }

  tonewgroup = () => {
    this.setState({ title: '', type: 'property', editorbox: 'group', editortype: 0 });
  }

  toeditgroup = (e, title) => {
    e.stopPropagation();
    let numbers = { ...this.props.content.numbers };
    const group = numbers[title];
    this.setState({ title, currentgroup: title, type: group.type, editorbox: 'group', editortype: 1 });
  }

  tonewnum = () => {
    let numbers = { ...this.props.content.numbers };
    const currentgroup = this.state.currentgroup;
    const group = numbers[currentgroup];
    if (group.type === 'favor') {
      if (Object.keys(group.nums).length > 0) {
        this.props.setAppMessage('error', '好感分组只能添加1个数值！');
      } else {
        this.setState({ title: '', type: 'normal', currentnum: null, role_id: -1, editorbox: 'num', editortype: 0 });
      }
    } else {
      if (group.type === 'property') {
        if (Object.keys(group.nums).length >= 8) {
          this.props.setAppMessage('error', '属性分组最多添加8个数值！');
        } else {
          this.setState({ title: '', type: 'normal', currentnum: null, editorbox: 'num', editortype: 0 });
        }
      } else {
        this.setState({ title: '', type: 'normal', currentnum: null, editorbox: 'num', editortype: 0 });
      }
    }
  }

  toeditnum = (title) => {
    let numbers = { ...this.props.content.numbers };
    const currentgroup = this.state.currentgroup;
    const group = numbers[currentgroup];
    const num = group.nums[title];
    this.setState({ title, currentnum: title, type: num.type, value: num.value, show_name: num.show_name, role_id: num.role_id, editorbox: 'num', editortype: 1 });
  }

  deletegroup = (e, title) => {
    e.stopPropagation();
    let content = { ...this.props.content };
    let numbers = { ...content.numbers };
    delete numbers[title];
    content.numbers = numbers;
    this.props.setAppConfirm('删除分组将删除该分组内的所有数值，确认删除吗？', { type: 'SAVE_PROJECT_CONTENT', content });
  }

  deletenum = (title) => {
    const currentgroup = this.state.currentgroup;
    let content = { ...this.props.content };
    let numbers = { ...content.numbers };
    delete numbers[currentgroup].nums[title];
    content.numbers = numbers;
    this.props.setAppConfirm('删除数值可能会导致数值分支错误，确认删除吗？', { type: 'SAVE_PROJECT_CONTENT', content });
  }

  getrolename = (id) => {
    const roles = this.props.content.roles;
    const role = roles.find(r => r.id === id);
    if (role) {
      return role.name;
    } else {
      return '未选择';
    }
  }

  rendereditor = () => {
    const numbers = this.props.content.numbers;
    const { currentgroup } = this.state;
    const group = numbers[currentgroup];
    if (group) {
      if (group.type === 'favor') {
        const numlist = Object.keys(group.nums).map((n, key) => {
          return (
            <tr key={key}>
              <td>{n}</td>
              <td>{group.nums[n].type === 'forever' ? '永久' : '普通'}</td>
              <td>{group.nums[n].value}</td>
              <td>{this.getrolename(group.nums[n].role_id)}</td>
              <td>{group.nums[n].show_name}</td>
              <td>
                <span className="fa fa-pencil-square-o num-edit" onClick={() => this.toeditnum(n)} title="编辑"></span>
                <span className="fa fa-trash-o num-delete" onClick={() => this.deletenum(n)} title="删除"></span>
              </td>
            </tr>
          );
        });
        return (
          <div className="numeditor">
            <div className="editorhead">
              <p><span className="fa fa-exclamation-circle"></span>好感分组的数值将会在app显示</p>
              <div className="btn-green-s" onClick={() => this.tonewnum()}>新建数值</div>
            </div>
            <table>
              <thead>
                <tr>
                  <td>名称</td>
                  <td>类型</td>
                  <td>初始值</td>
                  <td>关联角色</td>
                  <td>显示名</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody>
                {numlist}
              </tbody>
            </table>
          </div>
        );
      } else if (group.type === 'property') {
        const numlist = Object.keys(group.nums).map((n, key) => {
          return (
            <tr key={key}>
              <td>{n}</td>
              <td>{group.nums[n].type === 'forever' ? '永久' : '普通'}</td>
              <td>{group.nums[n].value}</td>
              <td>{group.nums[n].show_name}</td>
              <td>
                <span className="fa fa-pencil-square-o num-edit" onClick={() => this.toeditnum(n)} title="编辑"></span>
                <span className="fa fa-trash-o num-delete" onClick={() => this.deletenum(n)} title="删除"></span>
              </td>
            </tr>
          );
        });
        return (
          <div className="numeditor">
            <div className="editorhead">
              <p><span className="fa fa-exclamation-circle"></span>属性分组将会在app显示</p>
              <div className="btn-green-s" onClick={() => this.tonewnum()}>新建数值</div>
            </div>
            <table>
              <thead>
                <tr>
                  <td>名称</td>
                  <td>类型</td>
                  <td>初始值</td>
                  <td>显示名</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody>
                {numlist}
              </tbody>
            </table>
          </div>
        );
      } else {
        const numlist = Object.keys(group.nums).map((n, key) => {
          return (
            <tr key={key}>
              <td>{n}</td>
              <td>{group.nums[n].type === 'forever' ? '永久' : '普通'}</td>
              <td>{group.nums[n].value}</td>
              <td>
                <span className="fa fa-pencil-square-o num-edit" onClick={() => this.toeditnum(n)} title="编辑"></span>
                <span className="fa fa-trash-o num-delete" onClick={() => this.deletenum(n)} title="删除"></span>
              </td>
            </tr>
          );
        });
        return (
          <div className="numeditor">
            <div className="editorhead">
              <p><span className="fa fa-exclamation-circle"></span>系统分组的数值不会在app显示</p>
              <div className="btn-green-s" onClick={() => this.tonewnum()}>新建数值</div>
            </div>
            <table>
              <thead>
                <tr>
                  <td>名称</td>
                  <td>类型</td>
                  <td>初始值</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody>
                {numlist}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  rendereditorbox = () => {
    const numbers = this.props.content.numbers;
    const { currentgroup, editortype, editorbox, title, type, value, show_name, role_id } = this.state;
    const group = numbers[currentgroup];
    if (editorbox === null) {
      return null;
    } else if (editorbox === 'group') {
      return (
        <div className="editorbox">
          <div className="numbox">
            <table>
              <tbody>
                <tr>
                  <td className="table-txt">分组名称</td>
                  <td className="table-content">
                    <input className="form-control" value={title} type="text" maxLength="7" onChange={this.changetitle} />
                    <p className="table-alert">名字最多7个字</p>
                  </td>
                </tr>
                <tr>
                  <td className="table-txt">分组类型</td>
                  <td className="table-content">
                    <select className="form-control" value={type} onChange={this.changetype}>
                      <option value="property">属性</option>
                      <option value="favor">好感</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="btn-green-s" onClick={this.updategroup}>{editortype === 1 ? '保 存' : '创 建'}</div>
            <div className="btn-blue-s" onClick={this.quit}>取 消</div>
          </div>
        </div>
      );
    } else if (editorbox === 'num') {
      const roles = this.props.content.roles;
      const rolelist = roles.map((r, key) => {
        return (
          <option key={key} value={r.id}>{r.name}</option>
        )
      });
      return (
        <div className="editorbox">
          <div className="numbox">
            <table>
              <tbody>
                <tr>
                  <td className="table-txt">数值名称</td>
                  <td className="table-content">
                    <input className="form-control" value={title} type="text" maxLength="7" onChange={this.changetitle} />
                    <p className="table-alert">名字最多7个字</p>
                  </td>
                </tr>
                <tr>
                  <td className="table-txt">数值类型</td>
                  <td className="table-content">
                    <select className="form-control" value={type} onChange={this.changetype}>
                      <option value="normal">普通</option>
                      <option value="forever">永久</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="table-txt">初始值</td>
                  <td className="table-content">
                    <input className="form-control" value={value} type="text" maxLength="7" onChange={this.changevalue} />
                  </td>
                </tr>
                {group.type === 'favor' ?
                  <tr>
                    <td className="table-txt">关联角色</td>
                    <td className="table-content">
                      <select className="form-control" value={role_id} onChange={this.changerole}>
                        <option value="-1">请选择角色</option>
                        {rolelist}
                      </select>
                    </td>
                  </tr> : null
                }
                {group.type !== 'system' ?
                  <tr>
                    <td className="table-txt">显示名</td>
                    <td className="table-content">
                      <input className="form-control" value={show_name} type="text" maxLength="7" onChange={this.changeshowname} />
                      <p className="table-alert">名字最多7个字</p>
                    </td>
                  </tr> : null
                }
              </tbody>
            </table>
            <div className="btn-green-s" onClick={this.updatenum}>{editortype === 1 ? '保 存' : '创 建'}</div>
            <div className="btn-blue-s" onClick={this.quit}>取 消</div>
          </div>
        </div>
      );
    }
  }

  render() {
    const numbers = this.props.content.numbers;
    const { currentgroup } = this.state;
    const grouplist = Object.keys(numbers).map((g, key) => {
      if (g !== '系统') {
        return (
          <li className={"group-item " + (g ? (g === currentgroup ? 'current-group' : '') : '')} key={key} onClick={() => this.changecurrentgroup(g)}>
            <b>{g + (numbers[g].type === 'favor' ? ' (好感)' : ' (属性)')}</b>
            <span className="fa fa-pencil-square-o group-edit" onClick={(e) => this.toeditgroup(e, g)} title="编辑"></span>
            <span className="fa fa-trash-o group-delete" onClick={(e) => this.deletegroup(e, g)} title="删除"></span>
          </li>
        );
      } else {
        return (
          <li className={"group-item " + (g ? (g === currentgroup ? 'current-group' : '') : '')} key={key} onClick={() => this.changecurrentgroup(g)}>
            <b>{g}</b>
          </li>
        );
      }
    });
    return (
      <div className="numbers">
        <div className="grouplist ">
          <h3>数值分组</h3>
          <span className="fa fa-plus addrole" onClick={this.tonewgroup} title="新建分组"></span>
          <ul className="group-items">
            {grouplist}
          </ul>
        </div>
        {this.rendereditor()}
        {this.rendereditorbox()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { content: state.editor.content };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAppConfirm: (content, cback) => dispatch({ type: 'SET_APP_CONFIRM', confirm: { content, cback } }),
    saveProjectContent: (content) => dispatch({ type: 'SAVE_PROJECT_CONTENT', content: content }),
    setAppMessage: (type, content) => dispatch({ type: 'SET_APP_MESSAGE', message: { type, content } }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Numbers);


// WEBPACK FOOTER //
// ./src/Author/components/Numbers.js
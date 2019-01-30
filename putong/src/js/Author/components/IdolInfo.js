import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/IdolInfo.css';

class IdolInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idol: null,
    };
  }

  componentWillMount() {
    const id = parseInt(this.props.router.split('-')[2], 10);
    const idols = this.props.idols;
    const idol = idols.find(item => item.id === id);
    this.setState({ idol });
  }

  changename = (e) => {
  }

  changeintroduction = (e) => {
  }

  changeidolprofile = (url) => {
  }

  saveidol = () => {
  }

  commitidol = () => {
  }

  render() {
    const idol = this.state.idol;
    const projectslist = idol.projects.map(p => {
      return (
        <div key={p.id} className="selectprojectgroup">
          <p>{p.id + '. ' + p.title}</p>
        </div>
      )
    });
    return (
      <div className="idolinfo">
        <table>
          <tbody>
            <tr>
              <td className="table-txt">名称</td>
              <td className="table-content"><input className="form-control" type="text" value={idol.name} onChange={this.changename} /></td>
            </tr>
            <tr>
              <td className="table-txt">头像</td>
              <td className="table-content"><FileUpload getuploadurl={this.changeidolprofile.bind(this)} src={idol.image} filetype="img1"></FileUpload></td>
            </tr>
            <tr>
              <td className="table-txt">关联作品：</td>
              <td className="table-content">
                <div className="projects">
                  {projectslist.length > 0 ? projectslist : <p>无</p>}
                </div>
              </td>
            </tr>
            <tr>
              <td className="table-txt">简介</td>
              <td className="table-content"><textarea className="form-control" cols="50" rows="8" value={idol.text} onChange={this.changeintroduction}></textarea></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { router: state.app.router, idols: state.idols.list };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdolInfo);


// WEBPACK FOOTER //
// ./src/Author/components/IdolInfo.js
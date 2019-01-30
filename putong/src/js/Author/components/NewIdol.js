import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import '../css/NewIdol.css';

class NewIdol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idol: {
        id: 0,
        name: '',
        image: '',
        text: '',
        update_time: new Date().getTime(),
      },
    };
  }

  changename(e) {
    let idol = { ...this.state.idol };
    idol.name = e.target.value;
    this.setState({ idol });
  }

  changeintroduction(e) {
    let idol = { ...this.state.idol };
    idol.introduction = e.target.value;
    this.setState({ idol });
  }

  changeidolprofile = (url) => {
    let idol = { ...this.state.idol };
    idol.profile = url;
    this.setState({ idol });
  }

  tonewidol = () => {
    this.props.newIdol(this.state.idol);
  }

  render() {
    const idol = this.state.idol;
    return (
      <div className="newidol">
        <table>
          <tbody>
            <tr>
              <td className="table-txt">名称</td>
              <td className="table-content"><input className="form-control" type="text" value={idol.name} onChange={this.changename} /></td>
            </tr>
            <tr>
              <td className="table-txt">头像</td>
              <td className="table-content"><FileUpload getuploadurl={this.changeidolprofile.bind(this)} src={idol.profile} filetype="img1"></FileUpload></td>
            </tr>
            <tr>
              <td className="table-txt">简介</td>
              <td className="table-content"><textarea className="form-control" cols="30" rows="8" value={idol.introduction} onChange={this.changeintroduction}></textarea></td>
            </tr>
            <tr>
              <td className="table-txt"></td>
              <td className="table-content"><div className="btn-green-m" onClick={this.tonewidol}>创建</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    newIdol: (idol) => dispatch({ type: 'NEW_IDOL', idol }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewIdol);


// WEBPACK FOOTER //
// ./src/Author/components/NewIdol.js
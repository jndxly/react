import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Errors.css';

class Errors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorshow: true,
    };
  }

  movetoerrorparagraph = (error) => {
    const { isextra } = this.props;
    if ((isextra === '1' && error.extra.extra_uuid !== null) || (isextra === '0' && error.extra.extra_uuid === null)) {
      this.props.aimto(error.extra.id);
    } else if (isextra === '0' && error.extra.extra_uuid !== null) {
      this.props.setSelectedExtraUUId(error.extra.extra_uuid);
      this.props.setRouter('ProjectEditor-ExtraEditor');
    }
  }

  render() {
    const { errors, warnings } = this.props;
    const errorlist = errors.map((error, key) => {
      return <pre key={key} onClick={() => this.movetoerrorparagraph(error)}><span className="fa fa-exclamation-circle error-icon"></span>{(key + 1) + '  ' + error.getContext() + error.getMessage()}</pre>
    });
    const wraninglist = warnings.map((wraning, key) => {
      return <pre key={key} onClick={() => this.movetoerrorparagraph(wraning)}><span className="fa fa-exclamation-triangle warning-icon"></span>{(key + 1) + '  ' + wraning.getContext() + wraning.getMessage()}</pre>
    });
    return (
      <div className="errorbox">
        <div className="error-title" onClick={() => this.setState({ errorshow: !this.state.errorshow })}>错误列表<span className="error-total">
          <span className="fa fa-exclamation-circle error-icon"></span>{errorlist.length + "个错误"} </span>
          <span className="warning-total"><span className="fa fa-exclamation-triangle warning-icon"></span>{wraninglist.length + "个警告"}</span>
          <div className={"fa fa-sort-desc toggle " + ((errors.length !== 0 || warnings.length !== 0) && this.state.errorshow ? '' : 'off')} ></div>
        </div>
        <div className={"error-content " + ((errors.length !== 0 || warnings.length !== 0) && this.state.errorshow ? '' : 'off')}>
          {errorlist}
          {wraninglist}
        </div>
      </div>)
  }
}

const mapStateToProps = (state, props) => {
  return {
    errors: state.editor.errors.filter(error => (props.isextra === '1' && error.extra.extra_uuid === state.editor.selected_extra_uuid) || (props.isextra === '0' && !error.extra.extra_uuid)),
    warnings: state.editor.warnings.filter(error => (props.isextra === '1' && error.extra.extra_uuid === state.editor.selected_extra_uuid) || (props.isextra === '0' && !error.extra.extra_uuid)),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedParagraphId: (paragraph_id) => dispatch({ type: 'SET_SELECTED_PARAGRAPH_ID', paragraph_id }),
    setSelectedExtraUUId: (extra_uuid) => dispatch({ type: 'SET_SELECTED_EXTRA_UUID', extra_uuid }),
    setRouter: (router) => dispatch({ type: 'NAVIGATE_TO_ROUTER', router }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Errors);



// WEBPACK FOOTER //
// ./src/Author/components/Errors.js
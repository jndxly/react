import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Message.css';

class Message extends Component {

  rendermessage() {
    if (this.props.message.content) {
      setTimeout(() => {
        this.props.cleanMessage();
      }, 4000);
      return <div className={"message " + this.props.message.type}><p>{this.props.message.content}</p></div>
    } else {
      return null
    }
  }

  render() {
    return this.rendermessage()
  }
}

const mapStateToProps = (state) => {
  return { message: state.app.message };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cleanMessage: () => dispatch({ type: 'SET_APP_MESSAGE', message: { type: 'normal', content: null } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);



// WEBPACK FOOTER //
// ./src/Author/components/Message.js
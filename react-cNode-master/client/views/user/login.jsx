import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

import UserWrapper from './user'
import loginStyles from './styles/login-style'


@inject(stores => ({
  appState: stores.appState,
})) @observer
class UserLogin extends React.Component {
  // 通过context 获取 router
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  // 点击登录
  handleLogin() {
    const { accesstoken } = this.state
    const { appState } = this.props
    if (!accesstoken) {
      return this.setState({
        helpText: '必须填写',
      })
    }
    this.setState({
      helpText: '',
    })
    return appState.login(accesstoken)
      .then((resp) => {
        // 登录成功 跳转到 用户信息页面
        const { router } = this.context
        router.history.replace(`/user/${resp.loginname}`)
      })
      .catch((msg) => {
        appState.notify({ message: msg })
      })
  }

  // 输入 accesstoken
  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  render() {
    const { classes } = this.props
    const { helpText, accesstoken } = this.state
    return (
      <UserWrapper isLoginPage>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={helpText}
            value={accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(UserLogin)

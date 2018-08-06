import React, { Component } from 'react'
import Header from './Header'
import Content from './Content'

class App extends Component {

  constructor(){
    super()
    this.state = {
      color:'gray'
    }
  }

  handleSwitchColor (color) {
      this.setState({
        color:color
      })
  }

  render () {
      return (
        <div>
            <Header color={this.state.color} switchColor={this.handleSwitchColor.bind(this)} />
            <Content color={this.state.color} switchColor={this.handleSwitchColor.bind(this)} />
        </div>
      )
  }
}

export default App
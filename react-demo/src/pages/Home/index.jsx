import React from 'react'
import './index.css'

import Left from './components/Left'
import Right from './components/Right'

class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="home">
                <Left />
                <Right />
            </div>
        )
    }
}
export default Home

import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="header">
                <Link to="/">home</Link>
                <Link to="/aaa">aaa</Link>
                <Link to="/bbb">bbb</Link>
            </div>
        )
    }
}
export default Header

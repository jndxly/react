// import { connect } from 'react-redux'
import React from 'react'
import './index.css'

class Right extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="right">
                {
                    /*
                    this.props.h5Games.data.length > 0 &&
                    this.props.h5Games.data.map((item) => 
                        <div 
                            key={item.id} 
                            className="game" 
                            style={{backgroundImage: 'url(' + item.background + ')'}}
                        />
                    )
                    */
                }
            </div>
        )
    }
}

export default Right

/*
const mapStateToProps = (state) => {
    return {
        h5Games: state.h5Games,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Right)
*/
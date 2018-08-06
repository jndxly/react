import { connect } from 'react-redux'
import React from 'react'
import { fetchH5Games } from '../../../../actions'
import { ajax } from '../../../../util' 
import './index.css'

class Left extends React.Component {
    constructor(props) {
        super(props)

        /*
        this.state = {
            isLoading: false,
            error: '',
            data: {},
        }
        */
    }

    handleClick = () => {
        const url = '/pcacenter/position/plist/h5'

        
        this.props.fetchH5Games()

        /*
        this.setState({
            isLoading: true, 
        })

        ajax(url, 'GET').then(res => {
            if (res.code === 200) { 
                this.setState({
                    data: res.data
                })
            } else {
                this.setState({
                    error: res.msg
                })
            }
            this.setState({
                isLoading: false 
            })
        })
        */
    }

    render() {
        const h5Games = this.props.h5Games.data
        // const h5Games = this.state.data
        return (
            <div className="left">
                <button onClick={this.handleClick}>
                    点我
                </button>
                {
                    h5Games.length > 0 &&
                    h5Games.map((item) => 
                        <div 
                            key={item.id} 
                            className="game" 
                            style={{backgroundImage: 'url(' + item.background + ')'}}
                        />
                    )
                }
            </div>    
            
        )
    }
}

// export default Left

const mapStateToProps = (state) => {
    return {
        h5Games: state.h5Games1,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchH5Games: () => dispatch(fetchH5Games()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Left)
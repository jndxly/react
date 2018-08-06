import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'
import history from './history'
import configureStore from './store'
import registerServiceWorker from './registerServiceWorker'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Aaa from './pages/Aaa'
import Bbb from './pages/Bbb'
import './index.css'

const store = configureStore({}) 

class App extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="app">
                <Helmet 
                    title="react demo"
                    meta={[
                        { name: 'keywords', content: 'react demo' },
                        { name: 'description', content: 'react demo' }
                    ]}
                />
                <Header />
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={true} path="/aaa" component={Aaa} />
                    <Route exact={true} path="/bbb" component={Bbb}/>
                </Switch>
                <Footer />
            </div>
        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route component={App} />
        </Router>
    </Provider>, 
    document.getElementById('root')
)

registerServiceWorker()

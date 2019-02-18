import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Header from './Header';
import Content from './Content';

@observer
class Container extends Component{

    render(){
        return (
            <div>
                <Header store={this.props.store}/>
                <Content store={this.props.store}/>
            </div>
        );
    }
}
export default Container;
import React from 'react';
import '../../styles/appleItem.scss';

class AppleItem extends React.Component{

   shouldComponentUpdate(nextProps){
       return nextProps.state != this.props.state;
   }

    render(){

        let {apple, eatApple} = this.props;

        return (
            <div className="appleItem">
                <div className="apple"><img src={require('../../images/apple.png')}/></div>
                <div className="info">
                    <div className="name">红苹果-{apple.id}号</div>
                    <div className="weight">{apple.weight}克</div>

                </div>
                <div className="btn-div">
                    <button onClick={eatApple.bind(this,apple.id)}>吃掉</button>
                </div>
            </div>
        );
    }


}
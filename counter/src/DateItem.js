import React from 'react';


export default class DateItem extends React.Component{

    render(){

        let {dateStr} = this.props;

        return (
            <p>{dateStr}</p>
        );

    }

}
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export  default class HeadTop extends Component{


    /*login_button, video_url, switch_login_button*/
    constructor(props){
        super(props);
    }

    /**/
    render(){


        let loginBtnStyle = {
            background : 'url(' + this.props.login_button.content + ' )no repeat',
            backgroundSize : '100% auto',
            display : 'block'
        }

        const logoutStyle = {
            background : `url(${this.props.switch_login_button.content} ) no repeat`,
            backgroundSize : '100% auto'
        };

        let vedioContentHtml ;
        if(this.props.video_url.content!=0){
            vedioContentHtml = (
                <a className="video" data-url={this.props.video_url.content}></a>
            )
        }
        else{
            vedioContentHtml = "";
        }




        return (
            <div className="head">
                <img src={this.props.top_img.content} className="head1"/>
                <div className="log">
                    <a className="login_countBtn" style={loginBtnStyle}></a>
                    <div className="logout">
                        <span className="username"></span>
                        <a className="logout-btn"></a>
                    </div>

                </div>
                <a className="rule"></a>
                {vedioContentHtml}

            </div>
        );

    }



}
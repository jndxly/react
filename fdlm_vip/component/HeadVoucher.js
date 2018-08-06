'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export  default class HeadVoucher extends Component{

/*vocher_background*/
    constructor(props){
        super(props);
    }

    /**/
    render(){


        const gift2Style = {
            // background : 'url(' + this.props.login_button.content + ') no repeat',
            background : `url(${this.props.get_button.content} ) no repeat`,
            backgroundSize : '100% auto',
            display : 'block'
        }


        const logoutStyle = {
            background : `url(${this.props.switch_login_button.content} ) no repeat`,
            backgroundSize : '100% auto'
        }






        return (
            <div className="head head-vouchers">
                <img src={this.props.vocher_background.content} className="head2"/>
                <div className="gift-vouchers">
                    <div className="gift2">
                        <a
                            className="gift2-vouchers-receive countBtn"
                            style={gift2Style}
                            data-count={this.props.stat_get_voucher_btn.dataCount}
                            data-desc={this.props.stat_get_voucher_btn.desc}>
                        </a>
                    </div>

                </div>

            </div>
        );

    }



}
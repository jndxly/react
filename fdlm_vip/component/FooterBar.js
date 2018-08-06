'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export  default class FooterBar extends Component{

    /*vocher_background*/
    constructor(props){
        super(props);
    }

    getFooterBtn = ()=>{

        let items = [];

        let {bottom_img,
            hidden_download_button,
            vip_open_button_statistic,
            game_download_button_statistic,
            hidden_vip_open_button} = this.props;

        if(this.props.hidden_download_button.content == 1 || this.props.hidden_vip_open_button.content == 1){
            if(this.props.hidden_download_button.content == 1 && this.props.hidden_vip_open_button.content == 1){
                if(this.props.vip_type.content == 2){
                    items.push(
                        <a className="foot-btn1 go-cash countBtn"
                           id="foot-btn-log"
                        data-count={this.props.vip_open_button_statistic.dataCount}
                        data-desc={this.props.vip_open_button_statistic.desc}>

                        </a>
                    );
                }
                else{
                    items.push(
                        <a rseat="605252_21"
                           data-param="fc=bb2016b3cb89a40d"
                           glue-component="activity.component.button.ChargeButton"
                           data-default-url="https://m.iqiyi.com/pay.html?serviceCode=lyksc7aq36aedndk&pid=a0226bd958843452&payAutoRenew=3&amount=12"
                           glue-id="activity.component.button.ChargeButton_6"
                           className="foot-btn1 countBtn"
                           id="foot-btn1-log"
                           data-count={this.props.vip_open_button_statistic.dataCount}
                           data-desc={this.props.vip_open_button_statistic.desc}>

                        </a>
                    )
                }
            }
            else{
                items.push(
                    <a
                        className="foot-btn countBtn"
                        data-count={this.props.game_download_button_statistic.dataCount}
                        data-desc={this.props.game_download_button_statistic.desc}
                        id="foot-btn-vip">
                    </a>
                );
                items.push(
                    <a
                        className="foot-btn countBtn"
                        data-count={this.props.vip_open_button_statistic.dataCount}
                        data-desc={this.props.vip_open_button_statistic.desc}
                        id="foot-btn-nolog" >
                    </a>
                );
                if(this.props.vip_type.content == 2){
                    items.push(
                        <a className="foot-btn go-cash countBtn"
                            id="foot-btn-log"
                           data-count={this.props.vip_open_button_statistic.dataCount}
                           data-desc={this.props.vip_open_button_statistic.desc}>
                        </a>
                    );
                }
                else{
                    items.push(
                        <a rseat="605252_21"
                           data-param="fc=bb2016b3cb89a40d"
                           glue-component="activity.component.button.ChargeButton"
                           data-default-url="https://m.iqiyi.com/pay.html?serviceCode=lyksc7aq36aedndk&pid=a0226bd958843452&payAutoRenew=3&amount=12"
                           glue-id="activity.component.button.ChargeButton_6"
                           className="foot-btn1 countBtn"
                           id="foot-btn1-log"
                           data-count={this.props.vip_open_button_statistic.dataCount}
                           data-desc={this.props.vip_open_button_statistic.desc}>

                        </a>
                    );
                }
            }
        }
    }

    /**/
    render(){

        let {
            bottom_img,
            hidden_download_button,
            vip_open_button_statistic,
            game_download_button_statistic,
            hidden_vip_open_button
        } = this.props;

        return (
            <div className="foot">
                <img src={this.props.bottom_img.content}/>
                {this.getFooterBtn()}

            </div>
        );

    }



}
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export  default class HeadBox extends Component{

    /*vocher_background*/
    constructor(props){
        super(props);
    }

    getPrizeImg(){
        let prize;
        if(this.props.prize_img && this.props.prize_img.content){
            return (
                <img src={this.props.prize_img.content} className="head2"/>
            );
        }
        else{
            return ;
        }

    }

    getGiftBox = ()=>{

        const giftStyle = {
            background : `url(${this.props.get_button.content} ) no repeat`,
            backgroundSize : '100% auto'
        }

        if(this.props.prize_number.content == 1){
            return (
                <div className="gift1">
                    <a
                        data-count={this.props.prize_get_button_1_statistic.dataCount}
                        data-desc={this.props.prize_get_button_1_statistic.desc}
                        className="gift1-receive gift-receive countBtn ">

                    </a>
                </div>
            );
        }
        else if(this.props.prize_number.content == 2){
            return (
                <div className="gift2">
                    <a
                        data-count={this.props.prize_get_button_1_statistic.dataCount}
                        data-desc={this.props.prize_get_button_1_statistic.desc}
                        className="gift2-receive1 gift-receive countBtn ">
                    </a>
                    <a
                        data-count={this.props.prize_get_button_2_statistic.dataCount}
                        data-desc={this.props.prize_get_button_2_statistic.desc}
                        className="gift2-receive2 gift-receive countBtn ">
                    </a>
                </div>
            );
        }
        else{
            return ;
        }
    }

    /**/
    render(){


        const {
            prize_img,
            prize_number,
            get_button
        } = this.props;






        return (
            <div className="head head-box">
                {this.getPrizeImg()}
                <div className="gift-box">
                    {this.getGiftBox()}
                </div>

            </div>
        );

    }



}
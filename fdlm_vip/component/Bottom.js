'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export  default class Bottom extends Component{

    /*vocher_background*/
    constructor(props){
        super(props);
    }

    getSwitchBtn(content){

        const btnStyle = {
            background : `url( ${content}) no-repeat`,
            backgroundSize : '100% auto'
        }

        if(this.props.slider_right_switch_button.content){
            return (
                <div className="swiper-button-next" style={btnStyle}></div>
            );
        }
    }

    getSwiperContent = ()=>{
        let items = [];
        for(let index = 0; index < this.props.slider_img_list.length; index++){
            let value = this.props.slider_img_list[index];
            if(value.content){
                let swiperStyle = {
                    background : `url( ${value.content}) no-repeat`,
                    backgroundSize : '100% auto'
                }
                item.push(
                    <div className="swiper-slide" style={swiperStyle}>

                    </div>
                );
            }
        }
    }

    /**/
    render(){

        const {
            game_desc_img,
            slider_img_list,
            slider_right_switch_button,
            slider_left_switch_button
        } = this.props;


        return (
            <div className="bottom">
                <img src={this.props.game_desc_img.content}/>
                <div className="swiper-container">
                    {this.getSwiperContent()}
                </div>
                {this.getSwitchBtn(this.props.slider_right_switch_button.content)}
                {this.getSwitchBtn(this.props.slider_left_switch_button.content)}

            </div>
        );

    }



}
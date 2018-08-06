'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeadTop from './HeadTop';
import HeadBox from './HeadBox';
import HeadVoucher from './HeadVoucher'
import Middle from "./Middle";
import Bottom from "./Bottom";

export  default class Section extends Component{

    /*vocher_background*/
    constructor(props){
        super(props);
    }

    /**/
    render(){

        let {
            top_img,
            login_button,
            switch_login_button,
            video_url,
            award_id_5,
            vocher_background,
            stat_get_voucher_btn,
            get_button,
            prize_img,
            prize_get_button_1_statistic,
            prize_get_button_2_statistic,
            prize_number,
            slider_img_list,
            slider_right_switch_button,
            slider_left_switch_button,
            game_desc_img
        } = this.props;

        return (
            <div>
                <HeadTop
                    top_img={top_img}
                    login_button={login_button}
                    switch_login_button={switch_login_button}
                    video_url={video_url}
                    award_id_5={award_id_5}
                />
                <HeadVoucher
                    vocher_background={vocher_background}
                    switch_login_button={switch_login_button}
                    stat_get_voucher_btn={stat_get_voucher_btn}
                    get_button={get_button}
                />
                <HeadBox
                    prize_img={prize_img}
                    prize_get_button_1_statistic={prize_get_button_1_statistic}
                    prize_get_button_2_statistic={prize_get_button_2_statistic}
                    prize_number={prize_number}
                    get_button={get_button}
                />
                <Middle

                />
                <Bottom
                    game_desc_img={game_desc_img}
                    slider_img_list={slider_img_list}
                    slider_right_switch_button={slider_right_switch_button}
                    slider_left_switch_button={slider_left_switch_button}
                />
            </div>
        );

    }



}
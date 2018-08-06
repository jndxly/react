import React, { Component } from 'react';
import { render } from 'react-dom'
import '../../lib/flexible';
require('./style.css');
import Section from './component/Section';
import {default as Foot} from "./component/FooterBar";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            htmlInfo : ""
        }
    }

    componentDidMount(){

        let jsonStr = '{"user_info":{"user_id":0,"username":"","type":"nologin","mobile":0,"phone":""},"active_conf":{"active_id":"1592","game_id":"7200","active_name":"《钢铁战队》5.12燃情上线","id_type":"1","active_type":"40","start_time":"2018-05-08 11:35:18","end_time":"2018-07-31 11:35:23","downtime":"2018-07-31 11:35:23"},"active_info":{"prize_1":{},"prize_2":{},"prize_3":{},"ip":"101.227.12.253","is_vip":null},"html_info":{"top_img":{"content":"https://static.g.iqiyi.com/operation/img/7829_0_0_e90697891468872e54fb0d9a7b64b4d1.jpg","url":"","dataCount":"","desc":"头图"},"video_url":{"content":"0","url":"","dataCount":"","desc":"视频链接"},"login_button":{"content":"https://static.g.iqiyi.com/operation/img/7831_0_0_ad2fc759a7d3fa6f60f64634e351cedf.png","url":"","dataCount":"","desc":"登录按钮"},"switch_login_button":{"content":"https://static.g.iqiyi.com/operation/img/7832_0_0_81b2a5fdf7be76750d90fe0456180906.png","url":"","dataCount":"","desc":"切换账号按钮"},"rule_image":{"content":"https://static.g.iqiyi.com/operation/img/7833_0_0_7dfec6fb763a594bb759ebe3bc166e2a.png","url":"","dataCount":"","desc":"活动规则弹窗"},"prize_number":{"content":"2","url":"","dataCount":"","desc":"礼包显示数量"},"award_id_1":{"content":"3055","url":"","dataCount":"","desc":"中奖规则1"},"award_id_2":{"content":"3056","url":"","dataCount":"","desc":"中奖规则2"},"award_id_5":{"content":null,"url":"","dataCount":"","desc":"代金券规则id"},"vocher_background":{"content":null,"url":"","dataCount":"","desc":"代金券板块背景图"},"voucher_get_popup":{"content":null,"url":"","dataCount":"","desc":"代金券领取成功弹窗"},"vip_popup":{"content":null,"url":"","dataCount":"","desc":"开通会员弹窗"},"vip_success_popup":{"content":null,"url":"","dataCount":"","desc":"会员开通成功弹窗"},"ios_is_display":{"content":"1","url":"","dataCount":"","desc":"iOS客户端内是否显示礼包"},"get_button":{"content":"https://static.g.iqiyi.com/operation/img/7839_0_0_7c8a5806d2ea335cd3b03cb474d8b334.png","url":"","dataCount":"","desc":"立即领取按钮"},"get_success_button":{"content":"https://static.g.iqiyi.com/operation/img/7840_0_0_ab596ef31148118b25c3fdcbe73f1338.png","url":"","dataCount":"","desc":"领取成功按钮"},"prize_popup_img":{"content":"https://static.g.iqiyi.com/operation/img/7841_0_0_fcc5828f61531a6decc43b38d55e5966.png","url":"","dataCount":"","desc":"中奖弹窗"},"hidden_enter_game":{"content":"1","url":"","dataCount":"","desc":"隐藏进入游戏按钮"},"vip_img_1":{"content":"https://static.g.iqiyi.com/operation/img/7843_0_0_0329e987887e7c1890bfbd23afa62592.jpg","url":"","dataCount":"","desc":"特权展示图1（含标题）"},"vip_img_2":{"content":"","url":"","dataCount":"","desc":"特权展示图2"},"vip_img_3":{"content":"","url":"","dataCount":"","desc":"特权展示图3"},"vip_img_4":{"content":"","url":"","dataCount":"","desc":"特权展示图4"},"vip_img_5":{"content":"","url":"","dataCount":"","desc":"特权展示图5"},"game_desc_img":{"content":"https://static.g.iqiyi.com/operation/img/7848_0_0_bcb7d141d2a5b10b84ff6047e6b14e36.jpg","url":"","dataCount":"","desc":"游戏介绍背景图"},"slider_img_list":{"1":{"content":"https://static.g.iqiyi.com/operation/img/7849_0_0_bf46b1614ec6d29617286fb1d6a80179.png","url":"","dataCount":"","desc":""},"2":{"content":"https://static.g.iqiyi.com/operation/img/7850_0_0_508940aaa9cba9fc69b65ae33d8e38e1.png","url":"","dataCount":"","desc":""},"3":{"content":"https://static.g.iqiyi.com/operation/img/7851_0_0_cbc594105b54ae41bbc12d39a85d89de.png","url":"","dataCount":"","desc":""},"4":{"content":"https://static.g.iqiyi.com/operation/img/7852_0_0_dfcfee18ee65a7a5a51cc1a95448b9b7.png","url":"","dataCount":"","desc":""},"5":{"content":"https://static.g.iqiyi.com/operation/img/7853_0_0_a06fb73ed08d43cdec5db037efe63629.png","url":"","dataCount":"","desc":""},"6":{"content":"","url":"","dataCount":"","desc":""}},"hidden_vip_open_button":{"content":"1","url":"","dataCount":"","desc":"隐藏会员开通按钮"},"hidden_download_button":{"content":"1","url":"","dataCount":"","desc":"隐藏下载按钮"},"game_id":{"content":"7200","url":"","dataCount":"","desc":"游戏ID"},"in_site_url":{"content":"http://cdn.data.video.iqiyi.com/cdn/membergame/20180510/upload/unite/game/20180510/7200_1525957578_iqiyilist_1.apk","url":"","dataCount":"","desc":"站内链接"},"in_site_md5":{"content":"bd894faf85944676c24ac24e7b5821e1","url":"","dataCount":"","desc":"站内MD5"},"out_site_url":{"content":"http://cdn.data.video.iqiyi.com/cdn/membergame/20180510/upload/unite/game/20180510/7200_1525957567_tpadsp_2.apk","url":"","dataCount":"","desc":"站外链接"},"ios_url":{"content":"0","url":"","dataCount":"","desc":"iOS链接"},"slider_left_switch_button":{"content":"https://static.g.iqiyi.com/operation/img/7874_0_0_3116d81f800145c1830db0142e539ff3.png","url":"","dataCount":"","desc":"轮播切换左"},"slider_right_switch_button":{"content":"https://static.g.iqiyi.com/operation/img/7875_0_0_7e3f3c739d7c387fb86dbaceff992ee3.png","url":"","dataCount":"","desc":"轮播切换右"},"bottom_img":{"content":"https://static.g.iqiyi.com/operation/img/7876_0_0_a90b75ffcfd92c0690a328fdc744dfab.png","url":"","dataCount":"","desc":"底部图片"},"bg_color":{"content":"#06222a","url":"","dataCount":"","desc":"背景色"},"share_title":{"content":"从《国王保卫战》到《钢铁战队》......","url":"","dataCount":"","desc":"分享标题"},"share_desc":{"content":"那些年你舍不得的一发68，游戏会员送你一发158啦，就看你抢不抢得到！","url":"","dataCount":"","desc":"分享描述"},"share_img":{"content":"https://static.g.iqiyi.com/operation/img/7969_0_0_1e34aba3898b223776773f459fe69fc7.png","url":"","dataCount":"","desc":"分享图片"},"prize_img":{"content":"https://static.g.iqiyi.com/operation/img/7970_0_0_41a656fb8b7a1388a685249117def626.jpg","url":"","dataCount":"","desc":"礼包图片"},"vip_type":{"content":"2","url":"","dataCount":"","desc":"会员按钮类型 1.VIP 2.游戏会员"},"game_vip_1_award_id":{"content":"3030","url":"","dataCount":"","desc":"游戏会员规则1_ID"},"game_vip_2_award_id":{"content":"3031","url":"","dataCount":"","desc":"游戏会员规则2_ID"},"login_button_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7862\\",\\"position_content_element_id\\":\\"24062107\\"}","desc":"登录按钮"},"prize_get_button_1_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7863\\",\\"position_content_element_id\\":\\"24062108\\"}","desc":"礼包领取按钮1"},"prize_get_button_2_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7864\\",\\"position_content_element_id\\":\\"24062109\\"}","desc":"礼包领取按钮2"},"vip_open_button_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7865\\",\\"position_content_element_id\\":\\"24062110\\"}","desc":"开通VIP按钮"},"game_download_button_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7866\\",\\"position_content_element_id\\":\\"24062111\\"}","desc":"下载游戏按钮"},"vip_img_1_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7867\\",\\"position_content_element_id\\":\\"24062112\\"}","desc":"特权展示图1（含标题）"},"vip_img_2_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7868\\",\\"position_content_element_id\\":\\"24062113\\"}","desc":"特权展示图2"},"vip_img_3_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7869\\",\\"position_content_element_id\\":\\"24062114\\"}","desc":"特权展示图3"},"vip_img_4_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7870\\",\\"position_content_element_id\\":\\"24062115\\"}","desc":"特权展示图4"},"vip_img_5_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7871\\",\\"position_content_element_id\\":\\"24062116\\"}","desc":"特权展示图5"},"prize_get_popup_img_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7872\\",\\"position_content_element_id\\":\\"24062117\\"}","desc":"礼包领取弹窗展示"},"prize_lottery_api_statistic":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"7873\\",\\"position_content_element_id\\":\\"24062118\\"}","desc":"礼包发放接口返回"},"stat_get_voucher_btn":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"9270\\",\\"position_content_element_id\\":\\"24062119\\"}","desc":"领取代金券的按钮"},"stat_vip_popup":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"9271\\",\\"position_content_element_id\\":\\"24062120\\"}","desc":"开通会员弹窗"},"stat_get_voucher_popup":{"content":"1","url":"1","dataCount":"{\\"user_id\\":\\"1454380597\\",\\"gameid\\":\\"0\\",\\"serverid\\":\\"0\\",\\"sorts\\":\\"1\\",\\"class_id\\":\\"275\\",\\"html_id\\":\\"878\\",\\"position_id\\":\\"1401\\",\\"position_element_id\\":\\"9272\\",\\"position_content_element_id\\":\\"24062121\\"}","desc":"代金券领取弹窗"},"game_info":{"game_id":7200,"qipu_id":214849020,"game_name":"钢铁战队","subtitle":"","game_type":"3","network":"2","terminal":"1","publish_area":"1","publisher_name":"北京爱奇艺科技有限公司","online_status":"1","pay_status":"1","home_url":"","bbs_url":"","sub_bbs":"","online_date":"2018-05-11 00:00:00","logo":"https://static.g.iqiyi.com/qiplay2/a3c75a60-0d59-4690-9f0c-9781e5e23124.jpg","icon":"https://static.g.iqiyi.com/qiplay2/eb08fbe1-b462-40be-94b6-8242407d2389.png","category_id":"8","category_name":"策略游戏","brief":"开启RTS手游新篇章","detail":"<div>从王国保卫战到钢铁战队…</div><div>危难降临之时，就是钢铁战队登场的时候！</div><div>一支训练有素的精锐太空部队将在荒无人烟的地域面对前所未有的困难！</div><div>他们强大，勇敢，总是能搞定一切！而你，是他们的指挥官，所以准备就绪，迎接胜利吧！</div><div>前往从未有人到达过的地方！拜访外星球，遭遇陌生危险的外星物种并将所有敌人炸个粉碎！</div><div>召集精英中的精英！发起空袭，部署炮塔并收回每一寸被外星人占去的领土。</div><div>指挥官们，行动起来吧！</div><div><br></div>","capture":["https://static.g.iqiyi.com/qiplay2/b975ca98-5d0c-4ad0-8060-5b182230249a.jpg","https://static.g.iqiyi.com/qiplay2/78f6d93a-5153-41cb-92b3-8fa7fb41e148.jpg","https://static.g.iqiyi.com/qiplay2/eddd1648-9945-4e2b-8300-c101a7ec5321.jpg","https://static.g.iqiyi.com/qiplay2/9bd83796-a3ef-4c9b-8f8f-6946f17e6da7.jpg","https://static.g.iqiyi.com/qiplay2/1b45ac5b-8951-4232-b7c4-dbdadb7eeffe.jpg"],"tags":"0","app_tags":"动作类,射击类,卡牌类,经营养成类,策略类,即时战略类,单机类,僵尸,创新玩法,独立游戏,PVE,副本,3D,Q版,卡通","attribute":"","package_name":"com.east2west.IronMarine.vip.iqiyi","package_version":"1.2.4","package_code":"120","package_size":"447","system_version":"Android 4.1.x","package_update_time":"2018-05-22 21:08:18","apple_id":"","pps_download":"https://cdndata.video.iqiyi.com/cdn/membergame/20180522/upload/unite/game/20180522/7200_1526994522_PPS_GAME_1.apk","iqiyi_download":"https://cdndata.video.iqiyi.com/cdn/membergame/20180522/upload/unite/game/20180522/7200_1526994522_iqiyilist_1.apk","qipu_download":"https://cdndata.video.iqiyi.com/cdn/membergame/20180522/upload/unite/game/20180522/7200_1526994522_iqiyiqipu_1.apk","togame_url":null,"grade":"","initial_download_size":"50208","month_download":"48743","total_download":"48917","player_num":null,"video":"","package_md5":"0971ff619f1e73e14c1d6a8b3bc09999","launch_activity_name":"","haima_url":"https://cdndata.video.iqiyi.com/cdn/membergame/20180522/upload/unite/game/20180522/7200_1526994522_hmw_1.apk","pay_platform":"0","addon_download":null,"offical_bg_pic":null,"app_bidding":"1","latest_server":"http://game.iqiyi.com/togame/entry_latest?game_id=7200","pay_url":"","orientation":"2","op_group":"4","browser_360_mode":null,"related_game_ids":"","op_mode":"1","need_auth":"0","price":null,"discount_price":null,"screenshot_ratio":"1","is_buy":"0","is_discount":"0","is_vip_price":"0","is_rent":"0","vip_price":null,"rent_price":null,"is_try_play":"1","try_play_type":"","try_play_time":"","relevant_game_id":"","url_schema":""}},"logout_path":"http://game.iqiyi.com/passport/api/logout?position=pop_login&preurl=http://game.iqiyi.com/activity/index?id=1592","current_url":"http://game.iqiyi.com/activity/index?id=1592","original_url":"http://game.iqiyi.com/activity/index?id=1592","sign_package":{"appId":"wx40cf9a4ebad43dee","nonceStr":"nXvITeqGjFOVBPiA","timestamp":1529744324,"url":"http://game.iqiyi.com/activity/index?id=1592","signature":"c773726b1ff3dbb8bbc4df180c493d5be8faca79","rawString":"jsapi_ticket=HoagFKDcsGMVCIY2vOjf9gzFzIGHk_1SSKIZRyi2GkLTtk88tjWN7KvR6ZFJSeEsZ4kGdIR1L_29OwsKWIiUmg&noncestr=nXvITeqGjFOVBPiA&timestamp=1529744324&url=http://game.iqiyi.com/activity/index?id=1592","expire_time":1529751324,"jsApiList":["onMenuShareTimeline","onMenuShareAppMessage","hideMenuItems"]}}'
        let htmlInfo = JSON.parse(jsonStr).html_info;

        this.setState({
                htmlInfo: htmlInfo
            }
        );

    }

    render(){

        let htmlInfo = this.state.htmlInfo;

        if(htmlInfo && htmlInfo.top_img){
            let {
                top_img,
                login_button,
                switch_login_button,
                video_url,
                award_id_5,
                vocher_background,
                stat_get_voucher_btn,
                get_button,
                game_desc_img,
                prize_img,
                prize_number,
                prize_get_button_1_statistic,
                prize_get_button_2_statistic,
                slider_img_list,
                slider_right_switch_button,
                slider_left_switch_button,
                bottom_img,
                hidden_download_button,
                vip_open_button_statistic,
                game_download_button_statistic,
                vip_type,
                hidden_vip_open_button
            } = htmlInfo;


            return (
                <div id="wrapper-dom" className="wrapper">
                    <Section
                        top_img={top_img}
                        login_button={login_button}
                        switch_login_button={switch_login_button}
                        video_url={video_url}
                        award_id_5={award_id_5}
                        vocher_background={vocher_background}
                        stat_get_voucher_btn={stat_get_voucher_btn}
                        get_button={get_button}
                        prize_img={prize_img}
                        prize_get_button_1_statistic={prize_get_button_1_statistic}
                        prize_get_button_2_statistic={prize_get_button_2_statistic}
                        prize_number={prize_number}
                        game_desc_img={game_desc_img}
                        slider_img_list={slider_img_list}

                        slider_right_switch_button={slider_right_switch_button}
                        slider_left_switch_button={slider_left_switch_button}

                    />
                    <Foot
                        bottom_img={bottom_img}
                        hidden_download_button={hidden_download_button}
                        vip_open_button_statistic={vip_open_button_statistic}
                        game_download_button_statistic={game_download_button_statistic}
                        vip_type={vip_type}
                        hidden_vip_open_button={hidden_vip_open_button}
                    />
                </div>

            );
        }
        else{
            return (
                <div></div>
            )
        }


    }

}

render(
    <App/>,
    document.getElementById('root')
)
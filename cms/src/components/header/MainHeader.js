import React, {Component} from 'react';
import "./header.css";
import imgRL from "./image/icon_header.png";

class  MainHeader extends Component{

    render(){
        return (
            <header className="main-header">
                <a href="/" className="logo">
                    <span>
                        <img id="brandIcon" alt="Brand" src={imgRL}></img>
                        <span className="label label-success">V2.0</span>
                    </span>
                </a>

                <nav className="navbar navbar-static-top" role="navigation">
                    <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>

                    <!-- Navbar Right Menu -->
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li><a
                                href="http://qiwan.qiyi.domain/?page=http%3A%2F%2Fproduct-manager.game.qiyi.domain%2Fapprove%2Flist">我的审批<span
                                className="label label-warning approve-count"></span></a></li>
                            <li>
                                <a>
                                    <span>xionglijun</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" title="登出" id="logout-btn"><i
                                    className="fa fa-sign-out"></i></a>
                            </li>
                        </ul>
                    </div>
                </nav>

            </header>
        );
    }
}
export default MainHeader;
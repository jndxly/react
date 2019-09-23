import React, { Component } from 'react';
import FileUpload from './FileUpload'

export default class PhoneProcess extends Component{


    render(){
        return (
            <div className="phone-process">
                <div>
                    <span className="phone-label">角色：</span>
                    <select className="form-control" defaultValue={this.props.role} onChange={this.props.changePhoneRole}>
                        {this.props.rolelist}
                    </select>
                </div>
                <div className="subtitle-wrapper">
                    <span className="phone-label">字幕文字：</span>
                    <input className="form-control"  onChange={this.props.changePhoneSubtitle} value={this.props.subtitle}></input>
                </div>
                <div>
                    <span className="phone-label">语音：</span>
                    <FileUpload getuploadurl={this.props.changePhoneAudio} src={this.props.audio} filetype="audio"></FileUpload>
                    <span className="fa fa-trash-o deleteoption" onClick={this.props.deletePhoneProcess} title="删除电话"></span>
                </div>

            </div>
        )
    }




}
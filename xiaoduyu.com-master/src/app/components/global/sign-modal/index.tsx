import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// config
import { api, name, social } from '@config';


// components
import SignIn from './sign-in';
import SignUp from './sign-up';
import Modal from '../../../components/bootstrap/modal';
import Wechat from '../../../common/weixin';

// styles
import './style.scss';

export default function() {

  const [ type, setType ] = useState('sign-in');

  let socialLength = 0;

  for (let i in social) {
    if (social[i]) socialLength++;
  }

  const displayComponent = function() {
    setType(type == 'sign-up' ? 'sign-in' : 'sign-up');
  }

  useEffect(()=>{
    $('#sign').on('show.bs.modal', function (e) {
      setType(e.relatedTarget['data-type'] || e.relatedTarget.getAttribute('data-type') || 'sign-in')
    });
  });

  const body = (<div styleName="layer">

          {type == 'sign-in' ? <div>
              <SignIn displayComponent={displayComponent} />
              <div><Link to="/forgot" className="text-primary" onClick={()=>{ $('#sign').modal('hide'); }}>忘记密码？</Link></div>
            </div>
            : null}
          
          {type == 'sign-up' ? <div>
              <SignUp displayComponent={displayComponent} />
            </div>
            : null}

          <div styleName="other-sign-in">
            <span>使用其他方式登录</span>
          </div>

          <div styleName="social" className="row">

            {social.wechat ?           
              <div className={`col-${12/socialLength}`}>
                <a
                  href="javascript:void(0)"
                  onClick={()=>{ window.location.href = `${api.domain}/oauth/wechat${Wechat.in ? '' : '-pc'}`; }}
                  styleName="wechat">
                  微信
                  </a>
              </div> : null}
            
            {social.github ?
              <div className={`col-${12/socialLength}`}>
                <a href={`${api.domain}/oauth/github`} styleName="github">GitHub</a>
              </div> : null}
            
            {social.qq ?
              <div className={`col-${12/socialLength}`}>
                <a href={`${api.domain}/oauth/qq`} styleName="qq">QQ</a>
              </div> : null}
            
            {social.weibo ?
              <div className={`col-${12/socialLength}`}>
                <a href={`${api.domain}/oauth/weibo`} styleName="weibo">微博</a>
              </div> : null}

          </div>

          <div styleName="agreement">
            登录即表示你同意网站的<Link to="/agreement" className="text-primary" onClick={()=>{ $('#sign').modal('hide'); }}>《用户协议》</Link> 与 <Link to="/privacy" className="text-primary" onClick={()=>{ $('#sign').modal('hide'); }}>《隐私政策》</Link>
          </div>

        </div>);

  return (<div>
    <Modal
      id="sign"
      header={type == 'sign-in' ? 
        <div styleName="header">
          <h4>登录{name}</h4>
          <div>
            没有账号？ <a href="javascript:void(0)" className="text-primary" onClick={displayComponent}>注册</a>
          </div>
        </div> :
        <div styleName="header">
          <h4>注册{name}</h4>
          <div>
            已经有账号了？ <a href="javascript:void(0)" className="text-primary" onClick={displayComponent}>登录</a>
          </div>
        </div>}
      body={body}
      />
  </div>)

}
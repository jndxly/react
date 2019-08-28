import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

// config
// import { contactEmail } from '@config';
import _config from '@config/index';
const { contactEmail } = _config;

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

let titleList: any = {
  'wrong_token': '无权访问',
  'has_been_binding': '已经绑定',
  'binding_failed': '绑定失败',
  'binding_finished': '绑定成功',
  'create_user_failed': '创建用户失败',
  'create_oauth_failed': '创建账户失败',
  'invalid_token': `无效的登陆令牌，请重新 <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">登陆</a>`,
  'block_account': '您的账号被禁止使用，如有疑问请联系：'+contactEmail 
}

export default Shell(function() {

  const [ tips, setTips ] = useState('');
  const { location } = useReactRouter();
  const { notice } = location.params;

  useEffect(()=>{
    setTips(titleList[notice] || '未知提醒')
  }, []);
  
  return (
    <div>
      <Meta title="提示" />
      <div style={{ textAlign:'center', fontSize:'26px', padding:'20px' }}>
        <div dangerouslySetInnerHTML={{__html:tips}} />
      </div>
    </div>
  )

})
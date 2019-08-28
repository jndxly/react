import React from 'react';
import MetaTags, { ReactTitle } from 'react-meta-tags';

// redux
// import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { getUnreadNotice } from '@reducers/website';
import { getTipsById } from '@reducers/tips';

import _config from '@config/index';
const { name } = _config;

interface Props {
  title?: string,
  children?: object
}

export default function({ title, children }: Props){

  const unreadNotice = useSelector((state: object)=>getUnreadNotice(state));
  const hasFeed = useSelector((state: object)=>getTipsById(state, 'home') || getTipsById(state, 'feed') || getTipsById(state, 'favorite') || getTipsById(state, 'excellent'));
  const hasSessions = useSelector((state: object)=>getTipsById(state, 'unread-message') );

  let _title = '';

  if (hasSessions) _title += `(${hasSessions}条私信) `;
  if (unreadNotice && unreadNotice.length > 0) _title += `(${unreadNotice.length}条通知) ` ;
  if (hasFeed) _title += `(有新动态) ` ;
  
  _title += title || name;
  if (title) _title += ` - ${name}`;

  return (
    <>
      <ReactTitle title={_title} />
      {children ? <MetaTags>{children}</MetaTags> : null}
    </>
  )
}

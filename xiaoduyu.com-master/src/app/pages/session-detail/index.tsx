import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadSessionList, readSession } from '@actions/session';
import { getSessionListById } from '@reducers/session';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import MessageList from '@modules/message-list';

import Editor from '../../components/editor-message';

// layout
import SingleColumns from '../../layout/single-columns';

import './index.scss';

export default Shell(function({ setNotFound }: any) {

  const { match } = useReactRouter();
  const { id }:any = match.params || {};

  // const [ mount, setMount ] = useState(true);
  const [ session, setSession ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  // const [ unread_count, setUnreadCount ] = useState(0);

  const list = useSelector((state: object)=>getSessionListById(state, id));

  const store = useStore();
  const _loadList = (args: object)=>loadSessionList(args)(store.dispatch, store.getState);
  const _readSession = (args: object)=>readSession(args)(store.dispatch, store.getState);

  let run: any = function(_session) {

    if (_session.unread_count > 0) {
      setTimeout(()=>{
        _readSession({ _id: id })
      }, 1000);
    }

    setSession(_session);
    setLoading(false);

    setTimeout(()=>{
      var scrollHeight = $('#content').prop("scrollHeight");
      $('#content').scrollTop(scrollHeight,200);
    }, 500);   

  }

  useEffect(()=>{

    if (list && list.data && list.data[0]) {

      let _session = list && list.data ? list.data[0] : null;

      // setTimeout(()=>{
        if (run) run(_session);
      // }, 1000);

    } else {

      _loadList({
        id,
        args: { _id: id }
      }).then(([ err, res ]: any)=>{
        if (res && res.data && res.data[0]) {
          if (run) run(res.data[0])
        }
      })

    }

    return ()=>{
      run = null;
    }

  }, list && list.data && list.data[0] ? list.length : 0);

  return (
    <SingleColumns>

    <Meta title={session ? session.user_id.nickname : 'loading...'} />

    {loading ? <div>loading...</div> : null}
    
    {session ?
      <div styleName="box" className="card">
        
        <div id="content" styleName="message-container">

        <MessageList
          id={id}
          query={{
            user_id: session.user_id._id+','+session.addressee_id._id,
            addressee_id: session.user_id._id+','+session.addressee_id._id,
            sort_by: 'create_at:-1'
          }}
          />

        </div>


        {!loading && session.user_id._id ?                
          <div styleName="editor" className="border-top">
            <Editor addressee_id={session.user_id._id} />
          </div>
        : null}
        
      </div>
      : null}

  </SingleColumns>
  )
})
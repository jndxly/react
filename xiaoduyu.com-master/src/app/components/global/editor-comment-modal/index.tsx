import React, { useState, useEffect } from 'react';

import Modal from '@components/bootstrap/modal';
import Editor from '@components/editor-comment';

export default function() {
  
  const modalId = 'editor-comment-modal';
  const [ show, setShow ] = useState(false);
  const [ comment, setComment ] = useState(null);
  const [ type, setType ] = useState('');
  const [ posts, setPosts ] = useState(null);

  useEffect(()=>{

    $('#'+modalId).on('show.bs.modal', function (e: any) {
      setShow(true);
      setComment(e.relatedTarget.comment || null);
      setPosts(e.relatedTarget.posts || null);
      setType(e.relatedTarget.type);
    });

    $('#'+modalId).on('hidden.bs.modal', function (e: any) {
      setShow(false);
      setComment(null);
      setPosts(null);
      setType('');
    });

  })

  if (!show) {
    return <Modal id={modalId} title="回复" body={''} />
  }

  let title = '回复';

  let params: any = {
    displayControls: false,
    successCallback: ()=>{
      $('#'+modalId).modal('hide');
    },
    getEditor: (editor: any) => {
      setTimeout(()=>editor.focus(), 500)
    }
  }

  if (type == 'reply' || type == 'comment') {
    title = type == 'reply' ? '回复' : '评论';

    if (posts) {

      params = {
        ...params,
        posts_id: posts._id
      };

    } else {

      params = {
        ...params,
        id: comment._id,
        posts_id: comment.posts_id._id || comment.posts_id,
        parent_id: comment.parent_id || comment._id,
        reply_id: comment._id
      };

    }

  } else if (type == 'edit') {
    title = '编辑';
    params = { ...params, ...comment };
  }

  return (<Modal id={modalId} title={title} body={<Editor {...params} />} />)

}
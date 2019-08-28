import React, { useState, useEffect, createRef } from 'react';
// import dynamicFile from 'dynamic-file';
import pangu from 'pangu';

import './style.scss';
import convertHTML from './convert';

import hljs from 'highlight.js/lib/highlight';
// import 'highlight.js/styles/github.css';

interface Props {
  content: string,
  // hiddenHalf?: boolean,
  maxHeight?: number
}

export default function({ content, maxHeight }: Props) {

  if (!content) return null;

  const [ html, setHtml ] = useState(content);
  const [ expand, setExpand ] = useState(false);
  const [ contentHeight, setContentHeight ] = useState(0);
  const contentRef = createRef();


  useEffect(()=>{

    setHtml(convertHTML(content));

    /*
    if(typeof hljs == 'undefined') {
      dynamicFile([
        '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css',
        '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js'
      ]).then(()=>{

        $('.markdown-body pre').each(function(i: any, block: any) {
          hljs.highlightBlock(block);
        });

      });
    } else {
      $('.markdown-body pre').each(function(i: any, block: any) {
        hljs.highlightBlock(block);
      });
    }
    */

    $('.markdown-body pre').each(function(i: any, block: any) {
      hljs.highlightBlock(block);
    });
    
    pangu.spacingElementByClassName('markdown-body');

    if (!contentHeight) {
      setContentHeight(contentRef && contentRef.current ? contentRef.current.offsetHeight : 0);
    }
    
  }, [content]);

  return (<div>
    

      <div
        ref={contentRef}
        style={!expand && maxHeight && contentHeight > maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : null }
        styleName="content"
        className="markdown-body"
        dangerouslySetInnerHTML={{__html:html}}
        />
      
    {(()=>{
      if (!maxHeight || contentHeight < maxHeight) return null;
      return (<div styleName="expand-button">
        <a
          href="javascript:void(0)"
          className="text-primary"
          onClick={(e: any)=>{
            e.stopPropagation();
            setExpand(expand ? false : true);
          }}
          >
          {!expand && maxHeight && contentHeight > maxHeight ? '展开全部' : '收起'}
        </a>
        </div>)
    })()}

  </div>)
}
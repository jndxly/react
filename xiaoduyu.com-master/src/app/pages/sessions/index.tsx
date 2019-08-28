import React from 'react';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import SessionList from '@modules/session-list';

// layout
import SingleColumns from '../../layout/single-columns';

export default Shell(function() {
  return (
    <SingleColumns>
      <Meta title="私信" />

      <div className="card">
      <div className="card-body p-0">
      <SessionList
        id="all"
        scrollLoad={true}
        query={{
          sort_by:'last_message:-1'
        }}
        />
      </div>
      </div>
    </SingleColumns>
  )
})
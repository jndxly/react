import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

export default Shell(function() {
  return (
    <>
      <Meta title="404,无法找到该页面" />
      <div className="text-center mt-5"><h3>404,无法找到该页面</h3></div>
    </>
  )
})
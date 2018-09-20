import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import '//static.game.qiyi.domain/css/style.min.css';
import MainWrapper from 'MainWrapper';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MainWrapper />, document.getElementById('root'));
registerServiceWorker();

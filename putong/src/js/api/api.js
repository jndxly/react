import { call } from 'redux-saga/effects';
import config from '../config';
import AppError, { AppErrorCode } from '../Author/sagas/AppError';

const Api = {
  fetch: function* (url, options) {
    try {
      // let result = yield call(fetch,  config.remoteHost + url + (url.indexOf('?') === -1 ? ('?timestamp=' + new Date().getTime()) : ('&timestamp=' + new Date().getTime())), options);
      let result = yield call(fetch,   url + (url.indexOf('?') === -1 ? ('?timestamp=' + new Date().getTime()) : ('&timestamp=' + new Date().getTime())), options);

      if (!result.ok) {
        const error = new AppError(AppErrorCode.NetworkError);
        throw error;
      } else {
        let data = JSON.parse(yield call(() => result.text()));

        if (data.error === 401) {
          const error = new AppError(AppErrorCode.InvalidToken);
          throw error;
        } else if (data.error === 403) {
          const error = new AppError(AppErrorCode.InvalidParameter);
          throw error;
        } else if (data.error === 400) {
          const error = new AppError(AppErrorCode.InvalidJson);
          throw error;
        } else {
          if(data && data.code == 200 ){
            data.error = 0;//兼容处理
            return data;
          }
          else if(data.error != undefined && data.error == 0){
            return data;
          }
          else{
              const error = new AppError(AppErrorCode.InvalidJson);
              throw error;
          };
        }
      }
    } catch (e) {
      if (e instanceof AppError) {
        throw e;
      } else {
        const error = new AppError(AppErrorCode.NetworkError);
        throw error;
      }
    }
  }
};

export default Api;


// WEBPACK FOOTER //
// ./src/api/api.js
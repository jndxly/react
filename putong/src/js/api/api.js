import { call } from 'redux-saga/effects';
import config from '../config';
import AppError, { AppErrorCode } from '../Author/sagas/AppError';

const Api = {
  fetch: function* (url, options) {
    try {
      let result = yield call(fetch,  url + (url.indexOf('?') === -1 ? ('?timestamp=' + new Date().getTime()) : ('&timestamp=' + new Date().getTime())), options);
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
          return data;
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
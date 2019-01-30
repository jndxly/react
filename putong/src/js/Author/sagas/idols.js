import { fork, takeEvery, put, select } from 'redux-saga/effects';
import Api from '../../api/api';
import { setAppLoading, setAppAlert, setAppMessage } from './app';
import AppError, { AppErrorCode } from './AppError';
import { getToken } from './user';

export function* getIdols() {
  return yield select(stort => stort.idols.list);
}

function* requestIdols(action) {
  try {
    yield setAppLoading('正在获取偶像列表...');
    const token = yield getToken();
    const result = yield Api.fetch('/v1/idol/all', {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const list = result.authorIdols;
      yield put({
        type: 'RESPONSE_IDOLS',
        list: list,
      });
    } else {
      yield setAppAlert('获取偶像列表数据失败,请尝试刷新页面！', null);
      // console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppAlert('网络错误，请检查网络后再试！', null);
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppAlert('未知错误，请刷新后再试！', null);
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchRequestIdols() {
  yield takeEvery('REQUEST_IDOLS', requestIdols);
}

function* commitIdol(action) {
  try {
    yield setAppLoading('正在获取偶像列表...');
    const token = yield getToken();
    const result = yield Api.fetch('/v1/idol/commit/' + action.id, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      yield setAppMessage('提交审核成功！');
    } else {
      yield setAppAlert('获取偶像列表数据失败,请尝试刷新页面！', null);
      // console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppAlert('网络错误，请检查网络后再试！', null);
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppAlert('未知错误，请刷新后再试！', null);
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchCommitIdols() {
  yield takeEvery('COMMIT_IDOL', commitIdol);
}

function* saveIdol(action) {
  try {
    yield setAppLoading('正在保存...');
    const token = yield getToken();
    const result = yield Api.fetch('/v1/idol/', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(action.idol)
    });
    if (result.error === 0) {
      yield setAppMessage('保存成功！');
    } else {
      yield setAppAlert('保存失败,请尝试刷新页面！', null);
      // console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppAlert('网络错误，请检查网络后再试！', null);
          break;

        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
          break;

        case AppErrorCode.InvalidParameter:
          // console.log('请求参数错误，请检查请求参数后再试！');
          break;

        case AppErrorCode.InvalidJson:
          // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
          break;

        case AppErrorCode.UnknownError:
          yield setAppAlert('未知错误，请刷新后再试！', null);
          break;

        default:
          break;
      }
    } else {
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchSaveIdol() {
  yield takeEvery('SAVE_IDOL', saveIdol);
}

export default function* projects() {
  yield fork(watchRequestIdols);
  yield fork(watchCommitIdols);
  yield fork(watchSaveIdol);
}


// WEBPACK FOOTER //
// ./src/Author/sagas/idols.js
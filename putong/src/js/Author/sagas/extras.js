import { fork, takeEvery, put, select } from 'redux-saga/effects';
import Api from '../../api/api';
import { setAppLoading, setAppAlert, setAppMessage } from './app';
import AppError, { AppErrorCode } from './AppError';
import { getSelectedExtra, validate, getErrors, getContent } from './editor';
import { buildExtra } from './editor-build';
import { getToken } from './user';

export function* getExtras() {
  return yield select(store => store.extras.list);
}

function* requestExtras(action) {
  try {
    const token = yield getToken();
    yield setAppLoading('正在获取番外列表...');
    const result = yield Api.fetch('/v1/card/find_cards?game_id=' + action.game_id + '&title=' + action.title + '&idol_id=' + action.idol + '&online_status=' + action.online + '&rarity=' + action.rarity, {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const extras = result.cards.map(c => ({ ...c, paragraphs: JSON.parse(c.paragraphs) }));
      yield put({ type: 'RESPONSE_EXTRAS', extras });
    } else {
      yield setAppMessage('error', '获取偶像数据失败,请重新再试！');
      // console.log(result);
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
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
          yield setAppMessage('error', '未知错误，请刷新后再试！');
          break;

        default:
          break;
      }
    } else {
      // console.log(e);
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchRequestExtras() {
  yield takeEvery('REQUEST_EXTRAS', requestExtras);
}

function* saveExtra(action) {
  try {
    yield setAppLoading('正在保存...');
    const token = yield getToken();
    const content = yield getContent();
    const result = yield Api.fetch('/v1/card/save', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ ...action.extra, roles: JSON.stringify(content.roles), paragraphs: JSON.stringify(action.extra.paragraphs) })
    });
    if (result.error === 0) {
      const extras = yield getExtras();
      const has = extras.find(ex => ex.uuid === action.extra.uuid);
      if (has) {
        for (let i = 0; i < extras.length; i++) {
          if (extras[i].uuid === action.extra.uuid) {
            extras[i] = { ...action.extra };
            break;
          }
        }
      } else {
        extras.push({ ...action.extra });
      }
      yield put({ type: 'UPDATE_EXTRAS', extras: [...extras] });
      yield setAppMessage('success', '保存成功！');
      return true;
    } else {
      yield setAppAlert('获取偶像列表数据失败,请尝试刷新页面！', null);
      return false;
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

function* watchSaveExtra() {
  yield takeEvery('SAVE_EXTRA', saveExtra);
}

function* commitExtra(action) {
  try {
    yield setAppLoading('正在检查错误...');
    yield validate();
    const extra = yield getSelectedExtra();
    const errors = yield getErrors();
    if (errors.find(err => err.extra.extra_uuid && err.extra.extra_uuid === extra.uuid)) {
      yield setAppAlert('发布番外失败: 该番外存在错误', null);
    } else {
      yield setAppLoading('正在编译...');
      const token = yield getToken();
      const content = yield getContent();
      const newextra = yield buildExtra(content, extra);
      const issave = yield saveExtra({ extra: newextra });
      if (issave) {
        yield setAppLoading('正在投稿...');
        const result = yield Api.fetch('/v1/card/commit/' + newextra.uuid, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": token }
        });
        if (result.error === 0) {
          yield setAppMessage('success', '投稿成功！');
        } else {
          yield setAppMessage('error', '投稿失败！');
          // console.log('发生了未知错误！');
        }
      } else {
        yield setAppMessage('error', '保存失败！');
      }
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

function* watchCommitExtra() {
  yield takeEvery('COMMIT_EXTRA', commitExtra);
}

function* previewExtra(action) {
  try {
    yield setAppLoading('正在检查错误...');
    yield validate();
    const extra = yield getSelectedExtra();
    const errors = yield getErrors();
    if (errors.find(err => err.extra.extra_uuid && err.extra.extra_uuid === extra.uuid)) {
      yield setAppAlert('预览发布失败: 该番外存在错误', null);
    } else {
      yield setAppLoading('正在编译...');
      const token = yield getToken();
      const content = yield getContent();
      const newextra = yield buildExtra(content, extra);
      const issave = yield saveExtra({ extra: newextra });
      if (issave) {
        yield setAppLoading('正在投稿...');
        const result = yield Api.fetch('/v1/card/proview/' + newextra.uuid, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": token }
        });
        if (result.error === 0) {
          yield setAppMessage('success', '预览发布成功！');
        } else {
          yield setAppMessage('error', '预览发布失败！');
          // console.log('发生了未知错误！');
        }
      } else {
        yield setAppMessage('error', '保存失败！');
      }
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

function* watchPreviewExtra() {
  yield takeEvery('PREVIEW_EXTRA', previewExtra);
}


function* deleteExtra(action) {
  try {
    yield setAppLoading('正在删除...');
    const token = yield getToken();
    const result = yield Api.fetch('/v1/card/del', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ uuid: action.uuid })
    });
    if (result.error === 0) {
      const extras = yield getExtras();
      const newextras = extras.filter(ex => ex.uuid !== action.uuid);
      yield put({ type: 'UPDATE_EXTRAS', extras: [...newextras] });
      yield setAppMessage('success', '删除成功！');
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

function* watchDeleteExtra() {
  yield takeEvery('DELETE_EXTRA', deleteExtra);
}

export default function* projects() {
  yield fork(watchRequestExtras);
  yield fork(watchDeleteExtra);
  yield fork(watchSaveExtra);
  yield fork(watchCommitExtra);
  yield fork(watchPreviewExtra);
}


// WEBPACK FOOTER //
// ./src/Author/sagas/extras.js
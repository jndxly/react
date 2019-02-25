import { fork, takeEvery, put, select } from 'redux-saga/effects';
import Api from '../../api/api';
import { setAppLoading, setAppMessage, setAppAlert } from './app';
import { getOutline, getContent } from './editor';
import AppError, { AppErrorCode } from './AppError';
import { getToken } from './user';

function* getList() {
  return yield select(store => store.projects.list);
}

function* getProject(id) {
  return yield select(store => store.projects.list.find(p => p.id === id));
}

function* requestProjects(action) {
  try {
    yield setAppLoading('正在获取剧本列表...');
    const token = yield getToken();
    const result = yield Api.fetch(`/myStory/list?author_id=${action.author_id}`, {
      method: "GET",

      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0 || result.code == 200) {
      const list = result.data ;
      yield put({
        type: 'RESPONSE_PROJECTS',
        list: list,
      });
    } else {
      yield setAppAlert('获取剧本列表数据失败,请尝试刷新页面！', null);
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


function* newProject(action) {
  try {
    yield setAppLoading('正在新建剧本...');
    const outline = yield getOutline();
    const content = yield getContent();
    const project = { ...outline, content: JSON.stringify(content), idols: JSON.stringify(outline.idols), tags: outline.tags.join(',') };
    delete project.id;
    project.author_id = 1;
    const token = yield getToken();
    const result = yield Api.fetch('/myStory/add', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(project)
    });
    if (result.error === 0) {
      project.id = result.id;
      const list = yield getList();
      yield put({ type: 'UPDATE_PROJECTS', list: [...list, project] });
      project.content = '';
      project.script = '';
      project.idols = JSON.parse(project.idols);
      yield put({ type: 'UPDATE_PROJECT_OUTLINE', outline: project });
      action.cback();
      yield setAppMessage('创建新剧本【' + project.title + '】成功！');
    } else {
      yield setAppMessage('创建失败请重新尝试！');
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

function* deleteProject(action) {
  try {
    const project = yield getProject(action.id);
    //判断是否已发布
    if (project.status === 2) {
      yield setAppAlert('该剧本已经发布，不允许删除！', null);
    } else {
      const token = yield getToken();
      yield setAppLoading('正在删除剧本...');
      const result = yield Api.fetch('/v1/project/del', {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify({ project_id: action.id })
      });
      if (result.error === 0) {
        let list = yield getList();
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === action.id) {
            list.splice(i, 1);
            break;
          }
        }
        yield put({
          type: 'UPDATE_PROJECTS',
          list: [...list],
        });
        yield setAppMessage('删除了【' + project.title + '】的剧本内容！');
      } else if (result.error === 1302) {
        yield setAppMessage('删除失败，该剧本已经发布！');
      } else {
        yield setAppMessage('删除失败，请重新尝试！');
        // console.log('发生了未知错误！');
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

function* watchRequestProjects() {
  yield takeEvery('REQUEST_PROJECTS', requestProjects);
}

function* watchNewProject() {
  yield takeEvery('NEW_PROJECT', newProject);
}

function* watchDeleteProject() {
  yield takeEvery('DELETE_PROJECT', deleteProject);
}


export default function* projects() {
  yield fork(watchRequestProjects);
  yield fork(watchNewProject);
  yield fork(watchDeleteProject);
}


// WEBPACK FOOTER //
// ./src/Author/sagas/projects.js
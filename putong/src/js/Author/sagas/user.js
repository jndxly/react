import { fork, put, take, takeEvery, select } from 'redux-saga/effects';
import Api from '../../api/api';
import { setAppLoading, setAppMessage, setAppAlert, setAppConfirm } from './app';
import AppError, { AppErrorCode } from './AppError';
import { Base64 } from 'js-base64';
import md5 from 'js-md5';


export function* getToken() {
  return yield select(store => store.user.token);
}

function* getUser() {
  return yield select(store => store.user);
}

function* getphonemsgCookie() {
  return yield select(store => store.user.phonemsg_cookie);
}

function* sendphonemsgLogin(action) {
  try {
    const result = yield Api.fetch('/v1/auth/sendSMS', {
      method: 'POST',
      header: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: action.phone })
    });
    if (result.error === 0) {
      yield put({ type: 'SET_PHONEMSG_COOKIE', phonemsg_cookie: result.cookie });
      yield setAppMessage('success', '发送验证码成功，请注意查收！');
    } else if (result.error === 1026) {
      // console.log('短信渠道可能欠费，请检查是否需要充值！');
      yield setAppMessage('error', '短信发送失败，重新尝试或使用其他登录方式！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('error', '网络错误，请检查网络后再试！');
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
      // console.log('发生了未知错误！');
    }
  }
}

// function* sendphonemsgBind(action) {
//   try {
//     const token = yield getToken();
//     const result = yield Api.fetch('/v1/author/phone/verification-code', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Authorization": token },
//       body: JSON.stringify({ phone: action.phone })
//     });
//     if (result.error === 0) {
//       yield put({ type: 'SET_PHONEMSG_COOKIE', phonemsg_cookie: result.cookie });
//       yield setAppMessage('success', '发送验证码成功，请注意查收！');
//     } else if (result.error === 1026) {
//       // console.log('短信渠道可能欠费，请检查是否需要充值！');
//       yield setAppMessage('error', '短信发送失败，重新尝试或使用其他登录方式！');
//     } else if (result.error === 1024) {
//       yield setAppConfirm('该手机账户已存在，请用手机号登录，或更换手机号重新再试！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-Phone' });
//       return null
//     }
//   } catch (e) {
//     if (e instanceof AppError) {
//       switch (e.code) {
//         case AppErrorCode.NetworkError:
//           yield setAppMessage('error', '网络错误，请检查网络后再试！');
//           break;

//         case AppErrorCode.InvalidToken:
//           yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
//           break;

//         case AppErrorCode.InvalidParameter:
//           // console.log('请求参数错误，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.InvalidJson:
//           // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.UnknownError:
//           yield setAppMessage('error', '未知错误，请刷新后再试！');
//           break;

//         default:
//           break;
//       }
//     } else {
//       // console.log('发生了未知错误！');
//     }
//   } finally {
//     yield setAppLoading(null);
//   }
// }

// function* sendphonemsgPassword(action) {
//   try {
//     const token = yield getToken();
//     const result = yield Api.fetch('/v1/author/password/verification-code', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Authorization": token },
//       body: ''
//     });
//     if (result.error === 0) {
//       yield put({ type: 'SET_PHONEMSG_COOKIE', phonemsg_cookie: result.cookie });
//       yield setAppMessage('success', '发送验证码成功，请注意查收！');
//     } else if (result.error === 1026) {
//       // console.log('短信渠道可能欠费，请检查是否需要充值！');
//       yield setAppMessage('error', '短信发送失败！');
//     }
//   } catch (e) {
//     if (e instanceof AppError) {
//       switch (e.code) {
//         case AppErrorCode.NetworkError:
//           yield setAppMessage('error', '网络错误，请检查网络后再试！');
//           break;

//         case AppErrorCode.InvalidToken:
//           yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
//           break;

//         case AppErrorCode.InvalidParameter:
//           // console.log('请求参数错误，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.InvalidJson:
//           // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.UnknownError:
//           yield setAppMessage('error', '未知错误，请刷新后再试！');
//           break;

//         default:
//           break;
//       }
//     } else {
//       // console.log('发生了未知错误！');
//     }
//   } finally {
//     yield setAppLoading(null);
//   }
// }

function* watchSendPhonemsg() {
  yield takeEvery('SEND_PHONEMSG_LOGIN', sendphonemsgLogin);
  // yield takeEvery('SEND_PHONEMSG_BIND', sendphonemsgBind);
  // yield takeEvery('SEND_PHONEMSG_PASSWORD', sendphonemsgPassword);
}

// function* checkOldPhone(action) {
//   try {
//     const token = yield getToken();
//     const cookie = yield getphonemsgCookie();
//     const result = yield Api.fetch('/v1/author/phone/verify-old', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Authorization": token },
//       body: JSON.stringify({
//         cookie: cookie,
//         verificationCode: action.code
//       })
//     });
//     if (result.error === 0) {
//       yield setAppMessage('success', '验证成功！');
//       yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-Account-NewPhone' });
//     } else if (result.error === 1025) {
//       yield setAppMessage('error', '验证码错误！');
//       return null;
//     }
//   } catch (e) {
//     if (e instanceof AppError) {
//       switch (e.code) {
//         case AppErrorCode.NetworkError:
//           yield setAppMessage('error', '网络错误，请检查网络后再试！');
//           break;

//         case AppErrorCode.InvalidToken:
//           yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
//           break;

//         case AppErrorCode.InvalidParameter:
//           // console.log('请求参数错误，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.InvalidJson:
//           // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.UnknownError:
//           yield setAppMessage('error', '未知错误，请刷新后再试！');
//           break;

//         default:
//           break;
//       }
//     } else {
//       // console.log('发生了未知错误！');
//     }
//   } finally {
//     yield setAppLoading(null);
//   }
// }

// function* watchCheckOldPhone() {
//   yield takeEvery('CHECK_OLDPHONE', checkOldPhone);
// }

// function* newphoneBind(action) {
//   try {
//     const token = yield getToken();
//     const cookie = yield getphonemsgCookie();
//     const result = yield Api.fetch('/v1/author/phone/verify', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Authorization": token },
//       body: JSON.stringify({
//         cookie: cookie,
//         verificationCode: action.code
//       })
//     });
//     if (result.error === 0) {
//       yield setAppMessage('success', '绑定成功！');
//       yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List-Production' });
//     } else if (result.error === 1025) {
//       yield setAppMessage('error', '验证码错误！');
//       return null;
//     } else if (result.error === 1024) {
//       yield setAppConfirm('该手机账户已存在，请用手机号登录，或更换手机号重新再试！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-Phone' });
//       return null;
//     } else if (result.error === 1027) {
//       yield setAppMessage('error', '更换的手机号码与原手机号码相同！');
//     }
//   } catch (e) {
//     if (e instanceof AppError) {
//       switch (e.code) {
//         case AppErrorCode.NetworkError:
//           yield setAppMessage('error', '网络错误，请检查网络后再试！');
//           break;

//         case AppErrorCode.InvalidToken:
//           yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
//           break;

//         case AppErrorCode.InvalidParameter:
//           // console.log('请求参数错误，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.InvalidJson:
//           // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.UnknownError:
//           yield setAppMessage('error', '未知错误，请刷新后再试！');
//           break;

//         default:
//           break;
//       }
//     } else {
//       // console.log('发生了未知错误！');
//     }
//   } finally {
//     yield setAppLoading(null);
//   }
// }

// function* watchnewphoneBind() {
//   yield takeEvery('NEW_PHONE_BIND', newphoneBind);
// }

function* phoneBind(action) {
  try {
    const token = yield getToken();
    const cookie = yield getphonemsgCookie();
    const result = yield Api.fetch('/v1/author/phone/verify', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({
        cookie: cookie,
        verificationCode: action.code
      })
    });
    if (result.error === 0) {
      yield setAppMessage('success', '绑定成功！');
      const user = yield getUser();
      yield setAppConfirm('是否要保存登录信息？若非个人设备，请勿保存！', { type: 'SAVE_LOACL', user });
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List' });
    } else if (result.error === 1025) {
      yield put({ type: 'SET_LOGIN_ERROR', loginerror: '验证码错误！' });
      return null;
    } else if (result.error === 1024) {
      yield setAppConfirm('该手机账户已存在，请用手机号登录，或更换手机号重新再试！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-Phone' });
      return null;
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
      // console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

// function* changePassword(action) {
//   try {
//     const token = yield getToken();
//     const cookie = yield getphonemsgCookie();
//     const result = yield Api.fetch('/v1/author/password/change', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json", "Authorization": token },
//       body: JSON.stringify({
//         cookie: cookie,
//         password: md5(action.pwd),
//         verificationCode: action.code
//       })
//     });
//     if (result.error === 0) {
//       yield setAppMessage('success', '密码设置成功！');
//       yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-Author-Show' });
//     } else if (result.error === 1025) {
//       yield put({ type: 'SET_LOGIN_ERROR', loginerror: '验证码错误！' });
//       return null;
//     }
//   } catch (e) {
//     if (e instanceof AppError) {
//       switch (e.code) {
//         case AppErrorCode.NetworkError:
//           yield setAppMessage('error', '网络错误，请检查网络后再试！');
//           break;

//         case AppErrorCode.InvalidToken:
//           yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
//           break;

//         case AppErrorCode.InvalidParameter:
//           // console.log('请求参数错误，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.InvalidJson:
//           // console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
//           break;

//         case AppErrorCode.UnknownError:
//           yield setAppMessage('error', '未知错误，请刷新后再试！');
//           break;

//         default:
//           break;
//       }
//     } else {
//       // console.log('发生了未知错误！');
//     }
//   } finally {
//     yield setAppLoading(null);
//   }
// }

function* watchphoneBind() {
  yield takeEvery('PHONE_BIND', phoneBind);
}

// function* watchchangePassword() {
//   yield takeEvery('CHANGE_PASSWORD', changePassword);
// }

function* phoneLogin(action) {
  const cookie = yield getphonemsgCookie();
  const result = yield Api.fetch('/v1/auth/loginSMSVerify', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_data: "string",
      cookie: cookie,
      domain: "phone",
      server_id: "string",
      uin: "string",
      verificationCode: action.code
    })
  });
  if (result.error === 0) {
    yield setAppMessage('success', '登陆成功！');
    let author_id = 1;
    if(action.params.userName == 'iqiyi1'){
      author_id = 1;
    }
    else if(action.params.userName == 'iqiyi2'){
        author_id =2 ;
    }
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
        author_id : author_id,
      email: result.email || '',
      brief: result.brief || '',
    }
    sessionStorage.setItem('user', Base64.encode(JSON.stringify(user)));

    yield put({ type: 'SET_LOGIN_AUTHORID', author_id });

    return user;
  } else if (result.error === 1025) {
    yield put({ type: 'SET_LOGIN_ERROR', loginerror: '验证码错误！' });
    return null;
  }
}

function* accountLogin(phone, pwd) {
  const result = yield Api.fetch('/v1/auth/loginPasswordVerify', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_data: "string",
      phone: phone,
      password: md5(pwd),
      domain: "account",
      server_id: "string",
      uin: "string",
    })
  });
  if (result.error === 0) {
    yield setAppMessage('success', '登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
      email: result.email || '',
      brief: result.brief || '',
    }
    sessionStorage.setItem('user', Base64.encode(JSON.stringify(user)));
    return user;
  } else if (result.error === 1230) {
    yield put({ type: 'SET_LOGIN_ERROR', loginerror: '密码错误！' });
    return null;
  }
}

function* wxLogin(wxcode) {
  const result = yield Api.fetch('/v1/auth/login', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "editor_weixin",
      ticket: wxcode,
      server_id: "0",
      extra: "",
      app_data: ""
    })
  });
  if (result.error === 0) {
    yield setAppMessage('success', '登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
      email: result.email || '',
      brief: result.brief || '',
    }
    sessionStorage.setItem('user', Base64.encode(JSON.stringify(user)));
    return user;
  } else {
    yield setAppAlert('微信登录失败，请重新扫码登录！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-WeiXin' });
    return null
  }
}

function* qqLogin(qqcode) {
  const result = yield Api.fetch('/v1/auth/login', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "editor_qq",
      uin: "",
      ticket: qqcode,
      server_id: "0",
      extra: "",
      app_data: ""
    })
  });
  if (result.error === 0) {
    yield setAppMessage('success', '登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
      email: result.email || '',
      brief: result.brief || '',
    }
    sessionStorage.setItem('user', Base64.encode(JSON.stringify(user)));
    return user;
  } else {
    yield setAppAlert('qq登录失败，请重新扫码登录！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-QQ' });
    return null
  }
}

function* watchLogin() {
  while (true) {
    try {
      const action = yield take(['LOGIN_WITH_PHONE', 'LOGIN_WITH_WEIXIN', 'LOGIN_WITH_QQ', 'LOGIN_WITH_SESSION', 'LOGIN_WITH_ACCOUNT']);
      let user = null;
      yield setAppLoading('正在登录......');
      switch (action.type) {
        case 'LOGIN_WITH_PHONE':
          user = yield phoneLogin(action);
          break;

        case 'LOGIN_WITH_ACCOUNT':
          user = yield accountLogin(action.phone, action.pwd);
          break;

        case 'LOGIN_WITH_WEIXIN':
          user = yield wxLogin(action.wxcode);
          break;

        case 'LOGIN_WITH_QQ':
          user = yield qqLogin(action.qqcode);
          break;

        case 'LOGIN_WITH_SESSION':
          user = action.user;
          break;

        default:
          break;
      }

      if (user) {
        yield put({
          type: 'LOGGED_IN', user
        });
        if (user.phone === '') {
          yield setAppMessage('normal', '为了您的账号安全，需要绑定手机！');
          yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Login-PhoneBind' });
        } else {
          if (action.type !== 'LOGIN_WITH_SESSION') {
            yield setAppConfirm('是否要保存登录信息？若非个人设备，请勿保存！', { type: 'SAVE_LOACL', user });
          }
            yield put({ type: 'SET_LOGIN_AUTHORID', author_id: user.author_id });
          yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List-Production' });
          yield put({ type: 'REQUEST_MSGS', index: 0, pagecapacity: 15 });
          yield put({ type: 'REQUEST_NOTICES', index: 0, pagecapacity: 15 });
        }
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
        // console.log('发生了未知错误！');
      }
    } finally {
      yield setAppLoading(null);
    }
  }
}

function saveLocal(action) {
  localStorage.setItem('user', Base64.encode(JSON.stringify(action.user)));
}

function* watchSaveLocal() {
  yield takeEvery('SAVE_LOACL', saveLocal);
}

function* updateUser(action) {
  try {
    yield setAppLoading('正在修改资料.....');
    const token = yield getToken();
    const result = yield Api.fetch('/v1/author/author_info', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(action.user)
    });
    if (result.error === 0) {
      yield setAppMessage('success', '资料修改成功！');
      yield put({ type: 'UPDATE_USER_INFO', user: action.user });
      sessionStorage.setItem('user', Base64.encode(JSON.stringify(action.user)));
      if (sessionStorage.getItem('user') !== null) {
        localStorage.setItem('user', Base64.encode(JSON.stringify(action.user)));
      }
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-Author-Show' });
    } else if (result.error === 1225) {
      yield setAppMessage('error', '资料修改失败，笔名只能30天修改一次！');
    } else if (result.error === 1226) {
      yield setAppMessage('error', '资料修改失败，该笔名一已存在！');
    } else {
      yield setAppMessage('error', '资料修改失败，请稍后重新尝试！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息失效，请重新登录！', { type: 'LOGOUT' });
          break;

        default:
          break;
      }
    } else {
      yield setAppMessage('error', '未知错误，请重新尝试！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchUpdateUser() {
  yield takeEvery('UPDATE_USER', updateUser);
}

function* watchLogout() {
  yield takeEvery('LOGOUT', logout);
}

function* logout() {
  sessionStorage.setItem('user', '');
  localStorage.setItem('user', '');
  yield put({ type: 'LOGGED_OUT' });
  yield put({ type: 'INIT_PROJECTS' });
  yield put({ type: 'CLEAR_EDITOR' });
  yield put({ type: 'INIT_APP' });
  window.location.href = window.location.href.replace(window.location.search, '');
}

export default function* user() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchphoneBind);
  // yield fork(watchchangePassword);
  // yield fork(watchnewphoneBind);
  yield fork(watchUpdateUser);
  yield fork(watchSendPhonemsg);
  // yield fork(watchCheckOldPhone);
  yield fork(watchSaveLocal);
}


// WEBPACK FOOTER //
// ./src/Author/sagas/user.js
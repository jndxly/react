const initialState = {
  id: null,
  name: '',
  profile: '',
  qq: '',
  token: '',
  phone: '',
  phonemsg_cookie: '',
  union: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'SET_PHONEMSG_COOKIE':
      return { ...state, phonemsg_cookie: action.phonemsg_cookie }

    case 'LOGGED_IN':
      return { ...action.user };

    case 'LOGGED_OUT':
      return initialState;

    case 'UPDATE_USER':
      return { ...action.user };

    default:
      return state;
  }
}


// WEBPACK FOOTER //
// ./src/Author/reducers/user.js
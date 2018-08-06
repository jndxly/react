const initialState = {
    isLoading: false,
    error: '',
    data: {},
}

export function h5Games1(state = initialState, action) {
    switch (action.type) {
        case 'H5_GAMES_REQUESTING':
            return {...state, isLoading: action.data}

        case 'H5_GAMES_REQUEST_ERROR':
            return {...state, error: action.data}

        case 'H5_GAMES':
            return {...state, data: action.data}

        default:
            return state
    }
}
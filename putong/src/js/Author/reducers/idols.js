const initialState = {
    list: [],
};

export default function idols(state = initialState, action) {
    switch (action.type) {
        case 'RESPONSE_IDOLS':
            return {
                ...state,
                list: action.list
            };

        case 'UPDATE_IDOLS':
            return {
                ...state,
                list: action.list
            };

        case 'INIT_IDOLS':
            return initialState;

        default:
            return state;
    }
}


// WEBPACK FOOTER //
// ./src/Author/reducers/idols.js
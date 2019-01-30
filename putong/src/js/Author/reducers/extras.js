const initialState = {
    list: [],
};

export default function extras(state = initialState, action) {
    switch (action.type) {
        case 'RESPONSE_EXTRAS':
            return {
                ...state,
                list: action.extras
            };

        case 'UPDATE_EXTRAS':
            return {
                ...state,
                list: action.extras
            };

        case 'INIT_EXTRAS':
            return initialState;

        default:
            return state;
    }
}


// WEBPACK FOOTER //
// ./src/Author/reducers/extras.js
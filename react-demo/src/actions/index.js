import { ajax } from '../util' 

export const h5GamesRequesting = (data) => ({type: 'H5_GAMES_REQUESTING', data})
export const h5GamesRequestError = (data) => ({type: 'H5_GAMES_REQUEST_ERROR', data})
export const h5Games1 = (data) => ({type: 'H5_GAMES', data})

export function fetchH5Games() {
    return (dispatch) => {
        dispatch(h5GamesRequesting(true))
        const url = '/pcacenter/position/plist/h5'
        ajax(url, 'GET').then(res => {
            if (res.code === 200) { 
                dispatch(h5Games1(res.data))
            } else {
                dispatch(h5GamesRequestError(res.msg))
            }
            dispatch(h5GamesRequesting(false))
        })
    }
}
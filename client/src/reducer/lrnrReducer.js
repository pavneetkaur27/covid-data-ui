const initialState = {
    loading : false
}

export default function (state = initialState, action) {
    switch (action.type) {

        case 'START_LOADER' : {
            return {...state,
                loading : true
            }
        }
        
        case 'STOP_LOADER' : {
            return {...state,
                loading : false
            }
        }

     
        default:
            return state;
    }
}
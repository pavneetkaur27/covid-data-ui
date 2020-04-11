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

        case 'FETCH_COVID_COUNTRIES' : {
            return {...state,
                covidcountries : action.payload.covidcountries
            }
        }

        case 'FETCH_COVID_DATA' : {
            return {...state,
                coviddata : action.payload.coviddata
            }
        }
     
        default:
            return state;
    }
}
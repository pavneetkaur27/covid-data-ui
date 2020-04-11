import axios from "axios";
import {API_ENDPOINT} from '../constants';


const startLoader = (dispatch,a)=>{
    return dispatch({ type: "START_LOADER" });
}
  
const stopLoader = (dispatch)=>{
    return dispatch({ type: "STOP_LOADER" });
}

export const fetchCovidCountries = () => dispatch => {
  var requestObj = {
    method: 'POST',
    url: API_ENDPOINT + '/covidreport/gt_cvd_cntry',
  };
  startLoader(dispatch,1);
  
  axios(requestObj).then((res) => {
    stopLoader(dispatch);
    if (res ) {
      dispatch({
        type: "FETCH_COVID_COUNTRIES",
        payload: {
            covidcountries : res.data.data.covid_countries
        }
      });
    }
  })
    .catch((err) => {
      var err_msg = "Something went wrong";
      if (err.response && err.response.statusText) {
        err_msg = err.response.statusText;
      }
      if(err.response && err.response.data && err.response.data.message){
        err_msg = err.response.data.message;
      }
      
      stopLoader(dispatch);
      console.log(err_msg);
    })
}

export const fetchCovidData = (data) => dispatch => {
  // console.log(data.country_id);
    var requestObj = {
      method: 'POST',
      data: {
        cntry : data.country_id 
      },
      url: API_ENDPOINT + '/covidreport/gt_cvd_data',
    };
    startLoader(dispatch,1);
    
    axios(requestObj).then((res) => {
      if (res ) {
        dispatch({
          type: "FETCH_COVID_DATA",
          payload: {
              coviddata : res.data.data
          }
      });
      }
      stopLoader(dispatch);
    })
      .catch((err) => {
        var err_msg = "Something went wrong";
        if (err.response && err.response.statusText) {
          err_msg = err.response.statusText;
        }
        if(err.response && err.response.data && err.response.data.message){
          err_msg = err.response.data.message;
        }
       
        stopLoader(dispatch);
        console.log(err_msg);
      })
}

export const refreshCovidCases = () => dispatch =>{
  var requestObj = {
    method: 'POST',
    url: API_ENDPOINT + '/covidreport/refsh_data',
  };
  startLoader(dispatch,1);
  
  return axios(requestObj).then((res) => {
    stopLoader(dispatch);
    alert("Data has been updated!");
    return res;
  })
  .catch((err) => {
    var err_msg = "Something went wrong";
    if (err.response && err.response.statusText) {
      err_msg = err.response.statusText;
    }
    if(err.response && err.response.data && err.response.data.message){
      err_msg = err.response.data.message;
    }
    
    stopLoader(dispatch);
    console.log(err_msg);
  })
}
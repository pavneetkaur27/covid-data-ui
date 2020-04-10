import axios from "axios";
import {API_ENDPOINT} from '../constants';


const startLoader = (dispatch,a)=>{
    return dispatch({ type: "START_LOADER" });
}
  
const stopLoader = (dispatch)=>{
    return dispatch({ type: "STOP_LOADER" });
}


export const fetchCovidData = (eml , pass, cpass) => dispatch => {
  
    var requestObj = {
      method: 'POST',
    //   data: {
    //     eml   : eml,
    //     pwd  : pass,
    //     cpwd : cpass 
    //   },
      url: API_ENDPOINT + '/covidreport/gt_cvd_data',
    };
    startLoader(dispatch,1);
    
    axios(requestObj).then((response) => {
      stopLoader(dispatch);
      if (response ) {
      console.log("hlo");
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
       
      })
  }
  
import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import {fetchCovidData} from '../actions/covidAction'

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
     }
  }

  componentDidMount(){
    this.props.fetchCovidData();
  }

  render(){
    return (
      <div className="main-body">
test
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      // : state.lrnrReducer,
  }
}

const mapDispatchToProps = {fetchCovidData};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dashboard));
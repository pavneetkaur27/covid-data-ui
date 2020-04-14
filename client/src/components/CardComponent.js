import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import {fetchCovidData} from '../actions/covidAction';
import DropdownComponent from './DropdownComponent';
import PictorialChartComponent  from './PictorialChartComponent';

class CardComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
     }
  }

//   componentDidMount(){
//     this.props.fetchCovidData();
//   }

  render(){
    return (
        <div>
            <div className="covid-ui-card-contaniner">
                <DropdownComponent />
                <PictorialChartComponent />
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      
  }
}

const mapDispatchToProps = {fetchCovidData};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CardComponent));
import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import {fetchCovidCountries,fetchCovidData} from '../actions/covidAction';
import {Bar, ComposedChart,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    }
  }

  render(){
      console.log(this.props);
      if(this.props.covidPanel.coviddata && this.props.covidPanel.coviddata.totalcovidcases){
        return (
            <div>
                <div className="row no-margin no-padding">
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        {this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases ? this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases : 0}
                        <div className="card-info-title">Confirmed</div>
                    </div>
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        {(this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases && this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-2].confirmed_cases )? (this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases - this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-2].confirmed_cases ): (this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases ? this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases : 0)}
                        <div  className="card-info-title">New Confirmed</div>
                    </div>
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        {this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].death_cases ? this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].death_cases : 0}
                        <div  className="card-info-title">Deaths</div>
                    </div>
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        {this.props.covidPanel.coviddata.totalcountries}
                        <div  className="card-info-title">Countries</div>
                    </div>
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        {(this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases && this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-2].confirmed_cases )? ( (( ( this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases - this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-2].confirmed_cases )/this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases)* 100).toFixed(2)) + '%':0 + '%'}
                        <div  className="card-info-title">New Confirmed Growth Rate</div>
                    </div>
                    <div className="col-sm-4  no-padding text-align-center card-info-section">
                        { (this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases && this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].death_cases ) ? (( (this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].death_cases / this.props.covidPanel.coviddata.totalcovidcases[this.props.covidPanel.coviddata.totalcovidcases.length-1].confirmed_cases )*100).toFixed(2))+ '%' : 0 + '%'}
                        <div  className="card-info-title">Mortality Rate</div>
                    </div>
                </div>
                <div style={{marginTop:40}}>
                    <ComposedChart width={1000} height={250} data={this.props.covidPanel.coviddata.totalcovidcases}>
                    <XAxis dataKey="c_date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
        
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar yAxisId="right" dataKey="death_cases" barSize={20} fill="rgb(169, 52, 57)" />
                    <Line yAxisId="left" type="monotone" dataKey="confirmed_cases" stroke="#ff7300" />
                    </ComposedChart>
                </div>
            </div>
          );
      }else{
          return (
              <div></div>
          )
      }
    
  }
}

const mapStateToProps = state => {
  return {
      covidPanel : state.covidReducer
  }
}

const mapDispatchToProps = {fetchCovidCountries,fetchCovidData};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Dashboard));
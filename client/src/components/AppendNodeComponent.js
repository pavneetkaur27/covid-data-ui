import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '../assests/addicon.png';
import DropDownIcon from '../assests/dropdown-arrow.svg';

class AppendNodeComponent extends Component {
  constructor(props){
    super(props);
   
  }

  render(){
    // console.log(this.props);
    return (
      <div className={["sidebar-nodes", this.props.parent_id == null ? ' ': 'padding-left'].join(' ')} key={this.props.node._id} > 
        <div >
          <div className={["container-nodes-head" ]} >
            {this.props.node.is_leaf ? 
              <div className="text-ellipsis">
                {this.props.node.nodename}
              </div>
              : 
              <div style={{display:'flex',alignItems:'center'}} >
                <img onClick={() => this.props.fetchItem(this.props.node)} className="container-nodes-dropdown-arrow"   src={DropDownIcon}/>
                <div className="text-ellipsis">{this.props.node.nodename}</div>
                <Tooltip title="Add Item" ><img onClick={() => this.props.addItem(false,this.props.node._id)} style={{height:16,marginLeft:'auto'}} className= " siderbar-nodes-icon-style" src={AddIcon} /></Tooltip>
              </div> 
            }
          </div>
          {
            this.props.list ?  this.props.list.map((node,index) => {
                var current_parent_id = this.props.node._id;
                if((node.parent_id != current_parent_id )  ){
                   return (null)
                }else{ 
                    return(
                      <AppendNodeComponent key={node._id}  parent_id={node.parent_id} node={node} list={this.props.list} fetchItem={this.props.fetchItem} addItem={this.props.addItem}>
                      </AppendNodeComponent>       
                    );
                }
            }) : null
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    lrnrpanel : state.lrnrReducer
  }
}

const mapDispatchToProps = {};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppendNodeComponent));
import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Divider } from '@material-ui/core';
import InvitePersonIcon from '../assests/lrnrinviteuser.svg';
import ProfilePic from '../assests/profilepic.svg';

class TopRightNavBar extends Component {
  constructor(props){
    super(props);
    this.state = { 
      openMenuBar : null
    }
  }


  toggleMenubar(event){
    this.setState({
      openMenuBar: event.currentTarget,
    })
  }

  handleClose = () =>{
    this.setState({
        openMenuBar : null
    })
  }

  render(){
    return (
      <div  className="center-all float-right">
        {/* Point no 11 covered */}
        <div>
          <img className="invite-person-icon-style" src={InvitePersonIcon} />
          <span className="invite-txt-style">INVITE TEAM MEMBER</span>
        </div>

        {/* Point no 12 covered */}
        <div>
          <div className="org-dashheader-logo-style">
            <img className="profile-pic-style"   onClick={(e) => this.toggleMenubar(e)} src={ProfilePic}></img>  
          </div>
          <Menu
              id = 'dashboard-menu'
              anchorEl={this.state.openMenuBar}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              // elevation={0}
              getContentAnchorEl={null}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
          }}
              open={Boolean(this.state.openMenuBar)}
              onClose={this.handleClose}
              className="lrnr-menubar"
          >
              <MenuItem  className="lrnr-menuitem" >Profile</MenuItem>
              <MenuItem  className="lrnr-menuitem">Company Profile</MenuItem>
              <Divider/>
              <MenuItem  className="lrnr-menuitem">Logout</MenuItem>
          </Menu>  
        </div>

      </div>
    );
  }
}

export default TopRightNavBar;
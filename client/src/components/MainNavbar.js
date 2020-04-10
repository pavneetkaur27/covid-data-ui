import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import EditorContent from './EditorContent';
import SideBarNodes from './SideBarNodes';
import TopRightNavBar from './TopRightNavBar';
import SidebarIcon from '../assests/sidebaricon.svg';
import ItemSwitchComponent from './ItemSwitchComponent';
import RightPanel from './RightPanel';

const drawerWidth = 340;

const useStyles = makeStyles((theme) => ({
 appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    cursor:'pointer',
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
 
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },

  rightBody: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function MainNavbar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false); // useState hook to open Hamburger Menu

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="navbar-container">
      <CssBaseline />
      <AppBar
        position="fixed" 
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
        <div className="row no-padding no-margin width-100 center-all" >

          {/* Point no 1 covered */}
          <div className="col-sm-2 col-2 no-padding no-margin"> 
            <img src={SidebarIcon}  aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)} />
          </div>
          {/* Dropdown content */}
          <div className="col-sm-10 col-10 no-padding no-margin">
            <TopRightNavBar />
          </div>
        </div>
        </Toolbar>
      </AppBar>
  
      {/*  Sidebar */}

      <Drawer
        className="drawer"
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper:"drawerPaper",
        }}
      >
         {/* Component to switch between different Items */}
          <ItemSwitchComponent />       

          {/* SideBar Nodes */}
          <div className="sidebar-border">
            <SideBarNodes handleDrawerClose={handleDrawerClose} />
          </div>

      </Drawer>

      {/* Right panel containing text content  */}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
          <div className={classes.rightBody} />
        {/* content */}
          <RightPanel />
        
      </main>
    </div>
  );
}

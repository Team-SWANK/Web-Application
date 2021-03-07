import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
//appbar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link as RouterLink} from 'react-router-dom';
//drawer
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExtensionIcon from '@material-ui/icons/Extension';
import InfoIcon from '@material-ui/icons/Info';
//general
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root : {
    display: 'flex'
  },
  appBar : {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton : {
    marginRight: theme
  },
  title: {
    flexGrow: 1,
  },
  drawer : {
    width : drawerWidth,
    flexShrink: 0,
  },
  drawerMobile : {
    overflowX: 'hidden',
    width : theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')] : {
      width: theme.spacing(9) + 1,
    }
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }
}));

function Base(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [collapseEncounter, setCollapseEncounter] = React.useState(false);

  const toggleCollapseEncounter = () => {
    setCollapseEncounter(!collapseEncounter);
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const closeButton = (
    <div className={classes.toolbar}>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </div>
  );

  const drawer = (
    <div>
      {mdDown ? closeButton : <div className={classes.toolbar} />}
      <List component="nav">
        <ListItem button component={RouterLink} to='/' onClick={handleDrawerClose}>
          <ListItemIcon><HomeRoundedIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <Divider />
        <ListItem button component={RouterLink} to='/dev' onClick={handleDrawerClose}>
          <ListItemIcon><ExtensionIcon /></ListItemIcon>
          <ListItemText primary="Chrome Extension" />
        </ListItem>
        <Divider />
        <ListItem button component={RouterLink} to='/learn-more' onClick={handleDrawerClose}>
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="Learn More" />
        </ListItem>
        <Divider />
      </List>
    </div>
  );
  

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <Hidden lgUp>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h5" className={classes.title}>
            PhotoSense
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Show a permanent drawer hidden from mobile view */}
      <Hidden mdDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
        { drawer }
        </Drawer>
      </Hidden>

      {/* Show a temporary drawer hidden from desktop view */}
      <Hidden lgUp>
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawer,
          }}
          anchor="left"
          open={open}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <main className={classes.content}>
        <div className={classes.toolbar}/>
      </main>

    </div>
  )
}

export default Base
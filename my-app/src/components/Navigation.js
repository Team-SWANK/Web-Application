import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
//appbar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';
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
import HelpIcon from '@material-ui/icons/Help';
//general
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Routes from '../routes/routes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root : {
    display: 'flex'
  },
  appBar : {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbarMargins: {
    marginLeft: "5px",
    marginBottom: "10px",
    alignItems: 'flex-end'
  },
  menuButton : {
    marginRight: "10px"
  },
  title: {
    marginRight: "20px",
    color: theme.palette.text.primary,
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

function Navigation(props) {
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
        <ListItem button component={RouterLink} to='/about' onClick={handleDrawerClose}>
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <Divider />
        <ListItem button component={RouterLink} to='/learn-more' onClick={handleDrawerClose}>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary="How to Use" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleDrawerClose}>
          <a className={classes.title} href='https://chrome.google.com/webstore/detail/photosense/fegjlpljbejgogiglnhidpjjokeemblb'>
          <ListItemIcon><ExtensionIcon /></ListItemIcon>
          <ListItemText primary="Chrome Extension" />
          </a>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
  

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar className={classes.toolbarMargins}>
          <Hidden lgUp>
            <IconButton 
              edge="start" 
              className={classes.menuButton} 
              color="inherit" 
              aria-label="menu" 
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography component={RouterLink} to='/' variant="h4" className={classes.title}>
            PhotoSense
          </Typography>
          <Hidden mdDown>
            <Typography variant="h6" component={RouterLink} to='/about' className={classes.title}>About</Typography>
            <Typography variant="h6" component={RouterLink} to='/learn-more' className={classes.title}>How to Use</Typography>
            <Typography variant="h6" className={classes.title}>
              <Link className={classes.title} href='https://chrome.google.com/webstore/detail/photosense/fegjlpljbejgogiglnhidpjjokeemblb'>
                Chrome Extension
              </Link>
            </Typography>
          </Hidden>
        </Toolbar>
      </AppBar>

      {/* Show a temporary drawer hidden for all displays medium and down */}
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
        <Routes />
      </main>

    </div>
  )
}

export default Navigation
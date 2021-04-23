import React from 'react';
import { useState } from 'react'; 
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
// form component
import CensorshipForm from './CensorshipForm'; 

const useStyles = makeStyles((theme) => ({
    toolbarButton: {
      width: "155px",
      fontWeight: "bold",
      color: "#181818",
      backgroundColor: "#eceff1",
    },
}));

export default function CensorshipOptionsDialog({options, handleOptionsChange}) {

  const [open, setOpen] = React.useState(false);
  const classes  = useStyles(); 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true); 
  }
  
  const handleClickClose = () => {
    setOpen(false); 
  }

  return (
    <div style={{display : 'inline-block'}}>
      <Button size='small' className={classes.toolbarButton} onClick={handleClickOpen}>
        Select Options
      </Button>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClickClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <CensorshipForm options={options} handleOptionsChange={handleOptionsChange}/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClickClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClickClose} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
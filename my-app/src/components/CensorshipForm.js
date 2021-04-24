import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// checkbox
import Checkbox from '@material-ui/core/Checkbox';
// switch 
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CensorshipForm({options, handleOptionsChange}) {
  const classes = useStyles();
  const [checkBoxState, setCheckboxState] = React.useState({
    pixel_sort: false,
    simple_blurring: false,
    pixelization: false,
    black_bar: false,
    fill_in: false,
  });

  // meta switch 
  const [enableMeta, setMetaState] = React.useState(false);  

  const handleCheckboxChange = (event) => {
    setCheckboxState({ ...checkBoxState, [event.target.name]: event.target.checked }); 
  };

  const handleMetaChange = (event) => {  
    setMetaState(event.target.checked); 
  }; 

  const { pixel_sort, simple_blurring, pixelization, black_bar, fill_in } = checkBoxState;

  useEffect(() => {
    console.log(options); 
  }, [options]); 

  return (
    <div className={classes.root}>
      {/* Checkbox Components */}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select Censoring Algorithm(s)</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={options[0].isSelected} onChange={handleOptionsChange} name="pixel_sort" />}
            label="Pixel Sorting"
          />
          <FormControlLabel
            control={<Checkbox checked={options[1].isSelected} onChange={handleOptionsChange} name="simple_blurring" />}
            label="Simple Blurring"
          />
          <FormControlLabel
            control={<Checkbox checked={options[2].isSelected} onChange={handleOptionsChange} name="pixelization" />}
            label="Pixelization"
          />
          <FormControlLabel
            control={<Checkbox checked={options[3].isSelected} onChange={handleOptionsChange} name="black_bar" />}
            label="Black Bar Censoring"
          />
          <FormControlLabel
            control={<Checkbox checked={options[4].isSelected} onChange={handleOptionsChange} name="fill_in" />}
            label="Fill In Censoring"
          />
        </FormGroup>
      </FormControl>
      {/* Switch Component */}
      <FormControl component='fieldset' className={classes.formControl}>
        <FormLabel component="legend">Enable Metadata Scrubbing</FormLabel>
            <Switch
                checked={enableMeta}
                onChange={handleMetaChange}
                name="enableMeta"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
      </FormControl>
    </div>
  );
}
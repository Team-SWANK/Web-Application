import React from 'react';
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

export default function CensorshipForm() {
  const classes = useStyles();
  const [checkBoxState, setCheckboxState] = React.useState({
    pixel_sort: false,
    simple_blurring: false,
    pixelization: false,
    black_bar: false,
    fill_in: false,
  });

  const [enableMeta, setMetaState] = React.useState(false);  

  const handleCheckboxChange = (event) => {
    setCheckboxState({ ...checkBoxState, [event.target.name]: event.target.checked });
    console.log('selected checkbox: ' + event.target.name); 
  };

  const handleMetaChange = (event) => {
    setMetaState({ enableMeta: !enableMeta });

    // setMetaState({ ...metaState, [event.target.name]: !event.target.checked }); 
    console.log('selected meta switch: ');
    console.log('enable: ' + enableMeta); 
  }; 

  const { pixel_sort, simple_blurring, pixelization, black_bar, fill_in } = checkBoxState;
//   const { enabledMetaData } = metaState; 

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select Censoring Algorithm(s)</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={pixel_sort} onChange={handleCheckboxChange} name="pixel_sort" />}
            label="Pixel Sorting"
          />
          <FormControlLabel
            control={<Checkbox checked={simple_blurring} onChange={handleCheckboxChange} name="simple_blurring" />}
            label="Simple Blurring"
          />
          <FormControlLabel
            control={<Checkbox checked={pixelization} onChange={handleCheckboxChange} name="pixelization" />}
            label="Pixelization"
          />
          <FormControlLabel
            control={<Checkbox checked={black_bar} onChange={handleCheckboxChange} name="black_bar" />}
            label="Black Bar Censoring"
          />
          <FormControlLabel
            control={<Checkbox checked={fill_in} onChange={handleCheckboxChange} name="fill_in" />}
            label="Fill In Censoring"
          />
        </FormGroup>
      </FormControl>
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
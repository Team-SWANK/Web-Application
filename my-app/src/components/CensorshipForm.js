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
//Steven
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
//EndSteven
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
//This dictionary will be replaced by whatever is pulled/stored for the image in page -Steven
var tags = {'Recommended Scrub': 'GPS Info, Latitude, Longitude, Camera Make, Camera Model, etc.', 'Full Scrub': 'All Metadata', 'Tag1': 'Sample Text1', "Tag2": 'Tag2 info', 'Tag3': 'Nikon 3210', 'Tag4': 'Sample Text1', "Tag5": 'Tag info', 'Tag6': 'Nikon 3210', 'Tag7': 'Sample Text1', "Tag8": 'Tag2 info', 'Tag9': 'Nikon 3210'}
const keys = Object.keys(tags)
export default function CensorshipForm() {
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


 //Steven Checkboxes V V
 const [checked, setChecked] = React.useState([0]);

 const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }

  setChecked(newChecked);
};
// endSteven Checkboxes ^ ^
  return (
    <div className={classes.root}>
      {/* Checkbox Components */}
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
      <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Select Metadata Tags to Scrub</FormLabel>


      <List style={{maxHeight: '50%', overflow: 'auto'}}>{keys.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value}`} />
            <ListItemSecondaryAction>
            <Tooltip title={`${tags[value]}`} placement = 'right'>
            <IconButton edge="end" aria-label="info">
                <InfoIcon />
              </IconButton>
            </Tooltip>
              
            </ListItemSecondaryAction>
          </ListItem>

      
  
        );
        
      })}
    </List>

    </FormControl>

      {/*May have to use this later (or not) depending on whether full scrub and recommended scrub will remain part of the list and automatically check other boxes*/}
      {/* Switch Component */}
      {/*
      <FormControl component='fieldset' className={classes.formControl}>
        <FormLabel component="legend">Enable Metadata Scrubbing</FormLabel>
            <Switch
                checked={enableMeta}
                onChange={handleMetaChange}
                name="enableMeta"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
      </FormControl>
      */}
      
    </div>
  );
}
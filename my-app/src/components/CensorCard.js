import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
  },
  media: {
    height: 205,
    // paddingTop: '56.25%', // 16:9
  },
}));

const descriptions = {
  'Simple Blurring': 'Our Blur uses a Gaussian Kernel to blur images along the given mask.' 
    +' We strongly recommend using another method in conjunction, as certain AI methods are able to reverse gaussian, motion and other blurring techniques.',
  'Pixel Sort': 'Pixel Sorting is a glitchy effect that orders the pixels in the rows/columns of an image.'
    + ' We use a random ordering to speed up the process and deflect against attackers attempting to reorder an images pixels',
  'Pixelization': 'Pixelization involves resizing the images to a very small scale and resizing it back up to create a low resolution look along the given mask.',
  'Black Bar': 'Our Black Bar algorithm creates a rectangular bounding box around each segmentation and changes those pixels to a completely black value.',
  'Fill In': 'The Fill In option averages the pixels found inside each segmentation of the image mask and changes them all to be that average color.'
}

export default function CensorCard({image, name}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader title={name} />
      <CardMedia
        className={classes.media}
        image={image}
        title={name} 
      />
      <CardContent style={{textAlign: 'justify'}}>
        <Typography variant="body2" color="textSecondary" component="p">
          {name in descriptions ? descriptions[name] : 'nothing'}
        </Typography>
      </CardContent>
    </Card>
  )
}
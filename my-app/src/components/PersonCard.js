import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 300,
    // paddingTop: '56.25%', // 16:9
  },
  descriptionCard: {
    maxWidth: 345,
    height: 410,
    opacity: 0.8,
  },
  collapse: {
    position: 'absolute'
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  gridMargin: {
    marginTop: 92
  }
});

export default function PersonCard({name, image, description, twitter, linkedIn, github, email}) {
  const classes = useStyles();
  const [descriptionToggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!descriptionToggle);
  }

  return (
    <Grid item xs={12} sm={6} lg={4}>

      <Collapse in={descriptionToggle} className={classes.collapse}>
        <Card className={classes.descriptionCard} onClick={handleToggle}>
          <CardActionArea style={{height: classes.descriptionCard.height}}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="h3">
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </CardContent>
            </CardActionArea>     
        </Card>
      </Collapse>

      <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={image}
            title={name} 
          />
            <CardActionArea>
            <CardContent onClick={handleToggle} style={{height: 110}}>
              <Typography gutterBottom variant="h6" component="h3">
                {!descriptionToggle && name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {!descriptionToggle && description.substring(0, 90) + "..."}
              </Typography>
            </CardContent>
            </CardActionArea>
      </Card>

      <Grid container direction="row" justify="center" alignItems="center" spacing={3} className={classes.root} style={{marginLeft: 0, marginRight: 0}}>
        {twitter && <Grid item xs={3}>
          <a href={twitter}>
          <IconButton className={classes.icon} aria-label="twitter" >
            <TwitterIcon />
          </IconButton>
          </a>
        </Grid>}
        {linkedIn && <Grid item xs={3}>
          <a href={linkedIn}>
          <IconButton className={classes.icon} aria-label="linked-in">
            <LinkedInIcon />
          </IconButton>
          </a>
        </Grid>}
        {github && <Grid item xs={3}>
          <a href={github}>
          <IconButton className={classes.icon} aria-label="github">
            <GitHubIcon />
          </IconButton>
          </a>
        </Grid>}
        {email && <Grid item xs={3}>
          <a href={'mailTo:'+email}>
          <IconButton className={classes.icon} aria-label="github">
            <MailIcon />
          </IconButton>
          </a>
        </Grid>}
      </Grid>

    </Grid>
  );
}
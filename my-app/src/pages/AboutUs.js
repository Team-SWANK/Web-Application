import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import PersonCard from '../components/PersonCard';
import wolfieImage from '../images/team/wolfie.jpg';
import nathanImage from '../images/team/nathan.jpeg';
import kevinImage from '../images/team/kevin.jpeg';
import stevenImage from '../images/team/steven.png';
import abelImage from '../images/team/abel.jpeg'

import IconButton from '@material-ui/core/IconButton';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
})); 

export default function AboutUs() {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <h1>About PhotoSense</h1>
      <p>PhotoSense is a set of online tools that give people the ability to protect their privacy. 
      In 2020, many activists and journalists are using the internet to upload images of protests and 
      other politically charged mass gatherings. However, those who upload their images online may be susceptible to 
      threats, job loss, and physical assault. PhotoSense addresses this issue by providing twitter and reddit bots, a 
      browser extension, and a web application for users to censor sensitive information in their photos to be displayed on the internet. 
      <br/><br/> PhotoSense is not
      only an application, it is a movement. We strive to emphasize the invaluable rights to peacefully gather, while maintaining the security
      of privacy. To further this movement, PhotoSense provides users with a Google Chrome Extension, as well as Reddit and Twitter bots.
      The Google Chrome Extension can be accessed through the Google app store, or by clicking the link in the top navigation bar. The Reddit and Twitter social media
      bots can be utilized by anyone who wants to spread the movement by tagging our bot on Twitter or Reddit under posts with photos that display people's faces. They can be found in the links below.        
      </p>

      <Grid container direction="row" justify="center" alignItems="center" spacing={1} className={classes.root} style={{marginLeft: 0, marginRight: 0}}>
        <Grid item xs={2}>
          <a href='https://twitter.com/photosense_bot'>
          <IconButton className={classes.icon} aria-label="twitter bot" >
            <TwitterIcon style={{fontSize: 50}} />
          </IconButton>
          </a>
        </Grid>
        <Grid item xs={2}>
          <a href='https://www.reddit.com/user/PhotoSenseBot/'>
          <IconButton className={classes.icon} aria-label="reddit bot">
            <RedditIcon style={{fontSize: 50}} />
          </IconButton>
          </a>
        </Grid>
      </Grid>

      <h2>The Team</h2>
      <Grid container direction="row" justify="space-evenly" alignItems="flex-start" spacing={3}>
        <PersonCard
          name="Wolfgang HellicksonSabelhaus"
          image={wolfieImage}
          description="Developed the Computer Vision models for detection and segmentation of faces as well as the backend architecture for the models to poll from requests made to our API. Also worked on creating this web interface, mainly contributing in the drawing tool and overall design."
          linkedIn="https://www.linkedin.com/in/wolfgang-hellicksons/"
          github="https://github.com/WHellhaus"
          email={'wolfgang.hellicksons@gmail.com'}
        />
        <PersonCard
          name="Nathan Savas"
          image={nathanImage}
          description="Developed a bot to enable PhotoSense capability on Twitter as well as provide AWS solutions for hosting our various services."
          linkedIn={'https://www.linkedin.com/in/nathansavas/'}
          github={'https://github.com/nsavas'}
          email={'nathan.savas@student.csulb.edu'}
        />
        <PersonCard
          name="Kevin Patel"
          image={kevinImage}
          linkedIn={'https://www.linkedin.com/in/kevinjaypatel/'}
          github={'https://github.com/kevinjaypatel'}
          email={'kevinjaypatel@gmail.com'}
          description="Worked on the Reddit bot and the front-end of the web app for allowing the user to view censored images."
        />
        <PersonCard
          name="Steven Gamboa"
          image={stevenImage}
          description="Primarily focused on research, development, and integration of the PhotoSense Reddit bot and metadata scrubber. Worked on project logistics and documentation as well as development on the web application. (Steven is pictured on the right in this image)"
          linkedIn={'https://www.linkedin.com/in/steven-gamboa-2461a5192/'}
          github={'https://github.com/sgamboa13'}
          email={'steven.gamboa@student.csulb.edu'}
        />
        <PersonCard
          name="Abel Acosta"
          image={abelImage}
          description="Implemented multiple censoring algorithms including designing and integrating them. Also, developed the chrome extension."
          linkedIn={'https://www.linkedin.com/in/abel-acosta-b25022111/'}
          github={'https://github.com/abelacosta'}
        />
        </Grid>
    </Container>
  )
}
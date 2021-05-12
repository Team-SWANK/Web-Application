import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import PersonCard from '../components/PersonCard';
import wolfieImage from '../images/team/wolfie.jpg';
import nathanImage from '../images/team/nathan.jpeg';
import kevinImage from '../images/team/kevin.jpeg';
import stevenImage from '../images/team/steven.png';

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
          description="Lorem Ipsum Dotsum Sit Amrt Latin Thingy Go above 25 characters"
          twitter="https://twitter.com/WHellHaus"
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
        />
        <PersonCard
          name="Kevin Patel"
          image={kevinImage}
          description="Lorem Ipsum Dotsum Sit Amrt Latin Thingy Go above 25 characters"
        />
        <PersonCard
          name="Steven Gamboa"
          image={stevenImage}
          description="Primarily focused on research, development, and integration of the PhotoSense Reddit bot and metadata scrubber. Worked on project logistics and documentation as well as development on the web application."
          twitter={'https://twitter.com/greatgambi13'}
          linkedIn={'https://www.linkedin.com/in/steven-gamboa-2461a5192/'}
          github={'https://github.com/sgamboa13'}
          email={'steven.gamboa@student.csulb.edu'}
        />
        </Grid>
    </Container>
  )
}
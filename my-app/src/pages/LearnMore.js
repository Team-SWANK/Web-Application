// General
import React, {useState} from 'react'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
// Material UI Components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'; 
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Slider from '@material-ui/core/Slider';
import BrushSizeDisplay from '../components/BrushSize';
import Canvas from '../Canvas'

import CensorCard from '../components/CensorCard';

import blur from '../images/samples/Gaussian.png';
import pxs from '../images/samples/Pixel_Sorting.png';
import px from '../images/samples/Pixelization.png';
import bb from '../images/samples/Black_Bar.png';
import fill from '../images/samples/Fill_In.png';

const images = {
    'Simple Blurring': blur,
    'Pixel Sort': pxs,
    'Pixelization': px,
    'Black Bar': bb,
    'Fill In': fill
};

const methods = ['Simple Blurring', 'Pixel Sort', 'Pixelization', 'Black Bar', 'Fill In']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    learnMoreBorder: { 
        border: '5px solid #eceff1', 
    }
})); 


function LearnMore() {
    const classes = useStyles(); 
    
    return (    
        <Container className={classes.root}>
            <h1>About PhotoSense</h1>
            <p>PhotoSense is a set of online tools that give people the ability to protect their privacy. 
            In 2020, many activists and journalists are using the internet to upload images of protests and 
            other politically charged mass gatherings. However, those who upload their images online may be susceptible to 
            threats, job loss, and physical assault. PhotoSense addresses this issue by providing twitter and reddit bots, a 
            browser extension, and a web application for users to censor sensitive information in their photos to be displlayed on the internet. 
            <br/><br/> PhotoSense is not
            only an application, it is a movement. We strive to emphasize the invaluable rights to peacefully gather, while maintaining the security
            of privacy. To further this movement, PhotoSense provides users with a Google Chrome Extension, as well as Reddit and Twitter bots.
            The Google Chrome Extension can be accessed through the Google app store, or by clicking the link in the top navigation bar. The Reddit and Twitter social media
            bots can be utilized by anyone who wants to spread the movement by tagging our bot on Twitter or Reddit under posts with photos that display people's faces.         
            </p>

            <h1>How to use the PhotoSense Web Application</h1>
            <p>After uploading an image to Photosense, it will be sent to our computer vision model so faces may be detected 
            (the image is never stored on file in our server, not even temporarily). Our computer vision model's results are then outputted onto a canvas as an
            opaque blue color on top of the image, so you can see what was detected and add any part of the image you wish to be censored. From there 
            you can select which censorship methods you would like to utilize and erase whatever metadata is attached to the photo.
            </p>
            <h2>Drawing Tool</h2>
            <p>Our web application uses a simple paint-like interface for adding/removing parts of the image onto the image mask of areas to be censored. 
            We tried to make the interface as simple as possible, so people could easily make changes and get a censored version of their image in order to post it.
            You can see an interactive version of the toolbar below. 
            </p>
            <Paper style={{marginTop: 15, padding:10}}>
                <Canvas image={[blur]} setCoordsPass={(x) => x} />
            </Paper>

            <h2>Censorship Methods</h2>
            <p>Our application offers many methods of censorship which can be used alone and in conjunction with one another. These options can be selected from 
            the Censorship Options dialog while using our drawing tool. The dialog also shows the metadata attached to your photo and allows you to erase that as well. 
            In order to help you understand what each method is best used for, we have some example photos below.
            </p>
            <Grid container direction="row" justify="space-evenly" alignItems="flex-start" spacing={3}>
                {methods.map(x => {
                    return (
                    <Grid key={x} item xs={12} sm={6} lg={4}>
                        <CensorCard image={images[x]} name={x} />
                    </Grid>
                    )
                })}
            </Grid>

            <h2>Erasing Metadata</h2>
            <p>Photos have a lot of invisible data attached to them that can have a lot of sensitive data. This metadata could reveal where the photo was taken,
            when the file was originally created or the name of whoever took the photo. There is also a lot of artistic data however, that mainly 
            reveals what the camera's settings were when the photo was taken. We let our users see any metadata that might be sensitive and allow them to erase it. 
            If there's ever a tag that you don't understand you can hover over the tooltip and the value inside that tag will be displayed, so you can try and figure out what that tag might mean.
            </p>

            <h1>Censoring Photos</h1>
            <p>When the image mask is looking like it contains all sensitive information and you have selected your censorship options, you can hit 
            the Censor button and the image will be sent to our Censorship API (your image is never stored on any of our servers). 
            After the image has been processed it will be sent back to you and you will be able to download the censored image and post it without worry.
            </p>

        </Container> 
        
    ); 
}

export default LearnMore; 
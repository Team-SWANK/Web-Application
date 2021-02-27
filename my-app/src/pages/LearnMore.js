import React from 'react'; 
import '../styles/learn-more.css';
import {Container, Row, Col} from 'react-bootstrap'; 

function LearnMore() {
    
    return (
        <Container>
            <Row>
                <Col>
                    <div className="learnMoreBody">
                        <h2>About PhotoSense</h2>
                        <p className="infoText">PhotoSense is a set of online tools that give people the ability to protect their privacy. 
                        In 2020, many activists and journalists are using the internet to upload images of protests and 
                        other politically charged mass gatherings. <br></br> <br></br> However, those who upload their images online may be susceptible to 
                        threats, job loss, and physical assault. PhotoSense addresses this issue by providing twitter and reddit bots, a 
                        browser extension, and a web application for users to edit and upload censored images online. <br></br> <br></br> PhotoSense is not
                        only an application, it is a movement. We strive to emphasize the invaluable rights to peacefully gather, while maintaining the the security
                        of privacy. In order to further this movement, PhotoSense provides its users with a Google Chrome Extension, as well as Reddit and Twitter bots.
                        The Google Chrome Extension can be accessed through the Google app store, or by clicking the link in the top navigation bar. The Reddit and Twitter social media
                        bots can be utilized by anyone who wants to spread this movement by using the appropriate hashtags (#PhotoSense) and commands.         
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    ); 
}


export default LearnMore; 
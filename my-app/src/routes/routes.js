import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from '../pages/Main';
import DevPixelCensor from '../pages/Dev-Pixel-Censor';
import LearnMore from '../pages/LearnMore.js';
import Url from '../pages/Url.js';
import AboutUs from '../pages/AboutUs.js';


const Routes = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route path="/url/:id" component={Url} />
    <Route path="/dev" component={DevPixelCensor} />
    <Route path="/about" component={AboutUs} />
    <Route path="/learn-more" component={LearnMore} />
  </Switch>
);

export default Routes;

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from '../pages/Main';
import DevPixelCensor from '../pages/Dev-Pixel-Censor';
import LearnMore from '../pages/LearnMore.js';

 
const Routes = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route path="/dev" component={DevPixelCensor} />
    <Route path="/learn-more" component={LearnMore} />
  </Switch>
);

export default Routes;
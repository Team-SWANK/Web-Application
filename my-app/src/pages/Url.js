import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas';
import { useLocation } from 'react-router-dom';

function Url() {

  // Get image source URL
  let location = useLocation();
  let imageURL = location.pathname.substring(5);

    return (
      <div>
        <Canvas image={imageURL} />
      </div>
    );
}


export default Url;

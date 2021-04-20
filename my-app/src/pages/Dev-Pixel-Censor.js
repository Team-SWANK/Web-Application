import React, { useState, useEffect } from 'react';
import img1 from "../images/gps.jpg";
import EXIF from 'exif-js';

function DevPixelCensor() {
    return (
        <div>
            <p>Dev works!</p>
            <img src = {img1}/>
        </div>
    )
}

export default DevPixelCensor;
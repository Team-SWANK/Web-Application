import React, { useState, useEffect } from 'react';
import img1 from "../images/gps.jpg";
import EXIF from 'exif-js';

function DevPixelCensor() {
    
    const [allMetadata, setMetadata] = useState([]);

    EXIF.getData(img1, function() {
        setMetadata(EXIF.getAllTags(this));
        var allMetaDataSpan = document.getElementById("allMetaDataSpan");
        allMetaDataSpan.innerHTML = JSON.stringify(allMetadata, null, "\t");
    });
    return (
        <div>
            <p>Dev works!</p>
            <img src = {img1}/>
            <ul>
                {allMetadata.map(item => {
                    return <li>{`${item}`}</li>;
                })}
            </ul>
        </div>
    )
}

export default DevPixelCensor;
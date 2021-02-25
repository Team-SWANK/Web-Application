import React from 'react';
import { useLocation } from 'react-router-dom';

function DevPixelCensor() {
    const id = useLocation();

    return (
        <div>
            <p>Dev works!</p>
            <p>ID: {id.pathname}</p>
        </div>
    )
}

export default DevPixelCensor;
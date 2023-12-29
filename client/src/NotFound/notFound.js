// NotFound.js

import React from 'react';
import notFoundImage from '../Assets/not-found-image.png';


const NotFound = () => {
    return (
        <div className='d-flex flex-column align-items-center justify-content-center p-4 w-100' style={{ height:'100vh',backgroundColor:`var(--main-background)` }}>
            <img src={notFoundImage} alt="404 Error" style={{ maxWidth: '100%', height: 'auto' }} />
            <h2>404 - Not Found</h2>
            <p className='text-center'>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;

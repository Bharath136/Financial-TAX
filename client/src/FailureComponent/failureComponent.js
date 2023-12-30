import React from 'react';
import noInternet from '../Assets/no-internet.png'

const FailureComponent = ({ errorMsg }) => {
    console.log(errorMsg);
    return (
        <div className='d-flex flex-column align-items-center justify-content-center w-100' style={{backgroundColor:`var(--main-background)`, paddingTop:'10vh', height:'100vh'}}>
        <img src={noInternet} alt='No Internet' className='img-fluid' />
            <h2>Error Occurred</h2>
            <p>{getErrorMsg(errorMsg)}</p>
       </div>
    );
};

const getErrorMsg = (error) => {
    let errMessage = '';
    if (error?.message === 'Network Error') {
        errMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.response && error.response.status === 401) {
        errMessage = 'Unauthorized. Please log in.';
    } else {
        errMessage = 'An unexpected error occurred. Please try again later.';
    }

    return errMessage;
};

export default FailureComponent;

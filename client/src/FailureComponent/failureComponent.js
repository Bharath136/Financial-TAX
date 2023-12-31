import React from 'react';
import noInternet from '../Assets/no-internet.png'

const FailureComponent = ({ errorMsg, fetchData }) => {
    const onClickTryAgain = () => {
        fetchData()
    }
    return (
        <div className='d-flex flex-column align-items-center justify-content-center w-100' style={{backgroundColor:`var(--main-background)`, paddingTop:'10vh', height:'100vh'}}>
        <img src={noInternet} alt='No Internet' className='img-fluid' />
            <h2>Error Occurred</h2>
            <p>{getErrorMsg(errorMsg)}</p>
            <button type='button' onClick={onClickTryAgain} style={{ padding: '10px', marginTop: '10px', backgroundColor: 'var(--accent-background)', color: 'var(--background-white)', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Please try again!
            </button>
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

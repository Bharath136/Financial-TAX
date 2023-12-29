import React from 'react';

const FailureComponent = ({ errorMsg }) => {
    console.log(errorMsg)
    return (
        <div>
            <h2>Error Occurred</h2>
            <p>{getErrorMsg(errorMsg)}</p>
        </div>
    );
};

const getErrorMsg = (error) => {
    if (error?.message === 'Network Error') {
        return 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.response && error.response.status === 401) {
        return 'Unauthorized. Please log in.';
    } else {
        return 'An unexpected error occurred. Please try again later.';
    }
};

export default FailureComponent;

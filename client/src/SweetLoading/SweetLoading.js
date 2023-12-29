import React from 'react';

const SweetLoading = () => {

    return (
       <div className='d-flex align-items-center justify-content-center w-100' style={{backgroundColor:`var(--main-background)`, paddingTop:'10vh', height:'100vh'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
            </div>
       </div>
        
    );
};

export default SweetLoading;

import React from 'react';

const SweetLoading = ({ loading, setLoading }) => {


    return (
       <div style={{height:'60vh'}} className='d-flex align-items-center justify-content-center'>
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
            </div>
       </div>
        
    );
};

export default SweetLoading;

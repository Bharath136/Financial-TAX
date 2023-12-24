import React from 'react';
const ResponseDisplay = ({ response, staffId }) => {
    return (
        <li className='w-100 p-2 shadow' style={{backgroundColor:`var(--background-white)`}}>
            <p>
                <strong>Response:</strong> {response}
            </p>
            <p>
                <strong>Staff ID:</strong> {staffId}
            </p>
        </li>
    );
};

export default ResponseDisplay;

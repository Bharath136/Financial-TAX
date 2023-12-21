// EyeButton.js
import React from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const EyeButton = ({ onClick, isShowPassword }) => {
    return (
        <button
            type="button"
            className="btn eye-button m-0"
            style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}
            onClick={onClick}
        >
            {isShowPassword ? <VscEyeClosed size={25} /> : <VscEye size={25} />}
        </button>
    );
};

export default EyeButton;

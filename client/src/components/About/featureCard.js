// FeatureCard.js
import React from 'react';
import './about.css'

const FeatureCard = ({ icon, text }) => {
    return (
        <div className="feature-card">
            <div className="card-icon">{icon}</div>
            <div className="card-text">{text}</div>
        </div>
    );
};

export default FeatureCard;

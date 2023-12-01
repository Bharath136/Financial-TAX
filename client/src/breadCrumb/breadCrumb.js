import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';
const BreadCrumb = () => {

    const location = useLocation();

    const [activeItem, setActiveItem] = useState(location.pathname);
    const steps = [
        {
            name: 'Tax Interview',
            step: 1,
            description: 'Complete your tax interview to provide necessary information.',
            link: '/tax-interview'
        },
        {
            name: 'Upload Document',
            step: 2,
            description: 'Upload the required documents for tax filing.',
            link: '/upload-document'
        },
        {
            name: 'Add Comment',
            step: 3,
            description: 'Add comments if needed to provide additional details.',
            link: '/comment-to-document'  
        },
        {
            name: 'Tax Return Review',
            step: 4,
            description: 'Review your tax return for accuracy and completeness.',
            link: '/tax-return-review',
        },
        {
            name: 'Payments',
            step: 5,
            description: 'Complete the payment process for your tax filing.',
            link: '/make-payment',
        },
    ];

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    return(
        <div className="d-flex bg-light mt-2 mb-4 p-3">
            <div className="row w-100">
                {steps.map((step) => (
                    <div style={{ color: activeItem === step.link ? '#076e1b' : 'grey' }} className="col-6 col-md-4 col-lg-2 d-flex align-items-center"  key={step.step}>
                        <div className="m-2">
                            <h6 className="m-0 p-0">{step.name}</h6>
                            <p className="m-0 p-0">step: {step.step}</p>
                        </div>
                        <FaAnglesRight size={20} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BreadCrumb
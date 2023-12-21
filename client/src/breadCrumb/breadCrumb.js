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
            link: '/user/tax-interview'
        },
        {
            name: 'Upload Document',
            step: 2,
            description: 'Upload the required documents for tax filing.',
            link: '/user/upload-document'
        },
        {
            name: 'Add Comment',
            step: 3,
            description: 'Add comments if needed to provide additional details.',
            link: '/user/comment-to-document'  
        },
        {
            name: 'Tax Return Review',
            step: 4,
            description: 'Review your tax return for accuracy and completeness.',
            link: '/user/tax-return-review',
        },
        {
            name: 'Payments',
            step: 5,
            description: 'Complete the payment process for your tax filing.',
            link: '/user/make-payment',
        },
    ];

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    return(
        <div className="d-flex mt-2 mb-4 p-3">
            <div className="row w-100">
                {steps.map((step) => (
                    <div style={{ color: activeItem === step.link ? 'green' : 'grey', fontWeight: activeItem === step.link && '700'}} className="col-6 col-md-4 col-lg-2 d-flex align-items-center"  key={step.step}>
                        <div className="mt-2 mb-2">
                            <h6 className="m-0 p-0" style={{ fontWeight: activeItem === step.link && '700' }}>{step.name}</h6>
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
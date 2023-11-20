import './staffDashboard.css'
import Sidebar from '../../userComponents/SideBar/sidebar';
import { useEffect, useState } from 'react'
import { FaFileAlt, FaClock, FaCheck, FaMoneyBillAlt, FaClipboardList } from 'react-icons/fa';


const StaffDashboard = () => {

    const [currentUser, setCurrentUser] = useState('')

    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        if (user) {
            setCurrentUser(user.first_name)
        }
    }, [user]);

    const data = {
        total: 100,
        pending: 25,
        reviewed: 45,
        payments: 60,
        summary: 80,
    };


    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="profile-container">
                <h2>Welcome <span className="current-user">{currentUser}</span></h2>
                <div className="dashboard-container">
                    <div className="dashboard-item ">
                        <div className="dashboard-icon"><FaFileAlt className='dashboard-icons' size={80} /></div>
                        <div className="dashboard-text">
                            <h4>Total</h4>
                            <p>{data.total}%</p>
                        </div>
                        {/* <div className="dashboard-bar" style={{ width: `${data.total}%` }}></div> */}
                    </div>

                    <div className="dashboard-item ">
                        <div className="dashboard-icon"><FaClock className='dashboard-icons' size={80} /></div>
                        <div className="dashboard-text">
                            <h4>Pending</h4>
                            <p>{data.pending}%</p>
                        </div>
                        {/* <div className="dashboard-bar" style={{ width: `${data.pending}%` }}></div> */}
                    </div>

                    <div className="dashboard-item ">
                        <div className="dashboard-icon"><FaCheck className='dashboard-icons' size={80} /></div>
                        <div className="dashboard-text">
                            <h4>Reviewed</h4>
                            <p>{data.reviewed}%</p>
                        </div>
                        {/* <div className="dashboard-bar border" style={{ width: `${data.reviewed}%` }}></div> */}
                    </div>
                </div>
                <div className="dashboard-container" style={{ gap: '30px' }}>
                    <div className="dashboard-item dashboard-item-2 ">
                        <div className="dashboard-icon"><FaMoneyBillAlt className='dashboard-icons' size={80} /></div>
                        <div className="dashboard-text">
                            <h4>Payments</h4>
                            <p>{data.payments}%</p>
                        </div>
                        {/* <div className="dashboard-bar" style={{ width: `${data.payments}%` }}></div> */}
                    </div>

                    <div className="dashboard-item dashboard-item-2">
                        <div className='d-flex align-items-center'>
                            <div className="dashboard-icon"><FaClipboardList className='dashboard-icons' size={80} /></div>
                            <div className="dashboard-text">
                                <h4>Summary</h4>
                                <p>{data.summary}%</p>
                            </div>
                        </div>
                        {/* <div className="dashboard-bar" style={{ width: `${data.summary}%` }}></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffDashboard
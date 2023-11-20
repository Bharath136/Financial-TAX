import Sidebar from '../SideBar/sidebar'
import './makePayment.css'

const MakePayment = () => {
    return (
        <div className='d-flex'>
        <Sidebar/>
            <div className="make-payment-container">
                <h2>Summary</h2>
            </div>
        </div>
    )
}

export default MakePayment
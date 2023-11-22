import Sidebar from '../SideBar/sidebar'
import './makePayment.css'

const MakePayment = () => {
    return (
        <div className='d-flex'>
        <Sidebar/>
            <div className="make-payment-container">
                <h3>Summary</h3>
            </div>
        </div>
    )
}

export default MakePayment
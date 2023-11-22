import Sidebar from '../SideBar/sidebar'
import './taxreturnReview.css'

const TaxreturnReview = () => {
    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="my-taxreturn-container">
                <h3>Taxreturn Review</h3>
            </div>
        </div>
    )
}

export default TaxreturnReview
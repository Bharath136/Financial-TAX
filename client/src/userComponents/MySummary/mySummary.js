import Sidebar from '../SideBar/sidebar'
import './mySummary.css'

const MySummary = () => {
    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="my-summary-container">
                <h2>Summary</h2>
            </div>
        </div>
    )
}

export default MySummary
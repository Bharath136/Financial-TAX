import Sidebar from '../SideBar/sidebar'
import './myTaxDocuments.css'

const MyTaxDocuments = () => {
    return (
        <div className='d-flex'>
            <Sidebar/>
            <div className="my-tax-documents-container">
                <h2>MyTaxDocuments</h2>
            </div>
        </div>
    )
}

export default MyTaxDocuments

import {Outlet} from 'react-router-dom'

import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../assets/styles/dashboard.css" 



export default function Dashboard(){

      return (
        <div className="dashboard-layout">
            <Sidebar/>
        <div className="dashboard-main">
            <Header />

            <div className="dashboard-content">
                <Outlet/>
            </div>

            {/* end of dashboard main*/}    
        </div>


         {/* end of dashboard layout*/}   
        </div>
    )


}

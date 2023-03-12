import './left.scss'
import Auth from '../../utils/auth';
 import {CiYoutube} from "react-icons/ci";
  import {CiMail } from "react-icons/ci";
 import { FiUsers } from "react-icons/fi";
 import { GoCalendar} from "react-icons/go";
 import { GoBriefcase} from "react-icons/go";





const Left = () => {
   
    return(   
    
//     <div className='left-side'>
//     <div className='container'>
//         <div className='menu'>
//         <h3>hello I am a sidebar hopefully I work</h3>
//             <div className='info'>

//             </div>
//         </div>
//     </div>
// </div> 
<div className="left">
      <div className="container">
        <div className="menu">
          <div className="info">
         
          </div>
          <div className="icon">
           <GoCalendar className='icon'/>
            <span>Calender</span>
          </div>
          <div className="icon">
           <FiUsers className='icon'/>
            <span>Groups</span>
          </div>
          <div className="icon">
            <GoBriefcase className='icon'/>
            <span>Jobs</span>
          </div>
        
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="icon">
         
            <span>Events</span>
          </div>
          <div className="icon">
            
            <span>Gaming</span>
          </div>
          <div className="icon">
           
            <span>Gallery</span>
          </div>
          <div className="icon">
            <CiYoutube/>
            <span>Videos</span>
          </div>
          <div className="icon">
            <CiMail/>
            <span>Mail</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="icon">
            
            <span>Fundraiser</span>
          </div>
          <div className="icon">
            
            <span>Tutorials</span>
          </div>
          <div className="icon">
           
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>



)

}

export default Left
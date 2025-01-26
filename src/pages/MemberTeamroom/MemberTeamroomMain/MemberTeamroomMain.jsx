
import React,{useState,useEffect} from 'react';
import TeamroomSidebar from '../../../components/Global/TeamroomSidebar/TeamroomSidebar';
import ProfileBar from '../../../components/Global/ProfileBar/ProfileBar';
// import { faHome, faTasks , faSearch, faEnvelope, faChartBar,faTimeline,faSpinner} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
// import axios from 'axios';
// import { Backend_url } from '../../../Backend_url';
import { useParams } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom'

const MemberTeamroom = () => {
  const { teamId } = useParams();
  const menuItems = [

    { id:1, name: "Home", route: "Member/Home"},
    { id:2, name: "Analytics", route: `Member-Teamroom/${teamId}/Analytics` }, 
    { id:3, name: "Resources", route: `Member-Teamroom/${teamId}/Resources`},
    { id:4, name: "Tasks", route: `Member-Teamroom/${teamId}/Tasks` },
    { id:5, name: "Live Sessions", route: `Member-Teamroom/${teamId}/LiveSessions` },
    { id:6, name: "Members", route: `Member-Teamroom/${teamId}/Members` },
    
  ];
  const title = "Meamber Teamroom";
  const userRole = "member";
  const data = useLoaderData()
  


  return (
    <div className="flex flex-col bg-grey-default h-screen overflow-hidden">
      
      <div className="flex flex-1">
        <TeamroomSidebar title={title} menuItems={menuItems} userRole={userRole} />
        
        <div className="flex-1 overflow-y-auto">
        {/* <Navbar avatar={avatar} name={name} isMember={true}/> */}
        <ProfileBar isMember={true} image={data?.data.avatar} userData={data?.data} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MemberTeamroom;


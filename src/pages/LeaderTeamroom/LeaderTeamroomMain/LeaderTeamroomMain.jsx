
import React,{useState,useEffect} from 'react';
import TeamroomSidebar from '../../../components/Global/TeamroomSidebar/TeamroomSidebar.jsx';
import ProfileBar from '../../../components/Global/ProfileBar/ProfileBar';
// import { faHome, faTasks , faSearch, faEnvelope, faChartBar,faTimeline,faSpinner} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLoaderData } from "react-router-dom"

const LeaderTeamroom = () => {
  const { teamId } = useParams();
  const data = useLoaderData()
  const menuItems = [

    { id:1, name: "Home", route: "Leader/Home"},
    { id:2, name: "Analytics", route: `Leader-Teamroom/${teamId}/Analytics` }, 
    { id:3, name: "Resources", route: `Leader-Teamroom/${teamId}/Resources`},
    { id:4, name: "Tasks", route: `Leader-Teamroom/${teamId}/Tasks` },
    { id:5, name: "Live Sessions", route: `Leader-Teamroom/${teamId}/LiveSessions` },
    { id:6, name: "Members", route: `Leader-Teamroom/${teamId}/Members` },
    { id:7, name: "Join Invitations", route: `Leader-Teamroom/${teamId}/JoinInvitations` },
    
  ];
  const title = "Leader Teamroom";
  const userRole = "leader";


  return (
    <div className="flex flex-col bg-grey-default h-screen overflow-hidden">
      
      <div className="flex flex-1">
        <TeamroomSidebar title={title} menuItems={menuItems} userRole={userRole} />
        
        <div className="flex-1 overflow-y-auto">
        <ProfileBar isMember={false} image={data?.data.avatar} userData={data?.data} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LeaderTeamroom;


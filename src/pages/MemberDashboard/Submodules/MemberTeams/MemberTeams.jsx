import React from 'react';
import Banner from '../../../../components/Global/Banner/Banner';
import { ScrollShadow } from "@nextui-org/react";
import Teams from '../../../../components/Global/Teams/Teams';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Backend_url } from '../../../../../BackendUrl';
import { useLoaderData } from 'react-router-dom'  

function MemberCourses() {
  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState(null);
    const data1 = useLoaderData()
  
    useEffect(() => {
      setTeamData(data1[0]);
        setUserData(data1[1]);
    }, []);
  return (
    <div style={{height: "calc(100vh - 4.3rem)",
      width: "100%",
      display: "flex",
      flexDirection:"column",
      padding: "1rem",
      overflowY: "scroll",
      overflowX: "hidden",
      background:"#EDE9E9"}}>
      <Banner leader={userData?.data.fullName} teamroom="Your Joined Courses" userData={userData} />
      <div className="flex flex-wrap gap-2 px-2 py-8 lg:gap-11 lg:p-4">
        {teamData.map((team, index) => (
          <Teams 
            key={index}
            title={team.title}
            category={team.category}
            description={team.description}
            leaderName={team.leaderName}
            imageUrl={team.imageUrl}
            link={team.link}
            isLeader={false}
            isJoined={true}
          />
        ))}
      </div>
    </div>
  )
}

export default MemberCourses;

export const memberMyTeamsInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/teams/get-my-teams-for-member?input=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const teams = response.data.data.map(teamdt => ({
      link: teamdt.team,
      teamname: teamdt.teamInfo[0].teamname,
      title: teamdt.teamInfo[0].title,
      category: teamdt.teamInfo[0].category,
      ownerId: teamdt.ownerInfo[0]._id,
      leaderName: teamdt.ownerInfo[0].fullName,
      description: teamdt.teamInfo[0].description,
      imageUrl: teamdt.teamInfo[0].thumbnail

    }));

    const response2 = await axios.get(`${Backend_url}/api/v1/users/get-current-member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const user = response2.data;


    return [teams, user];

  } catch (error) {
    console.error(error);
    return null;
  }
};


const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

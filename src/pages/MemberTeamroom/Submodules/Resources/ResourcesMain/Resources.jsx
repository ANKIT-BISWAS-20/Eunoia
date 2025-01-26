import React from "react";
import Banner from "../../../../../components/Global/Banner/Banner";
import List from "../Submodules/List/List";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../../../../../../BackendUrl";
import { useEffect,useState } from "react";
import TeamBanner from "../../../../../components/Global/Banner/TeamBanner";




function Resources() {
  const { teamId } = useParams();
  const [team_Info, setTeam_Info] = React.useState(null);
  const [materials, setMaterials] = React.useState(null);

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

  const getTeamInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/teams/get-my-team-dashboard-member?id=${teamId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.success) {
        const teamData = response.data.data;
        const ownerInfo = {
          _id: teamData.leader._id,
          username: teamData.leader.username,
          email: teamData.leader.email,
          fullName: teamData.leader.fullName,
          contactNo: teamData.leader.contactNo,
          DOB: teamData.leader.DOB,
          address: teamData.leader.address,
          language: teamData.leader.language,
          avatar: teamData.leader.avatar,
          role: teamData.leader.role,
          createdAt: teamData.leader.createdAt,
          updatedAt: teamData.leader.updatedAt
        };

        const teamInfo = {
          _id: teamData.team._id,
          teamname: teamData.team.teamname,
          thumbnail: teamData.team.thumbnail,
          title: teamData.team.title,
          description: teamData.team.description,
          category: teamData.team.category,
          createdAt: teamData.team.createdAt,
          updatedAt: teamData.team.updatedAt
        };

        const membersInfo = teamData.members.map(member => ({
          _id: member.memberInfo._id,
          username: member.memberInfo.username,
          email: member.memberInfo.email,
          fullName: member.memberInfo.fullName,
          contactNo: member.memberInfo.contactNo,
          DOB: member.memberInfo.DOB,
          address: member.memberInfo.address,
          language: member.memberInfo.language,
          avatar: member.memberInfo.avatar,
          role: member.memberInfo.role,
          createdAt: member.memberInfo.createdAt,
          updatedAt: member.memberInfo.updatedAt
        }));
        const info = { ownerInfo, teamInfo, membersInfo };

        return info;

      } else {
        console.error("Error fetching leaders:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching leaders:", error);
      return null;
    }
  };

  const getMaterialsInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/materials/get-all-materials?teamId=${teamId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(response.data);
      if (response.data && response.data.success) {
        const materials = response.data.data;
        return materials;

      } else {
        console.error("Error fetching leaders:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching leaders:", error);
      return null;
    }
  };



  useEffect(() => {
    getTeamInfo().then((info) => {
      if (info) {
        setTeam_Info(info);
      }

    });

    getMaterialsInfo().then((materials) => {
      if (materials) {
        setMaterials(materials);
      }
    });

  }, []);


  return (
    <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", padding: "1rem", overflowY: "scroll", overflowX: "hidden" }}>
      <TeamBanner teamData={team_Info?.teamInfo} />
      <div className="flex flex-wrap gap-2 px-2 py-8 lg:gap-11 lg:p-4">
        <List courseMaterials={materials} />
      </div>
    </div>
  );
}

export default Resources;

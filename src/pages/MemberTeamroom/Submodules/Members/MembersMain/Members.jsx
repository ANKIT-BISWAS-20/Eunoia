import React, { useEffect, useCallback } from "react";
import Banner from "../../../../../components/Global/Banner/Banner";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../../../../../../BackendUrl";
import TeamBanner from "../../../../../components/Global/Banner/TeamBanner";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  {name:"Expertise",uid:"address"},
];

const statusColorMap = {
  member: "bg-green-100 text-green-700",
  leader: "bg-red-100 text-red-700",
};

function Members() {
  const { teamId } = useParams();
  const [teamInfo, setTeamInfo] = React.useState(null);

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const getTeamInfo = async () => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(
        `${Backend_url}/api/v1/teams/get-my-team-dashboard-member?id=${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
          updatedAt: teamData.leader.updatedAt,
        };

        const teamInfo = {
          _id: teamData.team._id,
          teamname: teamData.team.teamname,
          thumbnail: teamData.team.thumbnail,
          title: teamData.team.title,
          description: teamData.team.description,
          category: teamData.team.category,
          createdAt: teamData.team.createdAt,
          updatedAt: teamData.team.updatedAt,
        };

        const membersInfo = teamData.members.map((member) => ({
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
          updatedAt: member.memberInfo.updatedAt,
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

  useEffect(() => {
    getTeamInfo().then((info) => {
      if (info) {
        setTeamInfo(info);
      }
    });
  }, []);

  const renderCell = useCallback((user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center space-x-3">
            <img
              className="w-12 h-12 rounded-full border-2 border-gray-300"
              src={user.avatar}
              alt={user.fullName}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        );
      case "role":
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[user.role]}`}
          >
            {user.role}
          </span>
        );
      default:
        return user[columnKey];
    }
  }, []);

  return (
    <div className="h-[calc(100vh-4.3rem)] w-full flex flex-col p-6 overflow-y-scroll overflow-x-hidden bg-gray-50">
      <TeamBanner teamData={teamInfo?.teamInfo} />
      <div className="w-full bg-white rounded-lg shadow-lg mt-6">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-primary text-white rounded-t-lg">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.uid}
                  className="px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider text-white-default"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamInfo &&
              teamInfo.membersInfo.map((member) => (
                <tr
                  key={member._id}
                  className="border-t hover:bg-gray-100"
                >
                  {columns.map((column) => (
                    <td key={column.uid} className="px-6 py-4">
                      {renderCell(member, column.uid)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Backend_url } from '../../../../../BackendUrl';
import TeamBanner from '../../../../components/Global/Banner/TeamBanner';

const JoinInvitations = () => {
    const { teamId } = useParams();
    const [invitations, setInvitations] = useState([]);
    const [teamInfo, setTeamInfo] = useState(null);

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

            const response = await axios.get(`${Backend_url}/api/v1/teams/get-my-team-dashboard-leader?id=${teamId}`, {
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

    useEffect(() => {
        // Fetch join invitations data
        const fetchInvitations = async () => {
            try {
                const accessToken = getCookie('accessToken');
                if (!accessToken) {
                    console.error("Access token not found");
                    return null;
                }
                // Replace the URL with your API endpoint for fetching join invitations
                const response = await axios.get(`${Backend_url}/api/v1/teams/view-all-join-invitations?id=${teamId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.data && response.data.success) {
                    const invitations = response.data.data.map(invitation => ({
                        id: invitation._id,
                        member: invitation.member,
                        time: invitation.createdAt,
                        name: invitation.memberInfo.fullName,
                        email: invitation.memberInfo.email,
                        username: invitation.memberInfo.username,
                        address: invitation.memberInfo.address,
                        avatar: invitation.memberInfo.avatar,
                        institute: invitation.memberInfo.institution,
                        standard: invitation.memberInfo.standard
                    }));
                    // console.log(invitations);
                    setInvitations(invitations);
                } else {
                    console.error("Error fetching join invitations:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching join invitations:", error);
            }
        };

        fetchInvitations();
        getTeamInfo().then((info) => {
            setTeamInfo(info);
        });
    }, []);

    const acceptInvitation = async (member) => {
        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.patch(`${Backend_url}/api/v1/teams/accept-join-invitation?id=${teamId}`, {
                memberId: member
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error("Error accepting invitation:", response.data.message);
            }

        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    };

    const rejectInvitation = async (member) => {
        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.patch(`${Backend_url}/api/v1/teams/reject-join-invitation?id=${teamId}`, {
                memberId: member
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error("Error rejecting invitation:", response.data.message);
            }
        } catch (error) {
            console.error("Error rejecting invitation:", error);
        }
    };


    return (
        <div
            style={{
                height: "calc(100vh - 4.3rem)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                overflowY: "scroll",
                overflowX: "hidden",
            }}
        >
            <TeamBanner teamData={teamInfo?.teamInfo} />
            <div className="flex flex-wrap justify-center">
                {invitations.map(invitation => (
                    <div key={invitation.id} className="max-w-xs bg-white-default rounded-md overflow-hidden shadow-lg m-10">
                        <img style={{ width: "auto", height: "auto" }} src={invitation.avatar} alt="Member Avatar" />
                        <div className="px-6 py-4">
                            <div className="font-bold text-cyan-950 text-lg mb-2">{invitation.name}</div>
                            <p className="text-cyan-800 text-base mb-2">Experties: {invitation.address}</p>
                            <p className="text-cyan-800 text-base mb-2">Email: {invitation.email}</p>
                            <p className="text-cyan-800 text-base mb-2">Username: {invitation.username}</p>
                            <p className="text-cyan-800 text-base mb-2">Semester: {invitation.standard}</p>
                            <p className="text-cyan-800 text-base mb-2">Time: {new Date(invitation.time).toLocaleString()}</p>
                        </div>
                        <div className="px-6 py-4 flex justify-between text-white-default">
                            <button onClick={() => acceptInvitation(invitation.member)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Accept
                            </button>
                            <button onClick={() => rejectInvitation(invitation.member)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JoinInvitations;

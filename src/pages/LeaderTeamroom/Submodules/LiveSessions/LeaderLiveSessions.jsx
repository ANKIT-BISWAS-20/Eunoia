import React from "react";
import Banner from "../../../../components/Global/Banner/Banner";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../../../../../BackendUrl";
import { useEffect } from "react";
import TeamBanner from "../../../../components/Global/Banner/TeamBanner";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";


function LeaderLiveSessions() {
  const navigate = useNavigate();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { teamId } = useParams();
  const [team_Info, setTeam_Info] = React.useState(null);
  const [liveSessions, setLiveSessions] = React.useState(null);
  const [topic, setTopic] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");


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

  const getLiveSessionInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/live-sessions/get-all-live-sessions?teamId=${teamId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.success) {
        const liveSessions = response.data.data;
        return liveSessions;
      } else {
        console.error("Error fetching live Sessions : ", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching live Sessions :", error);
      return null;
    }
  };

  useEffect(() => {
    getTeamInfo().then((info) => {
      if (info) {
        setTeam_Info(info);
      }

    });

    getLiveSessionInfo().then((materials) => {
      if (materials) {
        setLiveSessions(materials);
      }
    });

  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.post(`${Backend_url}/api/v1/live-sessions/create-live-session?teamId=${teamId}`, {
        teamId,
        topic,
        startTime,
        endTime
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.success) {
        console.log("Live Session created successfully");
        onOpenChange();
        window.location.reload();
      } else {
        console.error("Error creating live session : ", response.data.message);
      }
    } catch (error) {
      console.error("Error creating live session :", error);
    }
    // Reset form fields
    setEndTime('');
    setTopic('');
    setStartTime('');
  }
  




  return (
    <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", padding: "1rem", overflowY: "scroll", overflowX: "hidden" }}>
      <TeamBanner teamData={team_Info?.teamInfo} />
      <div className="flex flex-wrap gap-2 px-2 py-8 lg:gap-11 lg:p-4">
        <Accordion variant="splitted">
          {liveSessions?.map((material, index) => (
            <AccordionItem key={index} aria-label={`Accordion ${index + 1}`} title={`Meeting Topic : ${material.topic}`} className="font-roboto text-xl">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <p className=" text-lg font-inter text-black " >Start Time : {new Date(material.startTime).toLocaleString()}</p>
                  <p className=" text-lg font-inter text-gray-600 ">End Time : {new Date(material.endTime).toLocaleString()}</p>
                </div>
                <Button variant="solid" className="bg-green-500 text-white-default font-inter text-xl font-medium" onClick={()=>navigate(`/Leader-Teamroom/${teamId}/LiveSessions/${material._id}`)}>
                  Join
                </Button>

              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Button
        className="fixed bottom-4 right-4  bg-blue-default hover:bg-blue-700 text-white-default font-bold py-2 px-4 rounded-md text-sm md:text-base lg:py-3 lg:px-6 lg:text-lg"
        onPress={onOpen}
      >
        Schedule Live Session
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Schedule Live Session</ModalHeader>
              <ModalBody>
              <form  
              onSubmit={handleSubmit}
              className="bg-white-default shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Topic
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              id="topic"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Starts On
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Ends On
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white-default font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Live Session
            </button>
          </div>
          
        </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </div>
  );
}

export default LeaderLiveSessions;

import React from "react";
import Banner from "../../../../components/Global/Banner/Banner";
import LeaderTaskList from "./LeaderTaskList/LeaderTaskList";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../../../../../BackendUrl";
import { useEffect,useState } from "react";
import TeamBanner from "../../../../components/Global/Banner/TeamBanner";
import { Button } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";



function LeaderTasks() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { teamId } = useParams();
  const [team_Info, setTeam_Info] = React.useState(null);
  const [tasks, setTasks] = React.useState(null);
  const [description, setDescription] = useState('');
  const [fullMarks, setFullMarks] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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

  const getTasksInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/tasks/get-all-tasks?teamId=${teamId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log("Tasks response:", response.data);

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

    getTasksInfo().then((materials) => {
      if (materials) {
        setTasks(materials);
      }
    });

  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('deadline', deadline);
    formData.append('file', file);
    formData.append('teamId', teamId);
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.post(`${Backend_url}/api/v1/tasks/create-task?teamId=${teamId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.success) {
        console.log("Task created successfully");
        onOpenChange();
        getTasksInfo().then((materials) => {
          if (materials) {
            setTasks(materials);
          }
        });
      } else {
        console.error("Error creating task:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }

    // Reset the form
    setDescription('');
    setFullMarks('');
    setDeadline('');
    setFile(null);
  };



  return (
    <div style={{height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", padding: "1rem", overflowY: "scroll", overflowX: "hidden"}}>
      <TeamBanner teamData={team_Info?.teamInfo} />
      <div className="flex flex-wrap gap-2 px-2 py-8 lg:gap-11 lg:p-4">
        <LeaderTaskList teamTasks={tasks} />
      </div>
      <Button
        className="fixed bottom-4 right-4  bg-blue-default hover:bg-blue-700 text-white-default font-bold py-2 px-4 rounded-md text-sm md:text-base lg:py-3 lg:px-6 lg:text-lg"
        onPress={onOpen}
      >
        Create Task
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Upload New Task</ModalHeader>
              <ModalBody>
              <form onSubmit={handleSubmit} className="bg-white-default shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Deadline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Upload File
            </label>
            <input
              className="appearance-none block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow"
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white-default font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Task
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

export default LeaderTasks;

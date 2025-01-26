import React, { useEffect, useCallback, useState } from "react";
import TeamBanner from "../../../../components/Global/Banner/TeamBanner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Textarea
} from "@nextui-org/react";
import SendIcon from '@mui/icons-material/Send';
import { useParams, useNavigate } from "react-router-dom";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";
import axios from "axios";
import { Backend_url } from "../../../../../BackendUrl";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "EXPERTISE", uid: "experties" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  member: "success",
  leader: "danger",
};

function Members() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [teamInfo, setTeamInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedback, setFeedback] = useState("");

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

  const sendFeedBack = async (e) => {
    e.preventDefault();
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.post(`${Backend_url}/api/v1/teams/give-member-feedback?id=${teamId}&memberId=${selectedMember}`, {
        text: feedback
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.message === "Feedback Updated successfully") {
        setSuccessMessage("Feedback Updated successfully");
        setFeedback('');
        setIsError(false);
        setOpenSnack(true);
      } else if (response.data.message !== "Feedback Updated successfully" && response.data.success) {
        setSuccessMessage("Feedback submitted successfully");
        setFeedback('');
        setIsError(false);
        setOpenSnack(true);
      } else {
        setErrorMessage1("Failed to submit feedback");
        setIsError(true);
        setOpenSnack(true);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage1("Feedback already submitted for this member");

      } else {
        setErrorMessage1("An error occurred. Please try again later.");
      }
      setIsError(true);
      setOpenSnack(true);
    }
  }

  const removeMember = async (memberId) => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.delete(
        `${Backend_url}/api/v1/teams/remove-member-from-team?id=${teamId}&memberId=${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data && response.data.success) {
        window.location.reload();
      } else {
        console.error("Error removing member:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error removing member:", error);
      setErrorMessage(error.message);
    }
  };
  const [selectedMember, setSelectedMember] = useState(null);
  const feedbackMember = (memberId) => {
    setSelectedMember(memberId);
    openView();
  };

  useEffect(() => {
    getTeamInfo().then((info) => {
      setTeamInfo(info);
    });
  }, []);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={<p className="text-lg ml-4 text-black">{user.fullName}</p>}
            name={cellValue}
          >

          </User>
        );
      case "experties":
        return (
          <p className="text-lg text-black">{user.address}</p>
        );

      case "role":
        return (
          <Chip
            className="capitalize text-base"
            color={statusColorMap[user.role]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          user.role === "member" && (
            <div className="relative flex justify-evenly gap-4">
              <Tooltip content="Give Feedback">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Button
                    className="bg-green-500 text-white-default rounded-md"
                    onClick={() => feedbackMember(user._id)}
                  >
                    Give Feedback
                  </Button>
                </span>
              </Tooltip>
              <Tooltip content="Remove Member">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Button
                    className="bg-red-500 text-white-default rounded-md"
                    onClick={() => removeMember(user._id)}
                  >
                    Remove
                  </Button>
                </span>
              </Tooltip>
            </div>
          )
        );

      default:
        return cellValue;
    }
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openSnack, setOpenSnack] = React.useState(false);
  const [errorMessage1, setErrorMessage1] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage("");
    setErrorMessage1("");
    setIsError(false);
    setOpenSnack(false);
  };
  const openView = () => {
    onOpen();

  }
  const closeModal = () => {

    onClose();
  }
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
      <div className="w-full bg-white-default p-8 rounded-md">
        <h1 className="text-2xl font-medium text-center mb-4 text-black">
          Members
        </h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
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
      <Modal backdrop="blur" isOpen={isOpen} onClose={closeModal} scrollBehavior="inside" className='h-auto my-auto' size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold font-inter">Give Feedback</h1>
          </ModalHeader>
          <ModalBody>
            <div>
              <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                <Alert
                  onClose={handleClose}
                  severity={isError ? "error" : "success"}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {isError ? errorMessage1 : successMessage}
                </Alert>
              </Snackbar>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                name='feedback'
                label="Give Member Feedback"
                variant="bordered"
                labelPlacement="inside"
                color="primary"
              />
              <div className='flex justify-end p-4 pr-0'>
                <Button color="primary" variant="solid" endContent={<SendIcon />} onClick={(e) => sendFeedBack(e)}>Send</Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Members;

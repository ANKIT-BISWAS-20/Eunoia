import React, { useState } from 'react'
import Banner from '../../../../components/Global/Banner/Banner';
import Teams from '../../../../components/Global/Teams/Teams';
import AddIcon from '@mui/icons-material/Add';
import { Button, Tooltip } from '@nextui-org/react';
import { Input, Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect } from 'react';
import axios from 'axios';
import { Backend_url } from '../../../../../BackendUrl';
import { useLoaderData } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function CreateTeam() {
  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState(null);
  const data1 = useLoaderData()
  const [file, setFile] = useState(null);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage("");
    setErrorMessage("");
    setIsError(false);
    setOpenSnack(false);
  };


  useEffect(() => {
    if (data1) {
      setTeamData(data1[0] || []);
      setUserData(data1[1] || null);
    }
  }, [data1]);



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatar, setAvatar] = useState();
  const openView = () => {
    onOpen();
  }
  const createTeam = async (e) => {
    e.preventDefault();
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      const response = await axios.post(
        `${Backend_url}/api/v1/teams/create`,
        {
          teamname: formData.teamname,
          title: formData.teamname,
          description: formData.description,
          category: formData.category,
          thumbnail: file
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      console.log(response);
      setSuccessMessage("Team created successfully");
      setIsError(false);
      setOpenSnack(true);

      window.location.reload();


    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("All fields are required");
      } else if (error.response?.status === 409) {
        setErrorMessage("User already exists");
      } else {
        setErrorMessage("Server error. Please try again later");
      }
      setIsError(true);
      setOpenSnack(true);
    }
    setAvatar(null);
    onClose();
  }

  const closeModal = () => {
    setAvatar(null);
    onClose();
  }

  const [formData, setFormData] = useState({
    teamname: '',
    // image: null,
    title: '', // Change to null since it will hold the file object
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div style={{
      height: "calc(100vh - 4.3rem)",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      overflowY: "scroll",
      overflowX: "hidden",
      background: "#EDE9E9"
    }}>
      <Banner leader={userData?.data.fullName} teamroom="Home" />
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
            isLeader={true}
          />
        ))}
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={closeModal} scrollBehavior="inside" className='h-auto my-auto' size="lg">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Team

              </ModalHeader>
              <ModalBody>

                <div className='w-full text-center space-y-4'>
                  <div className='flex justify-center'>
                    <Image
                      isZoomed
                      alt="NextUI Fruit Image with Zoom"
                      src={avatar}
                      width={240}
                      className='mx-auto'
                    />
                  </div>
                  <Button
                    variant="bordered"
                    color='primary'
                    startContent={<CloudUploadIcon />}
                    onClick={() => document.getElementById('avatarUpload').click()}
                  >
                    Upload file

                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    id="avatarUpload"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
                <div className='space-y-4'>
                  <Input
                    value={formData.teamname}
                    name="teamname"
                    onChange={handleChange}
                    type="text"
                    label="Title"
                    variant="bordered"
                    className=""
                    color='primary'
                  />
                  <Input
                    value={formData.category}
                    name="category"
                    onChange={handleChange}
                    type="text"
                    label="Category"
                    variant="bordered"
                    className=""
                    color='primary'
                  />
                  <Input
                    value={formData.description}
                    name="description"
                    onChange={handleChange}
                    type="description"
                    label="Description"
                    variant="bordered"
                    className=""
                    color='primary'
                  />

                </div>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={closeModal}>
                  Close
                </Button>
                <Button color="primary" onClick={(e) => createTeam(e)}>
                  Create Team
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="fixed bottom-4 right-8 md:right-3 lg:right-8 z-10">
        <Button color='primary' className=" text-white-default font-bold hidden md:block" onClick={openView} >
          <AddIcon /> Create New Team
        </Button>
        <Tooltip key='1' color='primary' content='Create New Classroom' className="capitalize">
          <Button color='primary' className="text-white-default font-bold md:hidden block" onClick={openView} >
            <AddIcon />
          </Button>
        </Tooltip>

      </div>
    </div>
  )
}

export default CreateTeam

export const leaderMyTeamsInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/teams/get-my-teams-for-leader?input=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });



    const teams = await response.data.data.map(teamdt => ({
      link: teamdt.team,
      teamname: teamdt.teamInfo[0].teamname,
      title: teamdt.teamInfo[0].title,
      category: teamdt.teamInfo[0].category,
      ownerId: teamdt.ownerInfo[0]._id,
      leaderName: teamdt.teamInfo[0].fullName,
      description: teamdt.teamInfo[0].description,
      imageUrl: teamdt.teamInfo[0].thumbnail

    }));

    const response2 = await axios.get(`${Backend_url}/api/v1/users/get-current-leader`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const user = response2.data;

    console.log("Teams response:", response.data);
    console.log("User response:", response2.data);


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
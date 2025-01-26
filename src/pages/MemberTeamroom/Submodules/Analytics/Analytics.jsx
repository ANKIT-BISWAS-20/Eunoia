import React, { useState } from 'react';
import Banner from '../../../../components/Global/Banner/Banner';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { BarChart } from '@mui/x-charts/BarChart';
import { Tabs, Tab, Card, CardBody, Tooltip, Chip, Textarea } from "@nextui-org/react";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import TimelineIcon from '@mui/icons-material/Timeline';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import useWindowDimensions from '../../../../components/Util/UseWindowDimensions';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import StatCard from '../../../../components/Global/StatCard/StatCard';
import axios from 'axios';
import { useEffect } from 'react';
import { Backend_url } from '../../../../../BackendUrl';
import { useParams } from 'react-router-dom';
import TeamBanner from '../../../../components/Global/Banner/TeamBanner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Analytics() {
  const { teamId } = useParams();
  const { width } = useWindowDimensions();
  const [chart, setChart] = useState(1);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const [teamNegativeFeedback, setTeamNegativeFeedback] = useState(null);
  const [teamPositiveFeedback, setTeamPositiveFeedback] = useState(null);
  const [taskFeedbackEmotions, setTaskFeedbackEmotions] = useState([]);
  const [materialFeedbackEmotions, setMaterialFeedbackEmotions] = useState([]);
  const [taskScores, setTaskScores] = useState([]);
  const [materialScores, setMaterialScores] = useState([]);
  const [materialCount, setMaterialCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);


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
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.post(`${Backend_url}/api/v1/teams/give-team-feedback?id=${teamId}`, {
        text: feedback
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.message === "Feedback Updated successfully") {
        setSuccessMessage("Feedback Updated successfully");
        setIsError(false);
        setOpenSnack(true);
        setFeedback('');
      } else if (response.data.message !== "Feedback Updated successfully" && response.data.success) {
        setSuccessMessage("Feedback submitted successfully");
        setIsError(false);
        setOpenSnack(true);
        setFeedback('');
      } else {
        setErrorMessage("Failed to submit feedback");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage("Feedback already submitted for this team");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        setIsError(true);
        setOpenSnack(true);
      }
    }
  };

  const [team_Info, setTeam_Info] = useState()


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

  const getMemberAnalytics = async () => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/teams/get-team-analytics?teamId=${teamId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const teamFeedbacks = response.data.data.teamFeedbacks;
      const teamPositiveFeedbacks = teamFeedbacks.filter(
        (feedback) => feedback.emotion === "POSITIVE"
      );
      setTeamPositiveFeedback(teamPositiveFeedbacks[0]?.count);
      const teamNegativeFeedbacks = teamFeedbacks.filter(
        (feedback) => feedback.emotion === "NEGATIVE"
      );
      setTeamNegativeFeedback(teamNegativeFeedbacks[0]?.count);
      setTaskFeedbackEmotions(response.data.data.taskFeedbacksEmotions);
      setMaterialFeedbackEmotions(response.data.data.materialFeedbacksEmotions);
      setTaskScores(response.data.data.taskStarsCount);
      setMaterialScores(response.data.data.materialStarsCount);
      setMaterialCount(response.data.data.totalMaterials);
      setTaskCount(response.data.data.totalTasks);
      setMembersCount(response.data.data.totalMembers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTeamInfo().then((info) => {
      if (info) {
        setTeam_Info(info);
      }
    });
    getMemberAnalytics();
  }, []);

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
      <TeamBanner teamData={team_Info?.teamInfo} />
      <div className="rounded-md bg-cover bg-no-repeat flex justify-center items-center p-4">
        <Tabs
          aria-label="Options"
          placement='top'
          color='primary'
          className='flex justify-center '
          onSelectionChange={(key) => setChart(Number(key))}
        >
          <Tab key="1" title={
            width < 1200 ? <Tooltip key="overview" color="primary" content="Teamroom Overview" className="capitalize"><PlagiarismIcon /></Tooltip> :
              <div className="flex items-center space-x-2">
                <PlagiarismIcon />
                <span>Teamroom Overview</span>
              </div>
          } />
          <Tab key="2" title={
            width < 1200 ? <Tooltip key="accuracy" color="primary" content="Material Report" className="capitalize"><NetworkCheckIcon /></Tooltip> :
              <div className="flex items-center space-x-2">
                <NetworkCheckIcon />
                <span>Material Report</span>
              </div>
          } />
          <Tab key="3" title={
            width < 1200 ? <Tooltip key="performance" color="primary" content="Task Report" className="capitalize"><TimelineIcon /></Tooltip> :
              <div className="flex items-center space-x-2">
                <TimelineIcon />
                <span>Task Report</span>
              </div>
          } />
          <Tab key="4" title={
            width < 1200 ? <Tooltip key="Teamroom Feedbacks" color="primary" content="Teamroom Feedbacks" className="capitalize"><DriveFolderUploadIcon /></Tooltip> :
              <div className="flex items-center space-x-2">
                <DriveFolderUploadIcon />
                <span>Teamroom Feedbacks</span>
              </div>
          } />
          <Tab key="5" title={
            width < 1200 ? <Tooltip key="aiSuggestions" color="primary" content="Give Feedback" className="capitalize"><AutoFixHighIcon /></Tooltip> :
              <div className="flex items-center space-x-2">
                <AutoFixHighIcon />
                <span>Give Feedback</span>
              </div>
          } />
        </Tabs>
      </div>
      <div className='bg-white-default p-4 rounded-md h-auto  items-center'>
        {chart === 1 && (
          <div className="container items-center px-4 py-8 m-auto">
            <div className="flex flex-wrap pb-3 mx-4 md:mx-24 lg:mx-0">
              <StatCard value={materialCount} title="Total Material" />
              <StatCard value={taskCount} title="Total Tasks" />
              <StatCard value={membersCount} title="Members Count" />
            </div>
          </div>
        )}
        {chart === 2 && (
          <div className='text-center flex-col w-full'>


            {materialScores.map((material) => (
              <div key={material.description} style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8">
                <h2 className="mb-8 text-xl font-mono">{material.description}</h2>
                {material.totalFeedbackCount > 0 && (
                  <BarChart

                    xAxis={[{ scaleType: 'band', data: ['Communication', 'Collaboration', 'Accountability'] }]}
                    series={[{ data: [material.fullCommunicationStars,  material.fullCollaborationStars,material.fullAccountabilityStars], label: 'Scrore' }, { data: [material.totalReliabilityStars, material.totalUnderstandabilityStars, material.totalUsefulnessStars], label: 'Full Score' }]}
                    width={500}
                    height={300}
                  />
                )}
                {material.totalFeedbackCount === 0 && <p>No feedback found</p>}
              </div>
            ))}
            {materialFeedbackEmotions.map((material, index) => (
              <div key={index}  className="pt-12">
                <h2 className="mb-8 text-xl font-mono">{material.description}</h2>
                {material.positiveFeedbackCount !== 0 || material.negativeFeedbackCount !== 0 ? (
                  <div className='w-full xl:w-2/3 mx-auto'>
                    <PieChart
                      series={[
                        {
                          data: [{ id: 0, value: material.positiveFeedbackCount, label: 'Positive Feedback' },
                          { id: 1, value: material.negativeFeedbackCount, label: 'Negative Feedback' },],
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                        },
                      ]}
                      height={isSmallScreen ? 100 : isMediumScreen ? 200 : 250}
                    />
                  </div>
                ) : (
                  <p>No Feedback found</p>
                )}
              </div>
            )
            )
            }

          </div>
        )}
        {chart === 3 && (
          <div className='text-center flex-col w-full'>
            {taskScores.map((task) => (
              <div key={task.description}style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8" >
                <h2 className="mb-8 text-xl font-mono">{task.description}</h2>
                {task.totalFeedbackCount > 0 && (
                  <BarChart

                    xAxis={[{ scaleType: 'band', data: ['Communication', 'Collaboration', 'Accountability'] }]}
                    series={[{ data: [task.fullCommunicationStars,  task.fullCollaborationStars,task.fullAccountabilityStars], label: 'Scrore' }, { data: [task.totalReliabilityStars, task.totalUnderstandabilityStars, task.totalUsefulnessStars], label: 'Full Score' }]}
                    width={500}
                    height={300}
                  />
                )}
                {task.totalFeedbackCount === 0 && <p>No feedback found</p>}
              </div>
            ))}
            {taskFeedbackEmotions.map((task, index) => (
              <div>
                <h2 className="mb-8 text-xl font-mono">{task.description}</h2>
                {task.positiveFeedbackCount !== 0 || task.negativeFeedbackCount !== 0 ? (
                  <div className='w-full xl:w-2/3 mx-auto'>
                    <PieChart
                      series={[
                        {
                          data: [{ id: 0, value: task.positiveFeedbackCount, label: 'Positive Feedback' },
                          { id: 1, value: task.negativeFeedbackCount, label: 'Negative Feedback' },],
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                        },
                      ]}
                      height={isSmallScreen ? 100 : isMediumScreen ? 200 : 250}
                    />
                  </div>
                ) : (
                  <p>No Feedback found</p>
                )}
              </div>
            )
            )
            }

          </div>
        )}
        {chart === 4 && (
          <div className='flex justify-center items-center'>
            <div className='w-full'>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: teamPositiveFeedback, label: 'Positive Feedback' },
                      { id: 1, value: teamNegativeFeedback, label: 'Negative Feedback' },
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -20, color: 'gray' },
                  },
                ]}
                height={isSmallScreen ? 100 : isMediumScreen ? 200 : 250}
              />
            </div>
          </div>
        )}
        {chart === 5 && (
          <div>
            <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
              <Alert
                onClose={handleClose}
                severity={isError ? "error" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {isError ? errorMessage : successMessage}
              </Alert>
            </Snackbar>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              name='feedback'
              label="Give Teamroom Feedback"
              variant="bordered"
              labelPlacement="inside"
              color="primary"
            />
            <div className='flex justify-end p-4 pr-0'>
              <Button variant="contained" endIcon={<SendIcon />} onClick={(e) => handleSubmit(e)}>
                Send
              </Button>
            </div>
          </div>


        )}
      </div>
    </div>
  )
}

export default Analytics
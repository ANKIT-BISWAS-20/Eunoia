import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLoaderData } from 'react-router-dom'
import axios from 'axios'
import { Backend_url } from '../../../../../BackendUrl'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { useNavigate } from 'react-router-dom'

function MemberLiveSession() {
  const navigate = useNavigate();
  const { teamId,liveSessionId } = useParams();
  const data = useLoaderData();
  const [name, setName] = useState('');
  const [id, setId] = useState('');


  const myMeeting = async (element) => {
    const appId = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID);
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVERSECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, liveSessionId, id, name);
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    // zc.addPlugins({ZegoSuperBoardManager});

    zc.joinRoom({

      container: element, 
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      // onJoinRoom: () => {
      //     window.location.reload();
      // },
      onLeaveRoom: () => {
        Window.location.reload();
      },
      // showTurnOffRemoteCameraButton: true,
      // showTurnOffRemoteMicrophoneButton: true,
      // showRemoveUserButton: true,
      turnOnMicrophoneWhenJoining: false,
      turnOnCameraWhenJoining: false,
      showPreJoinView: false,
      // whiteboardConfig: {            
      //     showAddImageButton: true, 
      //  },


    })
  }

  useEffect(() => {
    setId(data?.data._id)
    setName(data?.data.fullName)
  }, [data?.data._id, data?.data.fullName])

  return (
    <div style={{
      height: "calc(100vh - 4.3rem)",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      overflowX: "hidden",
    }} className='bg-white-default'>
      <div style={{ width: "100%", height: "100%" }} ref={myMeeting} />
    </div>
  )
}

export default MemberLiveSession;

export const MemberInfoLoader_1 = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/users/get-current-member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
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
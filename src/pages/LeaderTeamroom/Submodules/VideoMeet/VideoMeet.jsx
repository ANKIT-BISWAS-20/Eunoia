import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../../../BackendUrl';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function LeaderLiveSession() {
  const navigate = useNavigate();
  const { teamId, liveSessionId } = useParams();
  const data = useLoaderData();
  const [userInfo, setUserInfo] = useState({ id: '', name: '' });

  const initializeMeeting = async (element) => {
    try {
      const appId = parseInt(import.meta.env.VITE_ZEGOCLOUD_APPID);
      const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVERSECRET;

      if (!appId || !serverSecret || !liveSessionId || !userInfo.id || !userInfo.name) {
        console.error('Missing required parameters for meeting initialization');
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        liveSessionId,
        userInfo.id,
        userInfo.name
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);

      zc.joinRoom({
        container: element,
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        onLeaveRoom: () => {
          Window.location.reload();
        },
        showTurnOffRemoteCameraButton: true,
        showTurnOffRemoteMicrophoneButton: true,
        showRemoveUserButton: true,
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showPreJoinView: false,
      });
    } catch (error) {
      console.error('Error initializing meeting:', error);
    }
  };

  useEffect(() => {
    if (data?.data) {
      setUserInfo({ id: data.data._id || '', name: data.data.fullName || '' });
    }
  }, [data?.data]);

  return (
    <div
      style={{
        height: 'calc(100vh - 4.3rem)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      className="bg-white-default"
    >
      <div style={{ width: '100%', height: '100%' }} ref={initializeMeeting} />
    </div>
  );
}

export default LeaderLiveSession;

export const LeaderInfoLoader_1 = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await axios.get(`${Backend_url}/api/v1/users/get-current-leader`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading leader info:', error);
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

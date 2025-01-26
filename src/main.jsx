import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignupPage from './pages/Signup/SignupPage'
import LandingPageMain from './pages/Landing/LandingPageMain/LandingPageMain'
import { NextUIProvider } from "@nextui-org/react";
import MemberDashboard from './pages/MemberDashboard/MemberDashboardMain/MemberDashboardMain'
import AllTeams from './pages/MemberDashboard/Submodules/Home/Home'
import MemberProgress from './pages/MemberDashboard/Submodules/MemberProgress/MemberProgress'
import MemberTeams from './pages/MemberDashboard/Submodules/MemberTeams/MemberTeams'
import MemberTeamroom from './pages/MemberTeamroom/MemberTeamroomMain/MemberTeamroomMain'
import Analytics from './pages/MemberTeamroom/Submodules/Analytics/Analytics'
import Resources from './pages/MemberTeamroom/Submodules/Resources/ResourcesMain/Resources'
import Tasks from './pages/MemberTeamroom/Submodules/Tasks/TasksMain/Tasks'
import LiveSessions from './pages/MemberTeamroom/Submodules/LiveSessions/LiveSessions'
import Members from './pages/MemberTeamroom/Submodules/Members/MembersMain/Members'
import LeaderDashboardMain from './pages/LeaderDashboard/LeaderDashboardMain/LeaderDashboardMain'
import CreateTeam from './pages/LeaderDashboard/Submodules/CreateTeam/CreateTeam'
import LeaderTeamroom from './pages/LeaderTeamroom/LeaderTeamroomMain/LeaderTeamroomMain'
import LeaderAnalytics from './pages/LeaderTeamroom/Submodules/Analytics/LeaderAnalytics'
import Materials from './pages/LeaderTeamroom/Submodules/Materials/Materials'
import LeaderTasks from './pages/LeaderTeamroom/Submodules/Tasks/LeaderTasks'
import LeaderLiveSessions from './pages/LeaderTeamroom/Submodules/LiveSessions/LeaderLiveSessions'
import LeaderTeamMembers from './pages/LeaderTeamroom/Submodules/LeaderTeamMembers/LeaderTeamMembers'
import NotFound from './components/Global/NotFound/NotFound'
import JoinInvitations from './pages/LeaderTeamroom/Submodules/LeaderTeamMembers/LeaderTeamJoinInvitaions'


import { memberInfoLoader } from './pages/MemberDashboard/MemberDashboardMain/MemberDashboardMain.jsx'
import { memberAllTeamsInfoLoader } from './pages/MemberDashboard/Submodules/Home/Home'
import { memberMyTeamsInfoLoader } from './pages/MemberDashboard/Submodules/MemberTeams/MemberTeams'
import { leaderInfoLoader } from './pages/LeaderDashboard/LeaderDashboardMain/LeaderDashboardMain'
import {leaderMyTeamsInfoLoader} from './pages/LeaderDashboard/Submodules/CreateTeam/CreateTeam.jsx'
import { LeaderInfoLoader_1 } from './pages/LeaderTeamroom/Submodules/VideoMeet/VideoMeet.jsx'
import LeaderLiveSession from './pages/LeaderTeamroom/Submodules/VideoMeet/VideoMeet.jsx'
import { MemberInfoLoader_1 } from './pages/MemberTeamroom/Submodules/VideoMeetMember/VideoMeetMember'
import MemberLiveSession from './pages/MemberTeamroom/Submodules/VideoMeetMember/VideoMeetMember'
import ErrorBoundaryPage from './components/Global/ErrorBoundary/ErrorBoundary.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* auth  */}
      <Route path="/*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* landing */}
      <Route path="" element={<LandingPageMain />}/>
        

      {/* member dashboard */}
      <Route loader={memberInfoLoader} path="/Member/" errorElement={ErrorBoundaryPage} element={<MemberDashboard />}>
        <Route loader={memberAllTeamsInfoLoader} path="Home" element={<AllTeams />} />
        <Route path="Progress" loader={memberInfoLoader} element={<MemberProgress />} />
        <Route loader={memberMyTeamsInfoLoader} path="Teams" element={<MemberTeams />} />
      </Route>

      {/* member teamroom */}
      <Route path="/Member-Teamroom/:teamId" loader={memberInfoLoader} errorElement={ErrorBoundaryPage} element={<MemberTeamroom />}>
        <Route path="Analytics" element={<Analytics />} />
        <Route path="Resources" element={<Resources />} />
        <Route path="Tasks" element={<Tasks />} />
        <Route path="LiveSessions" element={<LiveSessions />} />
        <Route loader={MemberInfoLoader_1} path='LiveSessions/:liveSessionId' element={<MemberLiveSession />} />
        <Route path="Members" element={<Members />} />
      </Route>

      {/* leader dashboard */}
      <Route path="/Leader/" loader={leaderInfoLoader} errorElement={ErrorBoundaryPage} element={<LeaderDashboardMain />}>
        <Route path="Home" loader={leaderMyTeamsInfoLoader} element={<CreateTeam />} />
      </Route>


      {/* leader teamroom */}
      <Route path="/Leader-Teamroom/:teamId" loader={leaderInfoLoader} errorElement={ErrorBoundaryPage} element={<LeaderTeamroom />}>
        <Route path="Analytics" element={<LeaderAnalytics />} />
        <Route path="Resources" element={<Materials />} />
        <Route path="Tasks" element={<LeaderTasks />} />
        <Route path="LiveSessions" element={<LeaderLiveSessions />} />
        <Route loader={LeaderInfoLoader_1} path='LiveSessions/:liveSessionId' element={<LeaderLiveSession />} />
        <Route path="Members" element={<LeaderTeamMembers />} />
        <Route path="JoinInvitations" element={<JoinInvitations />} />
      </Route>
    </Route>
  )
)




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>,
)

import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from './users/LoginPage'
import Regsiter from './users/Regsiter'
import ForgotPassword from './users/ForgotPassword'
import ResetPassword from './users/ResetPassword'
import Profile from './users/Profile'
import { ProtectedResetPasswordRoute, ProtectedRoutes, PublicRoutes } from './utils/PublicProtectedRoutes'
import PendingTasks from './tasks/PendingTasks'
import MissedTasks from './tasks/MissedTasks'
import CompletedTasks from './tasks/CompletedTasks'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './contexts/UserProvider'
import Layout from './components/Layout'

const App = () => {
  return (
    <>
    <Toaster position='top-center' reverseOrder='false'/>
    <Router>
      <UserProvider>
        <Routes>
          <Route element={<PublicRoutes/>}>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<Regsiter/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
          </Route>
          <Route element={<ProtectedResetPasswordRoute/>}>
            <Route path='/reset-password' element={<ResetPassword/>}/>
          </Route>

            <Route element={<ProtectedRoutes/>}>
              <Route element={<Layout/>}>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/pending-tasks' element={<PendingTasks/>}/>
                <Route path='/missed-tasks' element={<MissedTasks/>}/>
                <Route path='/completed-tasks' element={<CompletedTasks/>}/>
              </Route>
            </Route>
          
        </Routes>
      </UserProvider>
    </Router>
    </>
  )
}

export default App

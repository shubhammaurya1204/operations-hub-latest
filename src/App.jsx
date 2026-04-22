import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './Components/COMMON/ProtectedRoute'

import SalesPannel from './Pages/SALES/SalesPannel'
import ScrollToTop from './Components/COMMON/ScrollToTop'
import Home from './PAGES/HOME/Home'
import Register from './PAGES/LOGIN/Register'
import Login from './PAGES/LOGIN/Login'
import Unauthorized from './PAGES/LOGIN/Unauthorized'
import AdminDashboard from './PAGES/ADMIN/AdminDashboard'
import HRDashboard from './Pages/CAREER/HRDashboard'
import ApplicationDetail from './PAGES/CAREER/ApplicationDetail'
import DisplayJobsOnHr from './Pages/CAREER/DisplayJobsOnHr'
import ImageUploader from './Components/IMAGE-UPLOADER/ImageUploader'


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* pages */}
        <Route path='/' element={<Home/>}/>

        {/* LOGIN / REGISTER */}
        <Route path='/register' element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* HR PANEL*/}
        <Route 
        path="/hr/dashboard" 
        element={
         <ProtectedRoute>
          <HRDashboard />
        </ProtectedRoute>
        } 
      />

        <Route path="/hr/application/:id" element={<ApplicationDetail />} />
        <Route path="/hr/jobs" element={<DisplayJobsOnHr />} />


        {/* SALES PANEL */}
        <Route
          path="/sales-dashboard"
          element={
            <ProtectedRoute>
              <SalesPannel />
            </ProtectedRoute>
          }
        />
        
        {/* IMAGE UPLOADER */}
        <Route path='/image-upload' element={<ImageUploader/>} />

        {/* Catch-all */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

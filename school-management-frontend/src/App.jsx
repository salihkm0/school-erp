import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import LoadingSpinner from './components/common/LoadingSpinner'
import { checkAuth } from './store/slices/authSlice'
import { fetchSchoolProfile } from './store/slices/schoolProfileSlice'
import useSocketInit from './hooks/useSocketInit'
import useFCMToken from './hooks/useFCMToken.jsx'
import { Toaster } from 'react-hot-toast'

// Lazy loaded page components
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const StudentsPage = lazy(() => import('./pages/StudentsPage'))
const StaffPage = lazy(() => import('./pages/StaffPage'))
const ClassesPage = lazy(() => import('./pages/ClassesPage'))
const ExamsPage = lazy(() => import('./pages/ExamsPage'))
const AttendancePage = lazy(() => import('./pages/AttendancePage'))
const DutiesPage = lazy(() => import('./pages/DutiesPage'))
const ParentsPage = lazy(() => import('./pages/ParentsPage'))
const SubjectsPage = lazy(() => import('./pages/SubjectsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const TimetablePage = lazy(() => import('./pages/TimetablePage'))
const FeeManagementPage = lazy(() => import('./pages/FeeManagementPage'))
const PdfReports = lazy(() => import('./components/pdf/PdfReports'))

// Legal Pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./pages/legal/TermsAndConditions'))

// Staff pages
const MyClassesPage = lazy(() => import('./pages/staff/MyClassesPage'))
const MyDutiesPage = lazy(() => import('./pages/staff/MyDutiesPage'))
const StaffAttendancePage = lazy(() => import('./pages/staff/StaffAttendancePage'))
const StaffExamsPage = lazy(() => import('./pages/staff/StaffExamsPage'))
const MarksEntryRouter = lazy(() => import('./pages/staff/MarksEntry/MarksEntryRouter'))
const ClassMarksOverview = lazy(() => import('./pages/staff/ClassMarksOverview/ClassMarksOverview'))
const ExamForm = lazy(() => import('./components/exams/ExamForm'))
const ExamReview = lazy(() => import('./components/exams/ExamReview'))
const HistoricalRecordsFlow = lazy(() => import('./pages/admin/HistoricalRecords/HistoricalRecordsFlow'))

// Parent pages
const MyChildrenPage = lazy(() => import('./pages/parent/MyChildrenPage'))
const MyChildAttendancePage = lazy(() => import('./pages/parent/MyChildAttendancePage'))
const MyChildResultsPage = lazy(() => import('./pages/parent/MyChildResultsPage'))
const MyChildFeesPage = lazy(() => import('./pages/parent/MyChildFeesPage'))

// Historical records (standalone — does not affect main system)
const HistoricalImport = lazy(() => import('./pages/admin/HistoricalImport'))

// Open Dashboard
const OpenDashboardRouter = lazy(() => import('./pages/open/OpenDashboardRouter'))
const OpenLogin = lazy(() => import('./pages/open/OpenLogin'))

// Administration
const AdministrationLogin = lazy(() => import('./pages/administration/AdministrationLogin'))
const AdministrationLayout = lazy(() => import('./pages/administration/AdministrationLayout'))
const AdministrationDashboard = lazy(() => import('./pages/administration/AdministrationDashboard'))
const SystemLogs = lazy(() => import('./pages/administration/SystemLogs'))
const AuditLog = lazy(() => import('./pages/administration/AuditLog'))
const BroadcastCenter = lazy(() => import('./pages/administration/BroadcastCenter'))
const UserManagement = lazy(() => import('./pages/administration/UserManagement'))
const ActiveUsers = lazy(() => import('./pages/administration/ActiveUsers'))

function App() {
  const dispatch = useDispatch()
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth)
  const { profile: schoolProfile } = useSelector((state) => state.schoolProfile)
  const { isConnected, socket } = useSocketInit()
  
  // Initialize Firebase Cloud Messaging
  useFCMToken(isAuthenticated)
  
  const { user } = useSelector((state) => state.auth)
  const [isMaintenance, setIsMaintenance] = useState(false)

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(fetchSchoolProfile())
  }, [dispatch])

  useEffect(() => {
    if (schoolProfile?.name) {
      document.title = `${schoolProfile.name} | School ERP`;
    }
    if (schoolProfile?.branding?.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = schoolProfile.branding.faviconUrl;
    }
  }, [schoolProfile])

  useEffect(() => {
    if (socket) {
      const handleMaintenance = (data) => {
        // Administration users bypass maintenance mode entirely
        if (user?.role !== 'administration') {
          setIsMaintenance(data.enabled);
        }
      };
      
      socket.on('maintenance_mode_changed', handleMaintenance);
      
      return () => {
        socket.off('maintenance_mode_changed', handleMaintenance);
      };
    }
  }, [socket, user]);

  useEffect(() => {
    const handleMaintenanceEvent = () => {
      if (user?.role !== 'administration') {
        setIsMaintenance(true);
      }
    };
    
    window.addEventListener('maintenance_mode_on', handleMaintenanceEvent);
    
    return () => {
      window.removeEventListener('maintenance_mode_on', handleMaintenanceEvent);
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isMaintenance && user?.role !== 'administration' ? (
        <div className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
            <div className="w-24 h-24 bg-gray-800 rounded-full flex flex-col items-center justify-center mx-auto mb-6 relative">
              <svg className="w-12 h-12 text-orange-400 animate-[spin_3s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg className="w-6 h-6 text-orange-300 animate-[spin_2s_linear_infinite_reverse] absolute bottom-3 right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Under Maintenance</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We are currently performing system upgrades or maintenance to improve your experience. 
              Please check back later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium border border-gray-700 w-full"
            >
              Refresh Status
            </button>
          </div>
        </div>
      ) : null}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          } />

          {/* Public Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'parent']}>
              <Layout />
            </ProtectedRoute>
          } >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="students/*" element={<StudentsPage />} />
            <Route path="staff/*" element={<StaffPage />} />
            <Route path="classes/*" element={<ClassesPage />} />
            <Route path="exams/*" element={<ExamsPage />} />
            <Route path="attendance/*" element={<AttendancePage />} />
            <Route path="duties/*" element={<DutiesPage />} />
            <Route path="events/*" element={<EventsPage />} />
            <Route path="timetable/*" element={<TimetablePage />} />
            <Route path="fees/*" element={<FeeManagementPage />} />
            <Route path="parents/*" element={<ParentsPage />} />
            <Route path="subjects/*" element={<SubjectsPage />} />
            <Route path="reports/*" element={<ReportsPage />} />
            <Route path="notifications/*" element={<NotificationsPage />} />
            <Route path="settings/*" element={<SettingsPage />} />
            <Route path="pdf-reports" element={<PdfReports />} />

            {/* Staff routes */}
            <Route path="staff/my-classes" element={<MyClassesPage />} />
            <Route path="staff/my-duties" element={<MyDutiesPage />} />
            <Route path="staff/attendance" element={<StaffAttendancePage />} />
            <Route path="staff/exams" element={<StaffExamsPage />} />
            <Route path="staff/exams/create" element={<ExamForm />} />
            <Route path="staff/exams/edit/:id" element={<ExamForm />} />
            <Route path="staff/exams/results/:examId" element={<ExamReview />} />
            <Route path="staff/marks-entry/*" element={<MarksEntryRouter />} />
            <Route path="staff/class-marks/:classId" element={<ClassMarksOverview />} />
            <Route path="staff/class-marks" element={<ClassMarksOverview />} />
            <Route path="admin/class-marks/:classId" element={<ClassMarksOverview />} />
            <Route path="admin/class-marks" element={<ClassMarksOverview />} />

            {/* Parent routes */}
            <Route path="my-children" element={<MyChildrenPage />} />
            <Route path="my-child-attendance" element={<MyChildAttendancePage />} />
            <Route path="my-child-results" element={<MyChildResultsPage />} />  
            <Route path="my-child-fees" element={<MyChildFeesPage />} />  

            {/* Historical import — admin only */}
            <Route path="historical-records/*" element={<HistoricalRecordsFlow />} />
            <Route path="admin/marks-entry/*" element={<MarksEntryRouter />} />
          </Route>        

          <Route path="/open/login" element={
            <PublicRoute>
              <OpenLogin />
            </PublicRoute>
          } />

          {/* Administration Routes */}
          <Route path="/administration/login" element={
            <PublicRoute>
              <AdministrationLogin />
            </PublicRoute>
          } />

          <Route path="/administration" element={
            <ProtectedRoute allowedRoles={['administration']}>
              <AdministrationLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdministrationDashboard />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="broadcast" element={<BroadcastCenter />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="active-users" element={<ActiveUsers />} />
          </Route>

          <Route path="/open/*" element={
            <ProtectedRoute allowedRoles={['open']}>
              <OpenDashboardRouter />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

import Header from "./component/_component/header.js";
import Footer from "./component/_component/footer.js";

import Login from "./component/AuthPage/login.js";
import Register from "./component/AuthPage/register.js";
import ResetPassword from "./component/AuthPage/resetPassword.js";

import HomePage from "./component/HomePage/index.js";
import JobSeekerPage from "./component/JobSeekersPage/index.js";
import JobSeekerOverview from "./component/JobSeekersPage/Overview/index.js";
import JobSeekerProfile from "./component/JobSeekersPage/Profile/index.js";
import JobSeekerWork from "./component/JobSeekersPage/MyWork/index.js";
import JobSeekerCompany from "./component/JobSeekersPage/MyCompany/index.js";
import JobSeekerNotification from "./component/JobSeekersPage/MyNotification/index.js";
import JobseekerAccountSetting from "./component/JobSeekersPage/AccountSetting/index.js";

import YourCV from "./component/JobSeekersPage/Profile/yourCV.js";
import YourCVwithUs from "./component/JobSeekersPage/Profile/yourCVwithUs.js";

import CompanyYouFollow from "./component/JobSeekersPage/MyCompany/companyYouFollow.js";

import YourApply from "./component/JobSeekersPage/MyWork/yourApply.js";
import SavedWork from "./component/JobSeekersPage/MyWork/savedWork.js";

import EmployerPage from "./component/EmployerPage/index.js";
import EmployerOverview from "./component/EmployerPage/Overview/index.js";
import EmployerProfile from "./component/EmployerPage/Profile/index.js";
import EmployerManageApplication from "./component/EmployerPage/Profile/ManageApplication.js";
import EmployerManageCandidate from "./component/EmployerPage/Profile/ManageCandidate.js";
import EmployerManageInvitation from "./component/EmployerPage/Profile/ManageInvitations.js";

import CompanyProfile from "./component/EmployerPage/Profile/companyProfile.js";
import EmployerPost from "./component/EmployerPage/MyPost/index.js";
import EmployerNotification from "./component/EmployerPage/MyNotification/index.js";
import EmployerAccountSetting from "./component/EmployerPage/AccountSetting/index.js";

import WorkMangePage from "./component/HomePage/WorkManagePage/index.js";
import WorkDetail from "./component/HomePage/WorkManagePage/workDetail.js";

import CandidateMaganePage from "./component/EmployerPage/CandidateMaganePage/index.js";
import JobseekerDetail from "./component/EmployerPage/CandidateMaganePage/JobseekerDetail.js";

import ListCompany from "./component/HomePage/companyManage/index.js";
import CompanyDetail from "./component/HomePage/companyManage/companyDetail.js";

import PageNotFound from "./component/PageNotFound/index.js";

import ContactPage from "./component/ContactPage/index.js";
import PolicyPage from "./component/PolicyPage/index.js";
import AboutPage from "./component/AboutPage/index.js";
import TermsPage from "./component/TermsPage/index.js";
import HelpPage from "./component/HelpPage/index.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* JobSeeker Routes - Note the nesting structure */}
          <Route path="/jobseeker" element={
            <ProtectedRoute allowedRoles={[3]}>
              <JobSeekerPage />
            </ProtectedRoute>
          }>
            <Route path="overview" element={<JobSeekerOverview />} />
            <Route path="profile" element={<JobSeekerProfile />}>
              <Route index element={<YourCVwithUs />} />
              <Route path="upload" element={<YourCV />} />
            </Route>
            <Route path="company-follow" element={<CompanyYouFollow />} />
            <Route path="mywork" element={<JobSeekerWork />}>
              <Route path="your-apply" element={<YourApply />} />
              <Route path="saved-work" element={<SavedWork />} />
            </Route>
            <Route path="notification" element={<JobSeekerNotification />} />
            <Route path="account" element={<JobseekerAccountSetting />} />
          </Route>

          {/* Employer Routes - Now nested under /employer */}
          <Route path="/employer" element={
            <ProtectedRoute allowedRoles={[2]}>
              <EmployerPage />
            </ProtectedRoute>
          }>
            <Route path="overview" element={<EmployerOverview />} />
            <Route path="profile" element={<EmployerProfile />}>
              <Route index element={<CompanyProfile />} />
              <Route path="manage-application" element={<EmployerManageApplication />} />
              <Route path="manage-saving-candidate" element={<EmployerManageCandidate />} />
              <Route path="manage-invitation" element={<EmployerManageInvitation />} />
            </Route>
            <Route path="post" element={<EmployerPost />} />
            <Route path="notification" element={<EmployerNotification />} />
            <Route path="account" element={<EmployerAccountSetting />} />
          </Route>

          {/* Public routes */}
          <Route path="/post" element={<WorkMangePage />} />
          <Route path="/post-detail/:id" element={<WorkDetail />} />
          <Route path="/candidates" element={<ProtectedRoute allowedRoles={[2]}><CandidateMaganePage /></ProtectedRoute>} />
          <Route path="/candidate-detail/:id" element={ <ProtectedRoute allowedRoles={[2]}><JobseekerDetail /> </ProtectedRoute>} />
          <Route path="/list-company" element={<ListCompany />} />
          <Route path="/company-detail/:companyId" element={<CompanyDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpPage />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

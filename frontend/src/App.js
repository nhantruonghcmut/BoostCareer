import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";

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

import yourCV from "./component/JobSeekersPage/Profile/yourCV.js";
import yourCVwithUs from "./component/JobSeekersPage/Profile/yourCVwithUs.js";

import CompanyYouFollow from "./component/JobSeekersPage/MyCompany/companyYouFollow.js";

import YourApply from "./component/JobSeekersPage/MyWork/yourApply.js";
import SavedWork from "./component/JobSeekersPage/MyWork/savedWork.js";
// import Invitation from "./component/JobSeekersPage/MyWork/invitation.js";


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
          <Route path="/" Component={HomePage} />

          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/reset-password" Component={ResetPassword} />

          <Route Component={JobSeekerPage}>
            <Route path="/jobseeker-overview" Component={JobSeekerOverview} />
            <Route Component={JobSeekerProfile}>
              <Route path="/jobseeker-profile" Component={yourCVwithUs} />
              <Route path="/jobseeker-profile/upload" Component={yourCV} />
            </Route>
            <Route Component={JobSeekerCompany}>
              {/* <Route path="/jobseeker-mycompany" Component={CompanySeeYou} /> */}
              <Route
                path="/jobseeker-company-follow"
                Component={CompanyYouFollow}
              />
            </Route>
            <Route Component={JobSeekerWork}>
              <Route path="/jobseeker-mywork" Component={YourApply} />
              <Route path="/jobseeker-savedwork" Component={SavedWork} />
              {/* <Route path="/jobseeker-invitation" Component={Invitation} /> */}
            </Route>
            <Route
              path="/jobseeker-notification"
              Component={JobSeekerNotification}
            />

            <Route
              path="/jobseeker-account"
              Component={JobseekerAccountSetting}
            />
          </Route>

          <Route Component={EmployerPage}>
            <Route path="/employer-overview" Component={EmployerOverview} />
            <Route Component={EmployerProfile}>
              <Route path="/employer-profile" Component={CompanyProfile} />
              <Route
                path="/employer-manage-application"
                Component={EmployerManageApplication}
              />
              <Route
                path="/employer-manage-saving-candidate"
                Component={EmployerManageCandidate}
              />
              <Route 
              path="/employer-manage-invitation"
              Component={EmployerManageInvitation}
              />
            </Route>
            <Route path="/employer-post" Component={EmployerPost} />
            <Route
              path="/employer-notification"
              Component={EmployerNotification}
            />

            <Route
              path="/employer-account"
              Component={EmployerAccountSetting}
            />
          </Route>

          <Route path="/post" Component={WorkMangePage} />

          <Route path="/post-detail/:id" Component={WorkDetail} />

          <Route path="/candidates" Component={CandidateMaganePage} />

          <Route path="/candidate-detail/:id" Component={JobseekerDetail} />

          {/* Anh Đạt làm 2 cái này */}
          <Route path="/list-company" Component={ListCompany} />
          <Route path="/company-detail/:companyId" Component={CompanyDetail} />

          <Route path="/contact" Component={ContactPage} />
          <Route path="/policy" Component={PolicyPage} />
          <Route path="/about" Component={AboutPage} />
          <Route path="/terms" Component={TermsPage} />
          <Route path="/help" Component={HelpPage} />

          <Route path="*" Component={PageNotFound} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

import "./App.css";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoute";
import setupAxiosInterceptors from "./utils/axiosInterceptor";
import Header from "./component/_component/header.js";
import Footer from "./component/_component/footer.js";

/**
 * Mọi page đều lazy-load: bundle đầu chỉ còn shell (Header/Footer/router/store).
 * Trước đây 38 page được import tĩnh nên user tải toàn bộ app chỉ để xem trang chủ.
 */
const HomePage = lazy(() => import("./component/HomePage/index.js"));

const Login = lazy(() => import("./component/AuthPage/login.js"));
const Register = lazy(() => import("./component/AuthPage/register.js"));
const ResetPassword = lazy(() => import("./component/AuthPage/resetPassword.js"));

const JobSeekerPage = lazy(() => import("./component/JobSeekersPage/index.js"));
const JobSeekerOverview = lazy(() => import("./component/JobSeekersPage/Overview/index.js"));
const JobSeekerProfile = lazy(() => import("./component/JobSeekersPage/Profile/index.js"));
const JobSeekerWork = lazy(() => import("./component/JobSeekersPage/MyWork/index.js"));
const JobSeekerNotification = lazy(() => import("./component/JobSeekersPage/MyNotification/index.js"));
const JobseekerAccountSetting = lazy(() => import("./component/JobSeekersPage/AccountSetting/index.js"));
const YourCV = lazy(() => import("./component/JobSeekersPage/Profile/yourCV.js"));
const YourCVwithUs = lazy(() => import("./component/JobSeekersPage/Profile/yourCVwithUs.js"));
const CompanyYouFollow = lazy(() => import("./component/JobSeekersPage/MyCompany/companyYouFollow.js"));
const YourApply = lazy(() => import("./component/JobSeekersPage/MyWork/yourApply.js"));
const SavedWork = lazy(() => import("./component/JobSeekersPage/MyWork/savedWork.js"));

const EmployerPage = lazy(() => import("./component/EmployerPage/index.js"));
const EmployerOverview = lazy(() => import("./component/EmployerPage/Overview/index.js"));
const EmployerProfile = lazy(() => import("./component/EmployerPage/Profile/index.js"));
const EmployerManageApplication = lazy(() => import("./component/EmployerPage/Profile/ManageApplication.js"));
const EmployerManageCandidate = lazy(() => import("./component/EmployerPage/Profile/ManageCandidate.js"));
const EmployerManageInvitation = lazy(() => import("./component/EmployerPage/Profile/ManageInvitations.js"));
const CompanyProfile = lazy(() => import("./component/EmployerPage/Profile/companyProfile.js"));
const EmployerPost = lazy(() => import("./component/EmployerPage/MyPost/index.js"));
const EmployerNotification = lazy(() => import("./component/EmployerPage/MyNotification/index.js"));
const EmployerAccountSetting = lazy(() => import("./component/EmployerPage/AccountSetting/index.js"));

const WorkMangePage = lazy(() => import("./component/HomePage/WorkManagePage/index.js"));
const WorkDetail = lazy(() => import("./component/HomePage/WorkManagePage/workDetail.js"));
const CandidateMaganePage = lazy(() => import("./component/EmployerPage/CandidateMaganePage/index.js"));
const JobseekerDetail = lazy(() => import("./component/EmployerPage/CandidateMaganePage/JobseekerDetail.js"));
const ListCompany = lazy(() => import("./component/HomePage/companyManage/index.js"));
const CompanyDetail = lazy(() => import("./component/HomePage/companyManage/companyDetail.js"));

const ContactPage = lazy(() => import("./component/ContactPage/index.js"));
const PolicyPage = lazy(() => import("./component/PolicyPage/index.js"));
const AboutPage = lazy(() => import("./component/AboutPage/index.js"));
const TermsPage = lazy(() => import("./component/TermsPage/index.js"));
const HelpPage = lazy(() => import("./component/HelpPage/index.js"));
const PageNotFound = lazy(() => import("./component/PageNotFound/index.js"));

const RouteFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </div>
  </div>
);

const jobseekerOnly = (element) => <ProtectedRoute allowedRoles={[3]}>{element}</ProtectedRoute>;
const employerOnly = (element) => <ProtectedRoute allowedRoles={[2]}>{element}</ProtectedRoute>;

function App() {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* JobSeeker */}
            <Route path="/jobseeker" element={jobseekerOnly(<JobSeekerPage />)}>
              <Route path="overview" element={<JobSeekerOverview />} />
              <Route path="profile" element={<JobSeekerProfile />}>
                <Route index element={<YourCVwithUs />} />
                <Route path="upload" element={<YourCV />} />
              </Route>
              <Route path="company-follow" element={<CompanyYouFollow />} />
              <Route path="mywork" element={<JobSeekerWork />}>
                <Route index element={<YourApply />} />
                <Route path="savedwork" element={<SavedWork />} />
              </Route>
              <Route path="notification" element={<JobSeekerNotification />} />
              <Route path="account" element={<JobseekerAccountSetting />} />
            </Route>

            {/* Employer */}
            <Route path="/employer" element={employerOnly(<EmployerPage />)}>
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

            {/* Public */}
            <Route path="/post" element={<WorkMangePage />} />
            <Route path="/post-detail/:id" element={<WorkDetail />} />
            <Route path="/candidates" element={employerOnly(<CandidateMaganePage />)} />
            <Route path="/candidate-detail/:id" element={employerOnly(<JobseekerDetail />)} />
            <Route path="/list-company" element={<ListCompany />} />
            <Route path="/company-detail/:companyId" element={<CompanyDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/help" element={<HelpPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

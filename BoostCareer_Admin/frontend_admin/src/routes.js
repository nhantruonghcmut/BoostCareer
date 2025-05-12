import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))

const account = React.lazy(() => import('./views/manage_account/account'))
const employer = React.lazy(() => import('./views/manage_employer/employer'))
const job = React.lazy(() => import('./views/manage_job/job'))
const jobseeker = React.lazy(() => import('./views/manage_jobseeker/jobseeker'))
// const messenger = React.lazy(() => import('./views/manage_messenger/messenger'))
// const catalog = React.lazy(() => import('./views/manage_catalog/catalog'))
// const backup = React.lazy(() => import('./views/manage_backup_restore/backup'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage_account', name: 'Account', element: account },
  { path: '/manage_employer', name: 'Employer', element: employer },
  { path: '/manage_job', name: 'Job', element: job },
  { path: '/manage_candidate', name: 'Jobseeker', element: jobseeker },
  // { path: '/manage_messenger', name: 'Messenger', element: messenger },
  // { path: '/manage_catalog', name: 'Catalog', element: catalog },
  // { path: '/manage_backup_restore', name: 'Backup & Restore', element: backup }, 
]

export default routes

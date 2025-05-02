import React from 'react'
import CIcon from '@coreui/icons-react'
import "bootstrap-icons/font/bootstrap-icons.css";
import {  
  cilHome,
} from '@coreui/icons'

import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Quản lý tài khoản',
    to: '/manage_account',
    icon: <i className="bi bi-person-lines-fill nav-icon"></i>,
  },
  {
    component: CNavItem, 
    name: 'Quản lý tin tuyển dụng',
    to: '/manage_job',
    icon: <i className="bi bi-briefcase nav-icon"></i>
  },
  {
    component: CNavItem, 
    name: 'Quản lý người tìm việc',
    to: '/manage_candidate',
    icon: <i className="bi bi-people nav-icon"></i>
  },
  {
    component: CNavItem,
    name: 'Quản lý nhà tuyển dụng',
    to: '/manage_employer',
    icon:  <i className="bi bi-buildings nav-icon"></i>
  },
  // {
  //   component: CNavItem, 
  //   name: 'Sao lưu và khôi phục',
  //   to: '/manage_backup',
  //   icon: <i className="bi bi-floppy nav-icon"></i>
  // },
  // {
  //   component: CNavItem, 
  //   name: 'Báo cáo',
  //   to: '/report',
  //   icon: <i className="bi bi-bar-chart nav-icon"></i>,
  // },
]

export default _nav

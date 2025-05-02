import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSidebarShow } from "../redux/slices/uiSlice";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { CImage } from '@coreui/react'
// import { logo } from 'src/assets/brand/logo'
import logo from "src/assets/images/LOGO_ADMIN.jpg";
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CImage fluid src={logo} alt="Logo" className='sidebar-brand logo-img' /> 
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  useGetCatalogIndustryQuery,
  useGetCatalogJobfunctionQuery,
  useGetCatalogJoblevelQuery,
  useGetCatalogNationQuery,
  useGetCatalogcityQuery,
  useGetCatalogDistrictQuery,
  useGetCatalogScaleQuery,
  useGetCatalogEducationQuery,
  useGetCatalogLanguageQuery,
  useGetCatalogBenifitQuery,
  useGetCatalogTagQuery 
} from "./redux/api/api_catalog";

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Authentication guard
import AuthGuard from './components/AuthGuard'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  // Fetch all catalog data needed for the application
  useGetCatalogIndustryQuery();
  useGetCatalogJobfunctionQuery();
  useGetCatalogcityQuery();
  useGetCatalogJoblevelQuery();
  useGetCatalogScaleQuery();
  useGetCatalogDistrictQuery();
  useGetCatalogEducationQuery();
  useGetCatalogLanguageQuery();
  useGetCatalogTagQuery();
  useGetCatalogNationQuery();

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [storedTheme, isColorModeSet, setColorMode])

  return (
    <Router>
      <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><CSpinner color="primary" /></div>}>
        <Routes>
          {/* Login page disabled temporarily */}
          {/* <Route path="/login" name="Login" element={<Login />} /> */}
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          {/* Bypass AuthGuard temporarily */}
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

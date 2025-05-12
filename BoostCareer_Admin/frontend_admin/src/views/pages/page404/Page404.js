import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Page404 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! Không tìm thấy trang.</h4>
              <p className="text-medium-emphasis float-start">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
            </div>
            <CButton color="primary" href="/">Trở về trang chủ</CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404

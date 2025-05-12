import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Page500 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">500</h1>
              <h4 className="pt-3">Oops! Đã xảy ra lỗi.</h4>
              <p className="text-medium-emphasis float-start">
                Hệ thống đã gặp sự cố. Vui lòng thử lại sau hoặc liên hệ với quản trị viên.
              </p>
            </div>
            <CButton color="primary" href="/">Trở về trang chủ</CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500

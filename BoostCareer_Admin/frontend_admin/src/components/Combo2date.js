import React from "react";
import { 
    CCard, 
    CCardBody, 
    CCardHeader,
    CRow,
    CCol,    
    CFormInput,
    CInputGroup,
    CInputGroupText
  } from "@coreui/react";

const Combo2date = ({
  className = "",
  header_2 = "Khoảng thời gian",
  startLabel = "Từ ngày",
  endLabel = "Đến ngày",
  onChange_1,
  onChange_2,
  ...props
}) => {
  return (
    <CCard className={className}>
    <CCardHeader><strong>{header_2}</strong></CCardHeader>
    <CCardBody>
      <CRow>
        <CCol xs="auto">
          <CInputGroup>
            <CInputGroupText>{startLabel}</CInputGroupText>
            <CFormInput type="date" onChange={(e) => onChange_1 && onChange_1(e.target.value)} {...props}/>
          </CInputGroup>
        </CCol>
        <CCol>
          <CInputGroup>
            <CInputGroupText>{endLabel}</CInputGroupText>
            <CFormInput type="date" onChange={(e) => onChange_2 && onChange_2(e.target.value)} {...props}/>
          </CInputGroup>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
);
};

export default Combo2date;
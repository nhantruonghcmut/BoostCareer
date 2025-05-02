import React from "react";
import {
  CRow,
  CCol,
  CButton,
  CFormInput,
  CContainer,
  CCard,
  CFormSelect 
} from "@coreui/react";
import { CIcon } from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

const SearchControlRow = ({
  className = "",
  marginTop = "3",
  marginBottom = "3",
  marginX = "3",
  pagingSize =10,
  setPageSize,
  onSearch,
  onChange, 
  is_job=true,
  onstatus,
  onDelete,
  ...props
}) => {
  // Tạo class margin từ các prop
  const marginClass = `mt-${marginTop} mb-${marginBottom} mx-${marginX} ${className}`;

  // Các style chung cho tất cả các nút để có chiều rộng bằng nhau
  const buttonStyle = {
    width: '100%'
  };

  return (
    <CContainer fluid className={marginClass} {...props}>

      <CRow className="gx-2">
        {/* Mỗi nút chiếm 2 columns cho tổng cộng 8/12 columns */}
        <CCol xs={1}>
          <CButton color="danger" style={buttonStyle} onClick={onDelete}>
            Xóa
          </CButton>
        </CCol>
        <CCol xs={1}>
          <CButton color="secondary" style={buttonStyle} onClick={() => onstatus(0)}>
            {is_job? "Ẩn tin": "Khóa"}
          </CButton>
        </CCol>
        <CCol xs={1}>
          <CButton color="success" style={buttonStyle} onClick={() => onstatus(1)}>
          {is_job? "Hiện tin tin": "Mở khóa"}
          </CButton>
        </CCol>

        {/* Input chiếm 4 columns */}
        <CCol xs={5}>
          <CFormInput placeholder="Tiêu đề tuyển dụng" onChange={(e) => onChange && onChange(e.target.value)} />
        </CCol>

        {/* Nút search chiếm 2 columns và có icon */}
        <CCol xs={1}>
          <CButton color="primary" type="button" style={buttonStyle} onClick={onSearch}>
            <CIcon icon={cilMagnifyingGlass} className="me-1" /> Search
          </CButton>
        </CCol>
        <CCol xs={1}>
          <CFormSelect
            // className="w-50 fs-5 p-2" // 👈 Tăng width, font-size, padding
            value={pagingSize}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setPageSize(newValue);
            }}
          >
            <option value="10">10 </option>
            <option value="20">20</option>
            <option value="50">50 </option>
            <option value="100">100</option>
          </CFormSelect>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default SearchControlRow;
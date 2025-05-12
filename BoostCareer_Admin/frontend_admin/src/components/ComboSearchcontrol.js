import React from "react";
import {
  CRow,
  CCol,
  CButton,
  CFormInput,
  CContainer,
  CCard,
  CFormSelect,
  CSpinner 
} from "@coreui/react";
import { CIcon } from '@coreui/icons-react';
import { cilMagnifyingGlass, cilTrash, cilLockLocked, cilLockUnlocked } from '@coreui/icons';

const SearchControlRow = ({
  className = "",
  marginTop = "3",
  marginBottom = "3",
  marginX = "3",
  pagingSize = 10,
  setPageSize,
  onSearch,
  onChange,
  is_job = true,
  onstatus,
  onDelete,
  disableActions = false,
  isDeleting = false,
  isUpdatingStatus = false,
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
          <CButton 
            color="danger" 
            style={buttonStyle} 
            onClick={onDelete}
            disabled={disableActions || isDeleting}
          >
            {isDeleting ? (
              <>
                <CSpinner size="sm" /> Đang xóa...
              </>
            ) : (
              <>
                <CIcon icon={cilTrash} className="me-1" /> Xóa
              </>
            )}
          </CButton>
        </CCol>
        <CCol xs={1}>
          <CButton 
            color="secondary" 
            style={buttonStyle} 
            onClick={() => onstatus(0)}
            disabled={disableActions || isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <CSpinner size="sm" />
            ) : (
              <>
                <CIcon icon={cilLockLocked} className="me-1" />
                {is_job ? "Ẩn tin" : "Khóa"}
              </>
            )}
          </CButton>
        </CCol>
        <CCol xs={1}>
          <CButton 
            color="success" 
            style={buttonStyle} 
            onClick={() => onstatus(1)}
            disabled={disableActions || isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <CSpinner size="sm" />
            ) : (
              <>
                <CIcon icon={cilLockUnlocked} className="me-1" />
                {is_job ? "Hiển thị" : "Mở khóa"}
              </>
            )}
          </CButton>
        </CCol>

        {/* Tìm kiếm */}
        <CCol xs={3}>
          <CFormInput
            type="text"
            placeholder={is_job ? "Tìm kiếm tin tuyển dụng..." : "Nhập tên hoặc email..."}
            onChange={(e) => onChange(e.target.value)}
            disabled={disableActions}
          />
        </CCol>
        
        <CCol xs={1}>
          <CButton 
            color="primary" 
            style={buttonStyle} 
            onClick={onSearch}
            disabled={disableActions}
          >
            <CIcon icon={cilMagnifyingGlass} />
          </CButton>
        </CCol>

        {/* Dropdown chọn số lượng hiển thị trên 1 trang */}
        <CCol xs={2}>
          <CFormSelect
            onChange={(e) => setPageSize(e.target.value)}
            value={pagingSize}
            disabled={disableActions}
            options={[
              { label: '10 kết quả/trang', value: '10' },
              { label: '20 kết quả/trang', value: '20' },
              { label: '50 kết quả/trang', value: '50' },
              { label: '100 kết quả/trang', value: '100' },
            ]}
          />
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default SearchControlRow;
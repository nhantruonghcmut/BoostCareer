import React from "react";
import { 
    CCard, 
    CCardBody, 
    CCardHeader,
    CRow,
    CCol,
    CFormInput
  } from "@coreui/react";

const Combo2Input = ({
    header_2 = "",
    holder1= 'Từ',
    holder2= 'Đến',
    onChange_1,
    onChange_2,
    ...props
}) => {
    return (
        <CCard>
            <CCardHeader><strong>{header_2}</strong></CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol xs="auto">
                        <CFormInput type="number" placeholder={holder1} min="0" onChange={(e) => onChange_1 && onChange_1(e.target.value)} {...props} />
                    </CCol>
                    <CCol>
                        <CFormInput type="number" placeholder={holder2} min="0" onChange={(e) => onChange_2 && onChange_2(e.target.value)} {...props}/>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );
};

export default Combo2Input;

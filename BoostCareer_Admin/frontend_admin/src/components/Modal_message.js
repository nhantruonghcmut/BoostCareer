import React, { useState } from 'react'
import {  CButton,  CModal,  CModalHeader,  CModalTitle,  CModalBody,  CModalFooter,  CForm,  CFormLabel, 
   CFormInput,  CFormTextarea,  CFormSelect,  CRow,  CCol} from '@coreui/react'
const Modal_message = ({
  visible, onClose, onSend, senderOptions, receiverOptions, defaultSender,  ...prop}) => {
    const [messageData, setMessageData] = useState({
      sender: '',
      receiver: '',
      title: '',
      content: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setMessageData({
        ...messageData,
        [name]: value
      });
    };
  
    const handleSend = () => {
      onSend(messageData);
      resetForm();
      onClose();
    };
  
    const resetForm = () => {
      setMessageData({
        sender: defaultSender || '',
        receiver: '',
        title: '',
        content: ''
      });
    };
  
    const handleClose = () => {
      resetForm();
      onClose();
    };
   
    return (
      <CModal visible={visible} onClose={handleClose} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Gửi tin nhắn mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md="12">
              <CFormLabel htmlFor="sender">Người gửi</CFormLabel>
              {senderOptions ? (
                <CFormSelect
                  id="sender"
                  name="sender"
                  value={messageData.sender}
                  onChange={handleChange}
                >
                  <option value="">Chọn người gửi</option>
                  {senderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                <CFormInput
                  type="text"
                  id="sender"
                  name="sender"
                  value={messageData.sender}
                  onChange={handleChange}
                  placeholder="Nhập tên người gửi"
                />
              )}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="12">
              <CFormLabel htmlFor="receiver">Người nhận</CFormLabel>
              {receiverOptions ? (
                <CFormSelect
                  id="receiver"
                  name="receiver"
                  value={messageData.receiver}
                  onChange={handleChange}
                >
                  <option value="">Chọn người nhận</option>
                  {receiverOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                <CFormInput
                  type="text"
                  id="receiver"
                  name="receiver"
                  value={messageData.receiver}
                  onChange={handleChange}
                  placeholder="Nhập tên người nhận"
                />
              )}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="12">
              <CFormLabel htmlFor="title">Tiêu đề</CFormLabel>
              <CFormInput
                type="text"
                id="title"
                name="title"
                value={messageData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề tin nhắn"
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md="12">
              <CFormLabel htmlFor="content">Nội dung tin nhắn</CFormLabel>
              <CFormTextarea
                id="content"
                name="content"
                rows="5"
                value={messageData.content}
                onChange={handleChange}
                placeholder="Nhập nội dung tin nhắn"
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Hủy
        </CButton>
        <CButton color="primary" onClick={handleSend}>
          Gửi
        </CButton>
      </CModalFooter>
    </CModal>
  );
};


export default Modal_message

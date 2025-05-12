import React, { useState, useEffect } from 'react';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormTextarea,
  CRow,
  CCol,
  CSpinner,
  CFormText
} from '@coreui/react';

const Modal_message = ({
  visible, 
  onClose, 
  onSendMessage,
  recipientName = "",
  isSending = false
}) => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal opens or closes
  useEffect(() => {
    if (visible) {
      setMessage('');
      setErrorMessage('');
    }
  }, [visible]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      setErrorMessage('');
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      setErrorMessage('Vui lòng nhập nội dung tin nhắn');
      return;
    }
    onSendMessage(message);
  };

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" size="lg">
      <CModalHeader closeButton>
        <CModalTitle>
          Gửi tin nhắn {recipientName ? `tới ${recipientName}` : ''}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md="12">
              <CFormLabel htmlFor="message">Nội dung tin nhắn</CFormLabel>
              <CFormTextarea
                id="message"
                name="message"
                value={message}
                onChange={handleChange}
                rows={5}
                placeholder="Nhập nội dung tin nhắn..."
                disabled={isSending}
                invalid={!!errorMessage}
                required
              />
              {errorMessage && (
                <CFormText color="danger">{errorMessage}</CFormText>
              )}
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={isSending}
        >
          Hủy
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSend}
          disabled={isSending || !message.trim()}
        >
          {isSending ? (
            <>
              <CSpinner size="sm" /> Đang gửi...
            </>
          ) : (
            'Gửi tin nhắn'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Modal_message;

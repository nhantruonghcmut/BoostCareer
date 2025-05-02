import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InviteJobModal = ({ show, onHide, onSubmit, jobList = [] }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  
  // Reset selected jobs khi modal đóng/mở
  useEffect(() => {
    if (!show) {
      setSelectedJobs([]);
    }
  }, [show]);

  // Đảm bảo jobList luôn là một mảng
  const safeJobList = Array.isArray(jobList) ? jobList : [];
  
  // Xử lý khi checkbox thay đổi
  const handleJobToggle = (jobId) => {
    // Kiểm tra job có bị khóa không (isInvited=true)
    const job = safeJobList.find(j => j.job_id === jobId);
    if (job && job.isInvited) {
      return; // Không cho phép thay đổi nếu job đã được gửi thư mời
    }
    
    setSelectedJobs(prevSelected => {
      if (prevSelected.includes(jobId)) {
        return prevSelected.filter(id => id !== jobId);
      } else {
        return [...prevSelected, jobId];
      }
    });
  };

  // Xử lý khi nhấn nút gửi
  const handleSubmit = () => {
    onSubmit(selectedJobs);
    onHide();
  };

  // Lọc lấy số lượng job chưa được mời
  const availableJobs = safeJobList.filter(job => !job.isInvited);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chọn việc làm để gửi thư mời</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {safeJobList && safeJobList.length > 0 ? (
          <div>
            {availableJobs.length === 0 ? (
              <div className="alert alert-info text-center">
                Bạn đã gửi thư mời cho tất cả các công việc đến ứng viên này.
              </div>
            ) : (
              <div className="mb-3 text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                Có {availableJobs.length} công việc chưa được gửi lời mời.
              </div>
            )}
            
            <Form>
              {safeJobList.map((job) => (
                <div 
                  key={job.job_id} 
                  className={`mb-3 border-bottom pb-2 ${job.isInvited ? 'bg-light' : ''}`}
                >
                  <Form.Check
                    type="checkbox"
                    id={`job-${job.job_id}`}
                    checked={selectedJobs.includes(job.job_id) || job.isInvited}
                    onChange={() => handleJobToggle(job.job_id)}
                    disabled={job.isInvited}
                    label={
                      <div>
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-1">
                            {job.title}
                          </h6>
                        </div>
                        <div className="small text-muted d-flex flex-wrap gap-3">
                          <span>
                            <i className="bi bi-geo-alt me-1"></i>
                            {job.work_location_name}
                          </span>
                          <span>
                            <i className="bi bi-briefcase me-1"></i>
                            {job.working_type}
                          </span>
                          <span>
                            <i className="bi bi-calendar me-1"></i>
                            Hết hạn: {new Date(job.date_expi).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    }
                    className="d-flex align-items-start gap-2"
                  />
                </div>
              ))}
            </Form>
            
            {selectedJobs.length > 0 && (
              <div className="alert alert-info mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Đã chọn {selectedJobs.length} việc làm</span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setSelectedJobs([])}
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-briefcase-fill text-muted" style={{ fontSize: '2.5rem' }}></i>
            <h5 className="mt-3">Không có việc làm nào</h5>
            <p className="text-muted">Bạn chưa có tin tuyển dụng nào để gửi lời mời</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={selectedJobs.length === 0}
        >
          Gửi thư mời ({selectedJobs.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteJobModal;
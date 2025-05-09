import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AIAnalysisModal = ({ show, handleClose, score, analyze}) => {
  const navigate = useNavigate();
  // Default data if none provided
  const handleUpdateCV = () => {
    handleClose(); // Close the modal first
    navigate('/jobseeker/profile'); // Then navigate to profile page
  };

  console.log("analysisData", analyze);
  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      centered
      className="ai-analysis-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-stars me-2 text-warning"></i>
          Phân tích độ phù hợp với công việc
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h5 className="mt-3">Điểm đánh giá độ phù hợp: {score? score: "Đang phân tích, xin vui lòng đợi hoặc thử lại sau"}%</h5>
          <p className="text-muted">Dựa trên phân tích CV của bạn và yêu cầu công việc</p>
        </div>
        {!analyze ? (
          <div className="text-center mb-4">
            <p>Đang tải phân tích chi tiết...</p>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100 border-danger">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      Điểm cần cải thiện
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {analyze?.weaknesses?.map((item, index) => (
                        <li key={index} className="list-group-item border-0 d-flex align-items-start">
                          <i className="bi bi-x-circle text-danger me-2 mt-1"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card h-100 border-success">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Điểm mạnh của bạn
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {analyze?.strengths?.map((item, index) => (
                        <li key={index} className="list-group-item border-0 d-flex align-items-start">
                          <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Phần Suggestions mới được thêm vào đây */}
            <div className="row">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-lightbulb me-2"></i>
                      Gợi ý cải thiện
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      {analyze?.suggestions ? (
                        analyze?.suggestions?.map((item, index) => (
                          <li key={index} className="list-group-item border-0 d-flex align-items-start">
                            <i className="bi bi-arrow-right-circle-fill text-primary me-2 mt-1"></i>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item border-0">
                          <span>Hãy cập nhật CV của bạn với những kỹ năng và kinh nghiệm phù hợp với yêu cầu công việc.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary"
        onClick={handleUpdateCV}>
          Cập nhật CV để tăng điểm phù hợp
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AIAnalysisModal;
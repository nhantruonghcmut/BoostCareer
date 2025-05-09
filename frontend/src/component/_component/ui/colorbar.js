import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";

const ColorBar = ({ value, handleOpenModal, handleopenLoginModal }) => {
  const { isLogin, user } = useSelector((state) => state.auth);
  const segments = 20;

  // const [showModal, setShowModal] = useState(false);

  // const handleOpenModal = () => setShowModal(true);
  // const handleCloseModal = () => setShowModal(false);

  const getSegmentColor = (index) => {
    const colorSteps = [
      { start: 0, end: 1, colorStart: [255, 0, 0], colorEnd: [255, 50, 0] }, // Red
      { start: 2, end: 4, colorStart: [255, 50, 0], colorEnd: [255, 165, 0] }, // Orange
      { start: 5, end: 9, colorStart: [255, 165, 0], colorEnd: [255, 255, 0] }, // Yellow
      {
        start: 10,
        end: 14,
        colorStart: [255, 255, 0],
        colorEnd: [135, 206, 250],
      }, // Light Blue
      {
        start: 15,
        end: 19,
        colorStart: [135, 206, 250],
        colorEnd: [0, 128, 0],
      }, // Green
    ];

    const step = colorSteps.find((r) => index >= r.start && index <= r.end);
    if (!step) return "white";

    const factor = (index - step.start) / (step.end - step.start);
    const r = Math.round(
      step.colorStart[0] + (step.colorEnd[0] - step.colorStart[0]) * factor
    );
    const g = Math.round(
      step.colorStart[1] + (step.colorEnd[1] - step.colorStart[1]) * factor
    );
    const b = Math.round(
      step.colorStart[2] + (step.colorEnd[2] - step.colorStart[2]) * factor
    );

    return `rgb(${r},${g},${b})`;
  };

  const getValueColor = () => {
    const valueIndex = Math.floor(value / 5);
    const safeIndex = Math.min(valueIndex, segments - 1);
    return getSegmentColor(safeIndex);
  };

  const valueColor = getValueColor();

  return isLogin ? (
    <>
      <small className="text-muted d-block mb-1">
        Mức độ phù hợp với bạn:
        <strong style={{ color: valueColor }}>
          {" "}
          {value ? value : "Đang phân tích, vui lòng đợi"}%
        </strong>
      </small>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "30px",
          border: "2px solid black",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        {[...Array(segments)].map((_, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              backgroundColor:
                index * 5 < value ? getSegmentColor(index) : "white",
              transition: "background-color 0.5s ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Button to trigger modal */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleOpenModal}>
          Xem chi tiết AI phân tích
        </Button>
      </div>
    </>
  ) : (
    <>
      <small className="text-muted d-block mb-1">
        Đăng nhập để xem mức độ phù hợp của công việc với bạn.
      </small>
      {/* Button to trigger modal */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleopenLoginModal}>
          Đăng nhập để xem chi tiết AI phân tích
        </Button>
      </div>
    </>
  );
};

export default ColorBar;

import React from "react";

const ColorBar = ({ value }) => {
  const segments = 20;

  const getSegmentColor = (index) => {
    const colorSteps = [
      { start: 0, end: 1, colorStart: [255, 0, 0], colorEnd: [255, 50, 0] }, // Đỏ (2 dải)
      { start: 2, end: 4, colorStart: [255, 50, 0], colorEnd: [255, 165, 0] }, // Cam (3 dải)
      { start: 5, end: 9, colorStart: [255, 165, 0], colorEnd: [255, 255, 0] }, // Vàng (5 dải)
      {
        start: 10,
        end: 14,
        colorStart: [255, 255, 0],
        colorEnd: [135, 206, 250],
      }, // Xanh dương nhạt (5 dải)
      {
        start: 15,
        end: 19,
        colorStart: [135, 206, 250],
        colorEnd: [0, 128, 0],
      }, // Xanh lá (5 dải)
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

  // Tính toán màu cho giá trị value
  const getValueColor = () => {
    // Chuyển đổi giá trị phần trăm thành chỉ số trong thanh màu
    const valueIndex = Math.floor(value / 5);
    // Đảm bảo chỉ số không vượt quá segments
    const safeIndex = Math.min(valueIndex, segments - 1);
    return getSegmentColor(safeIndex);
  };

  const valueColor = getValueColor();

  return (
    <>
      <small className="text-muted d-block mb-1">
        Mức độ phù hợp với bạn:{" "}
        <strong style={{ color: valueColor }}>{value}%</strong>
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
    </>
  );
};

export default ColorBar;

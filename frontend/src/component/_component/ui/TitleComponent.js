import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

const TitleComponent = ({ title, description }) => {
  return (
    <div
      className="text-white text-center py-5"
      style={{
        backgroundSize: "cover",
        minHeight: "30vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: "0.8",
        background:
          "radial-gradient(circle, rgba(97, 76, 76, 1) 0%, rgba(9, 9, 121, 1) 38%, rgba(1, 11, 13, 1) 89%)",
      }}
    >
      {/* Heading */}
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">{title ? title : ""}</h1>
        <p className="lead text-white-50 mb-4">
          {description ? description : ""}
        </p>
      </div>
    </div>
  );
};

export default TitleComponent;

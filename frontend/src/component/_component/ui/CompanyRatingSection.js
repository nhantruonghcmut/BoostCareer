import React, { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO, set } from "date-fns";
import { ca, vi } from "date-fns/locale"; //
import { toast } from "react-toastify";
import LoginModal from "./LoginModal.js";
import { useDispatch, useSelector } from "react-redux";

const CompanyRating = ({ reviewDetail, profile_id, averageScore }) => {
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (selectedRating) => {
    console.log("selectedRating", selectedRating);
    setRating(selectedRating);
  };

  const handleRateCompany = () => {
    console.log("Company id: ", profile_id);
    console.log("user id: ", user?.id);
    console.log("Comment: ", comment);
  };

  return (
    <div className="container mt-1 mb-2">
      <LoginModal title="Bạn cần đăng nhập" />
      <div className="d-flex justify-content-start align-items-center">
        <h6 className="mb-3 me-2">Đánh giá chung: </h6>
        <h6 className="mb-3 me-2">{averageScore} </h6>
        <div className="star-rating-overall mb-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <i
              key={num}
              className={`bi ${
                (averageScore || 0) >= num ? "bi-star-fill" : "bi-star"
              } rating-star`}
              style={{
                cursor: "pointer",
                color: "#ffc107",
                fontSize: "1.2rem",
              }}
            ></i>
          ))}
        </div>
      </div>

      {reviewDetail?.length > 0 ? (
        reviewDetail.map((item, index) => (
          <div key={index} className="mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">{item.review_name}</h6>
              {item?.date && (
                <span className="text-muted" style={{ fontSize: "0.9em" }}>
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>

            <div className="star-rating">
              {[5, 4, 3, 2, 1].map((num) => (
                <i
                  key={num}
                  className={`bi ${
                    item.score >= num ? "bi-star-fill" : "bi-star"
                  } rating-star`}
                  style={{
                    cursor: "pointer",
                    color: "#ffc107",
                    fontSize: "1.5rem",
                  }}
                ></i>
              ))}
            </div>

            <p className="mb-0">{item?.review_content}</p>
          </div>
        ))
      ) : (
        <p>Chưa có đánh giá nào.</p>
      )}

      <div className="mb-3 p-3 border rounded">
        <div className="d-flex justify-content-center fw-bold">
          <h6>Đánh giá của bạn</h6>
        </div>
        <div className="">
          <label className="form-label me-2">Đánh giá</label>
          <div className="star-rating">
            {[5, 4, 3, 2, 1].map((num) => (
              <i
                key={num}
                className={`bi ${
                  rating >= num ? "bi-star-fill" : "bi-star"
                } rating-star`}
                style={{
                  cursor: "pointer",
                  color: "#ffc107",
                  fontSize: "1.5rem",
                }}
                onClick={() => handleStarClick(num)}
              ></i>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating} />
        </div>

        <div className="mb-3">
          <label htmlFor="review" className="form-label">
            Nhận xét
          </label>
          <textarea
            className="form-control"
            id="review"
            rows="3"
            required
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </div>
        <div className="d-flex justify-content-center">
          {user?.role ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRateCompany}
            >
              {"Gửi đánh giá"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#LoginModal"
            >
              {"Gửi đánh giá"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRating;
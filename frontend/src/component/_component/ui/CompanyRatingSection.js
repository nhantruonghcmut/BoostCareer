import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import LoginModal from "./LoginModal.js";
import {  useSelector } from "react-redux";
const {     useAddCompanyReviewMutation,
    useUpdateCompanyReviewMutation,
    useGetCompanyReviewQuery,
 } = require("../../../redux_toolkit/jobseekerApi.js");

const CompanyRating = ({ reviewDetail, company_id, averageScore }) => {
  const { data } = useGetCompanyReviewQuery(company_id);
  const  yourreview  = data?.reviews || {};
  console.log("reviewDetail", reviewDetail);
  const [addCompanyReview] = useAddCompanyReviewMutation();
  const [updateCompanyReview] = useUpdateCompanyReviewMutation();
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // Explicit state to track whether to add or update
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize rating and comment with existing review data if available
  useEffect(() => {
    if (yourreview && Object.keys(yourreview).length > 0) {
      setRating(yourreview[0].score || 0);
      setComment(yourreview[0].content
 || "");
      setIsUpdating(true);
    } else {
      setIsUpdating(false);
    }
  }, [yourreview]);

  const handleStarClick = (selectedRating) => {
    console.log("selectedRating", selectedRating);
    setRating(selectedRating);
  };

  const handleRateCompany = async () => {
    try {
      if (!rating) {
        toast.error("Vui lòng chọn số sao đánh giá");
        return;
      }
      
      if (!comment.trim()) {
        toast.error("Vui lòng nhập nội dung đánh giá");
        return;
      }
      
      let response;
      
      // Use the explicit state to determine whether to add or update
      if (isUpdating) {
        // Update existing review
        response = await updateCompanyReview({
          company_id: company_id,
          score: rating,
          content: comment
        });
        toast.success("Cập nhật đánh giá thành công");
      } else {
        // Add new review
        response = await addCompanyReview({
          company_id: company_id,
          score: rating,
          content: comment
        });
        toast.success("Gửi đánh giá thành công");
        // After adding a review successfully, set to update mode for subsequent edits
        setIsUpdating(true);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
      console.error("Error submitting review:", error);
    }
  };

  // Button text based on whether user is updating or adding a review


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

            <p className="mb-0">{item?.content}</p>
          </div>
        ))
      ) : (
        <p>Chưa có đánh giá nào.</p>
      )}

      <div className="mb-3 p-3 border rounded">
        <div className="d-flex justify-content-center fw-bold">
          <h6>{isUpdating ? "Chỉnh sửa đánh giá của bạn" : "Đánh giá của bạn"}</h6>
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
            value={comment}
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
              {isUpdating ? "Cập nhật đánh giá" : "Gửi đánh giá"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#LoginModal"
            >
              Gửi đánh giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRating;
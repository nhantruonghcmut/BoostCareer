import { ca, vi } from "date-fns/locale"; //
import React, { useState, useEffect } from "react";
import { formatDistanceToNow} from "date-fns";
import { useRateCandidateMutation } from "../../../redux_toolkit/employerApi.js";
import { toast } from "react-toastify";
import LoginModal from "./LoginModal.js";
import { useDispatch, useSelector } from "react-redux";

const Rating = ({ ratingData, profile_id, isRateCompany }) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  console.log("profile_id", profile_id);

  const handleStarClick = (selectedRating) => {
    console.log("selectedRating", selectedRating);
    setRating(selectedRating);
  };
  useEffect(() => {
    setComment(ratingData?.employer_coment ? ratingData?.employer_coment : "");
    setRating(ratingData?.employer_score ? ratingData?.employer_score : 0);
    console.log("ratingData?.employer_score", ratingData?.employer_score);
  }, [ratingData]);

  const [RateCandidate] = useRateCandidateMutation();
  const handleRateCandidate = async () => {
    try {
      if (!ratingData?.employer_score) {
        const response = await RateCandidate({
          type: "insert",
          application_id: profile_id,
          rating,
          content: comment,
        }).unwrap(); // Gọi API để đánh giá ứng viên
        if (!response.success) {
          toast.error("Đánh giá không thành công. Vui lòng thử lại sau.");
        } else {
          toast.success("Đánh giá thành công!");
        }
      } else {
        const response = await RateCandidate({
          type: "update",
          application_id: profile_id,
          rating,
          content: comment,
        }).unwrap(); // Gọi API để đánh giá ứng viên
        if (!response.success) {
          toast.error(
            "Cập nhật đánh giá không thành công. Vui lòng thử lại sau."
          );
        } else {
          toast.success("Cập nhật đánh giá thành công!");
        }
      }
    } catch (error) {
      console.error("Error rating candidate:", error);
      toast.error("Đánh giá không thành công. Vui lòng thử lại sau.");
    }
  };



  const handleRateCompany = () => {
    console.log("abc");
  };

  return (
    <div className="container mt-1 mb-2">
      <LoginModal title="Bạn cần đăng nhập" />
      <h2 className="mb-3">Đánh giá chung</h2>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
            <h1 className="display-4 mt-3 mb-4">
                {ratingData?.averageScore || 0}
              </h1>
              <div className="star-rating-overall mb-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <i
                    key={num}
                    className={`bi ${
                      (ratingData?.averageScore || 0) >= num
                        ? "bi-star-fill"
                        : "bi-star"
                    } rating-star`}
                    style={{
                      cursor: "pointer",
                      color: "#ffc107",
                      fontSize: "1.2rem",
                    }}
                    //// tại đây hiển thị overall nên ko có click, nên tạo thêm dãi star khác
                    // onClick={() => handleStarClick(num)}
                  ></i>
                ))}
              </div>
              <h6 className="text-muted">
              Dựa trên {ratingData?.total_ratings || 0} đánh giá
              </h6>
            </div>
            <div className="col-md-8">
            {ratingData?.score
                ? ratingData?.score.map((item, index) => (
                    <div className="rating-bar mb-3" key={index}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{item.score || 0} stars</span>
                        <small className="text-muted">
                          {/* {(item.count_ratings / ratingData.total_ratings) * 100}% */}
                          {item.count_ratings}
                        </small>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{
                            width: `${
                              (item.count_ratings / ratingData.total_ratings) *
                              100
                            }%`,
                          }}
                          aria-valuenow={
                            (item.count_ratings / ratingData.total_ratings) *
                            100
                          }
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))
                : [
                    {
                      score: 1,
                      count: 0,
                    },
                    {
                      score: 2,
                      count: 0,
                    },
                    {
                      score: 3,
                      count: 0,
                    },
                    {
                      score: 4,
                      count: 0,
                    },
                    {
                      score: 5,
                      count: 0,
                    },
                  ].map((item, index) => (
                    <div className="rating-bar mb-3" key={index}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{item.score || 0} stars</span>
                        <small className="text-muted">
                          {/* {(item.count_ratings / ratingData.total_ratings) * 100}% */}
                          {item.count_ratings}
                        </small>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{
                            width: `${(item.count_ratings / 1) * 100}%`,
                          }}
                          aria-valuenow={(item.count_ratings / 1) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <hr />

          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Đánh giá của bạn</h6>
              {ratingData?.create_at ? (
                <span className="comment-time">
                  {" "}
                  {formatDistanceToNow(ratingData?.create_at)}
                </span>
              ) : (
                ""
              )}
            </div>

            <p className="mb-2">{ratingData?.employer_coment}</p>
          </div>
          <div className="text-center mt-4">
          {user?.role ? (
              <button
                className={
                  ratingData?.employer_coment
                    ? "btn btn-warning"
                    : "btn btn-primary"
                }
                data-bs-toggle="modal"
                data-bs-target="#ratingModal"
              >
                {ratingData?.employer_coment
                  ? "Chỉnh sửa nhận xét"
                  : "Viết nhận xét"}
              </button>
            ) : (
              <button
                className={"btn btn-primary"}
                data-bs-toggle="modal"
                data-bs-target="#LoginModal"
              >
                Viết nhận xét
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="ratingModal"
        tabIndex="-1"
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">
                Viết nhận xét
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
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
                  >
                    {ratingData?.employer_coment}
                  </textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  isRateCompany ? handleRateCompany : handleRateCandidate
                }
                data-bs-dismiss="modal"
              >
                {ratingData?.employer_coment
                  ? "Cập nhật đánh giá"
                  : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;

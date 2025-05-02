import { NavLink } from "react-router-dom";

export default function BeOurEmployer() {
  return (
    <section className="py-5">
      <div className="container">
        {/* Phần trên: ảnh + text */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div
              className="w-100 rounded-4"
              style={{
                backgroundImage:
                  "url('/img/homepage/doi-tac-trong-kinh-doanh.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "360px",
                borderRadius: "1rem",
              }}
            ></div>
          </div>

          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">
              Sẵn sàng tìm đúng ứng viên cho
              <br /> Doanh nghiệp của bạn?
            </h2>
            <p className="text-muted mb-4">
              Dù doanh nghiệp bạn đang phát triển hay mở rộng, chúng tôi luôn
              sẵn sàng giúp bạn tìm đúng nhân tài...
            </p>
            <div className="d-flex gap-3">
              <NavLink to="/login" className="btn btn-success">
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className="btn btn-outline-secondary">
                Đăng ký
              </NavLink>
            </div>
          </div>
        </div>

        {/* Phần dưới: stats */}
        <div className="row text-center pt-4">
          <div className="col-md-4 mb-4 mb-md-0">
            <h3 className="text-success fw-bold">12k+</h3>
            <h6 className="fw-bold">Đối tác</h6>
            <p className="text-muted small">
              Khi nhân tài và doanh nghiệp gặp nhau, giá trị lớn được hình thành
              – chúng tôi là cầu nối cho hành trình đó...
            </p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <h3 className="text-success fw-bold">20k+</h3>
            <h6 className="fw-bold">Hồ sơ nổi bật</h6>
            <p className="text-muted small">
              Khám phá những hồ sơ chất lượng đang chủ động tìm kiếm cơ hội việc
              làm phù hợp...
            </p>
          </div>

          <div className="col-md-4">
            <h3 className="text-success fw-bold">18k+</h3>
            <h6 className="fw-bold">Nhà tuyển dụng uy tín</h6>
            <p className="text-muted small">
              Khám phá các doanh nghiệp hàng đầu đang tìm kiếm nhân tài như bạn
              – nơi hội tụ của cơ hội và phát triển...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

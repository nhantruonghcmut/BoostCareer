import React, { useState } from "react";
import TitleComponent from "../_component/ui/TitleComponent.js";

export default function AboutPage() {
  const [openItem, setOpenItem] = useState("1");

  const toggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const items = [
    {
      id: "1",
      title: "Dành cho người tìm việc",
      content:
        "Tìm kiếm việc làm phù hợp với kỹ năng và kinh nghiệm, nhận gợi ý công việc cá nhân hóa.",
    },
    {
      id: "2",
      title: "Dành cho nhà tuyển dụng",
      content:
        "Tiếp cận ứng viên tiềm năng nhanh chóng, tiết kiệm thời gian và chi phí tuyển dụng.",
    },
    {
      id: "3",
      title: "Công nghệ AI tiên tiến",
      content:
        "Hỗ trợ phân tích hồ sơ, kết nối hiệu quả giữa ứng viên và doanh nghiệp.",
    },
  ];

  return (
    <>
      <TitleComponent title={"About Us"} />
      <div className="container py-5">
        {" "}
        <div className="row gy-4 align-items-start">
          <div className="row justify-content-center">
            <div className="row col-lg-10">
              {/* Left: Contact Info */}
              <div className="col-lg-6">
                <img
                  src="/img/logo/logo.jpg"
                  alt="About Us"
                  className="img-fluid rounded"
                />
              </div>

              {/* Right: Form */}
              <div className="col-lg-6 align-self-center">
                <h1 className="fw-bold mb-4 text-center">
                  Giới thiệu về Boost Career
                </h1>
                <p className="text-muted mb-4 text-center">
                  Chào mừng bạn đến với Boost Career – nền tảng trực tuyến giúp
                  kết nối người tìm việc với nhà tuyển dụng một cách hiệu quả và
                  nhanh chóng. Được tích hợp trí tuệ nhân tạo (AI), hệ thống
                  không chỉ hỗ trợ tìm kiếm công việc và đăng tin tuyển dụng mà
                  còn cung cấp phân tích toàn diện hồ sơ ứng viên.
                </p>
              </div>

              <div className="mb-5 mt-4">
                <h4 className="fw-semibold text-center">
                  Vì sao chọn Boost Career?
                </h4>
                <div className="accordion" id="accordionExample">
                  {items.map((item, index) => (
                    <div className="accordion-item border-0 mb-3" key={item.id}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button fw-semibold ${
                            openItem === item.id ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggle(item.id)}
                        >
                          <span className="me-3 text-primary fw-bold">
                            0{index + 1}
                          </span>{" "}
                          {item.title}
                        </button>
                      </h2>
                      <div
                        className={`accordion-collapse collapse ${
                          openItem === item.id ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body text-muted">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-muted mb-4">
                Chúng tôi cam kết cung cấp một nền tảng an toàn, minh bạch và
                hiệu quả cho cả ứng viên và nhà tuyển dụng, góp phần nâng cao
                chất lượng thị trường lao động.
              </p>

              <div className="text-center">
                <p className="fw-semibold">
                  Tham gia Boost Career ngay hôm nay để mở rộng cơ hội nghề
                  nghiệp và tuyển dụng hiệu quả!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

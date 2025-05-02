import React, { useState } from "react";
import TitleComponent from "../_component/ui/TitleComponent.js";

export default function HelpPage() {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const faqs = [
    {
      id: "1",
      question: "Làm thế nào để tạo tài khoản ứng viên?",
      answer:
        "Bạn có thể tạo tài khoản bằng cách nhấn vào nút “Đăng ký” ở góc phải màn hình, điền đầy đủ thông tin cá nhân, sau đó xác minh email để kích hoạt tài khoản.",
    },
    {
      id: "2",
      question: "Tôi có thể đăng tải CV không?",
      answer:
        "Có. Sau khi đăng nhập, bạn có thể vào phần 'Hồ sơ cá nhân' để tải lên CV dưới định dạng PDF, DOC hoặc DOCX.",
    },
    {
      id: "3",
      question: "Làm sao để tìm việc phù hợp với kỹ năng của tôi?",
      answer:
        "Hãy hoàn thiện hồ sơ cá nhân với thông tin học vấn, kỹ năng và kinh nghiệm. Hệ thống AI của Boost Career sẽ gợi ý công việc phù hợp dựa trên những tiêu chí này.",
    },
    {
      id: "4",
      question: "Tôi có thể ứng tuyển nhiều công việc cùng lúc không?",
      answer:
        "Có, bạn có thể ứng tuyển nhiều vị trí khác nhau. Mỗi công việc sẽ hiển thị trạng thái ứng tuyển riêng để bạn dễ dàng theo dõi.",
    },
    {
      id: "5",
      question:
        "Làm sao để biết hồ sơ của tôi đã được nhà tuyển dụng xem chưa?",
      answer:
        "Trang 'Lịch sử ứng tuyển' sẽ hiển thị thông tin về trạng thái hồ sơ. Nếu nhà tuyển dụng đã xem, bạn sẽ thấy thông báo 'Đã xem'.",
    },
    {
      id: "6",
      question: "Boost Career có thu phí không?",
      answer:
        "Boost Career miễn phí cho người tìm việc. Một số dịch vụ cao cấp như tối ưu hóa hồ sơ hoặc ưu tiên hiển thị có thể tính phí.",
    },
    {
      id: "7",
      question: "Làm sao để xóa tài khoản?",
      answer:
        "Bạn có thể vào phần 'Cài đặt tài khoản', chọn 'Xóa tài khoản'. Lưu ý rằng thao tác này không thể hoàn tác.",
    },
  ];

  return (
    <>
      <TitleComponent
        title={"F&Q"}
        description={
          "Để giúp bạn hiểu rõ hơn về dịch vụ của chúng tôi, chúng tôi đã tổng hợp một số câu hỏi thường gặp và câu trả lời liên quan đến việc sử dụng nền tảng Boost Career."
        }
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="fw-bold mb-4 text-center">Câu hỏi thường gặp</h2>
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq) => (
                <div className="accordion-item border-0 mb-3" key={faq.id}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button fw-semibold ${
                        openItem === faq.id ? "" : "collapsed"
                      }`}
                      type="button"
                      onClick={() => toggle(faq.id)}
                      aria-expanded={openItem === faq.id}
                    >
                      <span className="me-3 text-primary fw-bold">
                        {faq.id}
                      </span>{" "}
                      {faq.question}
                    </button>
                  </h2>
                  {openItem === faq.id && (
                    <div className="accordion-body">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

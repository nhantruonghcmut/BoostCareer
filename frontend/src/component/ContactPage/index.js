import React from "react";
import TitleComponent from "../_component/ui/TitleComponent.js";

export default function ContactPage() {
  return (
    <>
      <TitleComponent title={"Contact"} />
      <div className="container py-5">
        <div className="row gy-4 align-items-start">
          {/* Left: Contact Info */}
          <div className="col-lg-6">
            <h2 className="fw-bold">
              You Will Grow, You Will <br /> Succeed. We Promise That
            </h2>


            <div className="row gy-3">
              <div className="col-6 d-flex">
                <i className="bi bi-telephone fs-4 me-3 text-success"></i>
                <div>
                  <strong>Call for inquiry</strong>
                  <div className="text-muted">+84 777784090</div>
                </div>
              </div>
              <div className="col-6 d-flex">
                <i className="bi bi-envelope fs-4 me-3 text-success"></i>
                <div>
                  <strong>Send us email</strong>
                  <div className="text-muted">nhan.truongcse@hcmut.edu.vnt</div>
                </div>
              </div>
              <div className="col-6 d-flex">
                <i className="bi bi-clock fs-4 me-3 text-success"></i>
                <div>
                  <strong>Opening hours</strong>
                  <div className="text-muted">Mon - Fri: 10AM - 10PM</div>
                </div>
              </div>
              <div className="col-6 d-flex">
                <i className="bi bi-geo-alt fs-4 me-3 text-success"></i>
                <div>
                  <strong>Office</strong>
                  <div className="text-muted">
                    268 Đ. Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh, Việt
                    Nam
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="col-lg-6">
            <div className="bg-light p-4 rounded">
              <h5 className="fw-bold text-center">Contact Info</h5>
              <p className="text-center text-muted">
                Nibh dis faucibus proin lacus tristique
              </p>

              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your E-mail address"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-success">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map section */}
        <div className="mt-5">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.511579951176!2d106.65303624574479!3d10.772074962067993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0xef77cd47a1cc691e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1745485152989!5m2!1svi!2s"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded w-100"
          ></iframe>
        </div>
      </div>
    </>
  );
}

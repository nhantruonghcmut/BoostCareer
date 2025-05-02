import React, { useEffect, useRef } from "react";
import "./PercentContainer.css";

const SkillItem = ({ percent }) => {
  const skillRef = useRef(null);

  useEffect(() => {
    const circle = skillRef.current.querySelector(".progress");
    const percentText = skillRef.current.querySelector(".skill-percent");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    let count = 0;
    const timer = setInterval(() => {
      if (count >= percent) {
        clearInterval(timer);
      } else {
        count++;
        percentText.textContent = count + "%";
      }
    }, 15);

    // Add animation class
    requestAnimationFrame(() => {
      skillRef.current.classList.add("show");
    });

    return () => clearInterval(timer);
  }, [percent]);

  return (
    <div
      className="skill-item mx-auto animated"
      ref={skillRef}
      data-percent={percent}
    >
      <svg className="skill-circle">
        <circle className="bg" cx="70" cy="70" r="70"></circle>
        <circle className="progress" cx="70" cy="70" r="70"></circle>
      </svg>
      <div className="skill-text">
        <div className="skill-percent">0%</div>
      </div>
    </div>
  );
};

const SkillsContainer = ({ percent }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="skills-container">
            <h2 className="text-center text-white ">Mức độ hoàn thiện</h2>
            <p className="lh-1 text-center text-white mb-5">
              Cập nhật hồ sơ của bạn để tìm hiểu thêm về con đường sự nghiệp
              tiếp theo của bạn.
            </p>
            <div className="row justify-content-center">
              <div className="col-sm-6 col-md-4 mb-4">
                <SkillItem percent={percent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsContainer;

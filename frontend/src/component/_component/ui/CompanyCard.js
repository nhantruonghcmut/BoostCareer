import { NavLink } from "react-router-dom";

export default function CompanyCard({ company }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={
            company.background
              ? company.background
              : "./public/img/default-background/defaultBg.jpg"
          }
          className="card-img-top"
          alt={company?.company_name}
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body">
          <NavLink
            to={`/company-detail/${company?.company_id}`}
            className="d-flex align-items-center mb-2"
          >
            <img
              src={company.logo}
              alt="logo"
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
            <h6 className="mb-0">{company?.company_name}</h6>
          </NavLink>
          <p className="mb-1 text-muted">
            {company?.count_follower ? company.count_follower : "0"} lượt theo
            dõi • {company?.count_job_posted ? company.count_job_posted : "0"} tin tuyển
            dụng
          </p>
          <div className="mb-2">
            {/* {company?.locations?.map((loc) => (
                <span key={loc} className="badge bg-secondary me-1">
                  {loc}
                </span>
              ))} */}
            <span className="badge bg-secondary me-1">
              {company?.city_name}
            </span>
          </div>
          <p className="card-text small">
            {company?.describle.slice(0, 120)}...
          </p>
        </div>
      </div>
    </div>
  );
}

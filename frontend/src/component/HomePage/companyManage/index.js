import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGetCompanyBySearchQuery } from "../../../redux_toolkit/guestApi.js";
import {
  useGetIndustriesQuery,
  useGetCitiesQuery,
} from "../../../redux_toolkit/CategoryApi.js";
import CompanyCard from "../../_component/ui/CompanyCard.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function ListCompany() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const { isLogin, user } = useSelector((state) => state.auth);
  const [searchTitle, setSearchTitle] = useState(""); // Lưu giá trị tìm kiếm tạm thời
  const [selectedIndustry, setSelectedIndustry] = useState(""); // Lưu ngành nghề tạm thời
  const [selectedCity, setSelectedCity] = useState(""); // Lưu thành phố tạm thời

  const [search, setSearch] = useState({
    paging_size: 12,
    active_page: page,
    industry_id: "",
    city_id: "",
    title: "",
  });

  // Add more detailed query information
  const {
    data,
    isLoading: companiesLoading,
    isError,
    error,
    refetch,
  } = useGetCompanyBySearchQuery(search);
  const { data: industries } = useGetIndustriesQuery();
  const { data: cities } = useGetCitiesQuery(84); // 84 là mã quốc gia Việt Nam

  const { companies: listCompany, totalPages } = data || {
    companies: [],
    totalPages: 1,
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset về trang đầu tiên khi tìm kiếm mới
    setPage(1);

    // Tạo object mới chỉ chứa các giá trị không rỗng
    const newSearchParams = {
      paging_size: 12,
      active_page: 1,
    };

    // Chỉ thêm các params có giá trị
    if (searchTitle) newSearchParams.title = searchTitle;
    if (selectedIndustry) newSearchParams.industry_id = selectedIndustry;
    if (selectedCity) newSearchParams.city_id = selectedCity;

    // Cập nhật state search với các giá trị mới
    setSearch(newSearchParams);
  };

  // Cập nhật search state khi page thay đổi
  useEffect(() => {
    // Giữ nguyên các tham số tìm kiếm hiện tại, chỉ cập nhật số trang
    setSearch((prevSearch) => ({
      ...prevSearch,
      active_page: page,
    }));
  }, [page]);

  const getVisiblePages = (currentPage, totalPages) => {
    const delta = 2; // Number of pages to show on each side
    let range = [];

    // Calculate start and end page
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust if we're at the beginning or end
    if (currentPage <= delta) {
      end = Math.min(totalPages, 2 * delta + 1);
    } else if (currentPage >= totalPages - delta) {
      start = Math.max(1, totalPages - 2 * delta);
    }

    // Generate page numbers
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      console.log(`Changing to page ${newPage}`); // Debug log
      setIsPageChanging(true);
      setPage(newPage);
      // Scroll to top for better UX
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (user?.role === 2) {
      toast.error("Vui lòng đăng nhập vai trò người tìm việc!");
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (data) {
      setIsPageChanging(false);
    }
  }, [data, page]); // Reset the indicator when data changes

  return (
    <>
      <TitleComponent
        title={"Danh Sách Công Ty"}
        description={
          "Chúng tôi kết nối doanh nghiệp, giúp tìm kiếm đối tác và nhà cung cấp tiềm năng. Đội ngũ chuyên nghiệp và công nghệ hiện đại, cam kết mang đến giải pháp tối ưu cho bạn. Hãy để chúng tôi hỗ trợ bạn phát triển!"
        }
      />
      <div className="container py-4">
        <nav aria-label="breadcrumb ">
          <ol className="breadcrumb mt-3">
            <li className="breadcrumb-item">
              <NavLink to="/">Trang chủ</NavLink>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Danh sách công ty
            </li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-3">Khám Phá Văn Hoá Công Ty</h2>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên công ty"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="">Tất cả lĩnh vực</option>
                {industries?.map((industry) => (
                  <option
                    value={industry.industry_id}
                    key={industry.industry_id}
                  >
                    {industry.industry_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Tất cả địa điểm</option>
                {cities?.map((city) => (
                  <option value={city.city_id} key={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-grid col-md-3 mx-auto">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search me-2"></i>Tìm kiếm
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            {companiesLoading
              ? "Đang tải dữ liệu..."
              : `Công ty nổi bật (${listCompany.length})`}
          </h5>
        </div>

        {companiesLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Đang tải danh sách công ty...</p>
          </div>
        ) : (
          <>
            <div className="row">
              {listCompany?.length > 0 ? (
                listCompany.map((company, index) => (
                  <CompanyCard key={index} company={company} />
                ))
              ) : (
                <p className="text-center py-3">Không tìm thấy công ty nào</p>
              )}
            </div>

            {listCompany?.length > 0 && (
              <nav
                className="d-flex justify-content-center mt-4"
                aria-label="Page navigation example"
              >
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      aria-label="Previous"
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>

                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      aria-label="First"
                      onClick={() => changePage(1)}
                      disabled={page === 1}
                    >
                      <span aria-hidden="true">Đầu</span>
                    </button>
                  </li>

                  {getVisiblePages(page, totalPages).map((p) => (
                    <li
                      key={p}
                      className={`page-item ${p === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(p)}
                      >
                        {p}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      aria-label="Last"
                      onClick={() => changePage(totalPages)}
                      disabled={page === totalPages}
                    >
                      <span aria-hidden="true">Cuối</span>
                    </button>
                  </li>

                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      aria-label="Next"
                      onClick={() => changePage(page + 1)}
                      disabled={page === totalPages}
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}

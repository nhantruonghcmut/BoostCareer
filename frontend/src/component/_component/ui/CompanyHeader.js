import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "./LoginModal";
import { NavLink } from "react-router-dom";
import {
  useAddFollowingCompanyMutation,
  useDeleteFollowingCompanyMutation,
  useGetFollowingCompanyQuery,
} from "../../../redux_toolkit/jobseekerApi";
import { toast } from "react-toastify";
export default function ComPanyHeard({
  companyInformation,
  heightBg = "250px",
  logoSize = "80px",
  showFollowButton = true,
}) {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { data: listfollowCompany } = useGetFollowingCompanyQuery(user?.id);
  console.log("list followCompany", listfollowCompany);
  const [followed, setFollowed] = useState(false);
  const [followCompany] = useAddFollowingCompanyMutation();
  const [deleteFollowCompany] = useDeleteFollowingCompanyMutation();
  const handdleFollowCompany = async () => {
    if (user?.role === 3 && user?.id) {
      const response = await followCompany({
        profile_id: user?.id,
        company_id: companyInformation?.company_id,
      });
      console.log("response", response);
      if (response?.data?.success) {
        toast.success("Theo dõi công ty thành công!");
        setFollowed(true);
      } else toast.error("Theo dõi công ty thất bại!");
    }
  };
  const handdleUnFollowCompany = async () => {
    if (user?.role === 3 && user?.id&& followed) {
      const response = await deleteFollowCompany({
        profile_id: user?.id,
        company_id: companyInformation?.company_id,
      });
      console.log("response", response);
      if (response?.data?.success) {
        toast.success("Bỏ theo dõi công ty thành công!");
        setFollowed(true);
      } else toast.error("Bỏ theo dõi công ty thất bại!");
    }
  };
  useEffect(() => {
    if (Array.isArray(listfollowCompany))
    {
      setFollowed(false);
      for (const item of listfollowCompany) {
        if (item?.company_id === companyInformation?.company_id) {
          setFollowed(true);
          break;
        } 
      }
  }}, [listfollowCompany]);

  return (
    <div className="card">
      <LoginModal />
      <div className="card-header p-0">
        <div className="position-relative">
          <img
            src={
              companyInformation?.background
                ? companyInformation.background
                : "/img/default-background/defaultBg.jpg"
            }
            // src="/img/default-background/defaultBg.jpg"
            alt="Company Banner"
            className="w-100"
            style={{ height: heightBg, objectFit: "cover" }}
          />
          <div className="position-absolute bottom-0 start-0 p-3">
            <div className="d-flex align-items-center">
              <img
                src={
                  companyInformation?.logo || companyInformation?.company_logo
                }
                alt="Company Logo"
                className="rounded-circle border border-white"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="ms-3">
                <h5 className="text-white fw-bold">
                  <NavLink
                    to={`/company-detail/${
                      companyInformation?.company_id ||
                      companyInformation?.employer_id
                    }`}
                  >
                    {companyInformation?.company_name}
                  </NavLink>
                </h5>
                {/* <p className="text-white mb-0">
                    https://hapas.vn | 25-99 nhân viên | 87 người theo dõi
                  </p> */}
                <p className="text-white mb-0">
                  {companyInformation?.scale_min
                    ? companyInformation.scale_min
                    : "0"}{" "}
                  -{" "}
                  {companyInformation?.scale_max
                    ? companyInformation.scale_max
                    : companyInformation?.scale_min
                    ? companyInformation.scale_min
                    : "0"}{" "}
                  nhân viên |{" "}
                  {companyInformation?.count_follower
                    ? companyInformation.count_follower
                    : "0"}{" "}
                  người theo dõi
                </p>
                {showFollowButton &&
                  (user?.role === 3 ? (
                    followed? (<button
                      className="btn btn-danger me-2"
                      onClick={handdleUnFollowCompany}
                    >
                      Bỏ theo dõi
                    </button>):(
                    <button
                      className="btn btn-primary me-2"
                      onClick={handdleFollowCompany}
                    >
                      + Theo dõi
                    </button>)
                  ) : (
                    <button
                      className="btn btn-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#LoginModal"
                    >
                      + Theo dõi
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import UserImage from "../Assests/Images/user.png";
import { useSelector } from "react-redux";
import LocalStorage from "../Utils/LocalStorage";
import { useDispatch } from "react-redux";
import * as commonAction from "../Actions/Common/CommonAction";
import { useNavigate } from "react-router-dom";

const Header = ({ showStopStudyBtn = false,showExitBtn=false,showBackBtn=false, showHomeBtn = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.CommonReducer.user);

  const handleOnClickLogout = () => {
    LocalStorage.SetData("UserId", 0);
    LocalStorage.SetData("IsAdmin", false);
    dispatch(commonAction.removeUserId());
    dispatch(commonAction.removeIsAdmin());
    navigate("/");
  };

  return (
    <nav class="navbar navbar-light bg-light custom-header">
      <div class="container">
        <div className="row w-100">
          <div className="col-lg-5 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <img src={UserImage} alt="Image" loading="lazy" />
              <div className="d-flex flex-column ps-3">
                <span className="name">{user?.FullName}</span>
                <span className="designation">{user?.UserName}</span>
              </div>
            </div>
          </div>
          <div className="col-lg-7 d-flex justify-content-end custom-buttons">
            <div className="d-flex align-items-center">
              {showStopStudyBtn && (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  class="btn btn-danger me-3"
                >
                  Stop Study
                </button>
              )}
              {showExitBtn && (
                <button
                  type="button"
                  onClick={() => navigate("/filter-config")}
                  class="btn btn-danger me-3"
                >
                  Exit Filter
                </button>
              )}
              {showBackBtn && (
                <button
                  type="button"
                  onClick={() => navigate("/user-config")}
                  class="btn btn-danger me-3"
                >
                  Back
                </button>
              )}
              {showHomeBtn ? (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  class="btn btn-primary me-3"
                >
                  Home
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  class="btn btn-primary me-3"
                >
                  Admin
                </button>
              )}

              <button
                type="button"
                onClick={handleOnClickLogout}
                class="btn btn-dark"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

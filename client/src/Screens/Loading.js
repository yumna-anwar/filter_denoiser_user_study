import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "./Admin";
import UserStudies from "./Admin.UserStudies";
import Dashboard from "./Dashboard";
import UserStudy from "./UserStudy";
import UserConfig from "./UserConfig";
import OTcalib from "./OTcalib";
import HAcalib from "./HAcalib";
import Login from "./Login";
import Register from "./Register";
import NotFound from "../Components/NotFound";
import { ToastContainer } from "react-toastify";
import LocalStorage from "../Utils/LocalStorage";
import * as commonAction from "../Actions/Common/CommonAction";
import { useDispatch } from "react-redux";

const Loading = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.CommonReducer.userId);
  const isAdmin = useSelector((state) => state.CommonReducer.isAdmin);

  useEffect(() => {
    const localUserId = LocalStorage.GetData("UserId");
    const localIsAdmin = LocalStorage.GetData("IsAdmin");

    if (localUserId !== null) {
      dispatch(commonAction.saveUserId(localUserId));
      dispatch(commonAction.fetchUserById(localUserId));
      if (localIsAdmin !== null) {
        if (localIsAdmin === "true") {
          dispatch(commonAction.saveIsAdmin());
        } else {
          dispatch(commonAction.removeIsAdmin());
        }
      }
    }
  }, []);

  return (
    <div className="main-layout">
      <Router>
        <Routes>
          {parseInt(userId) === 0 ? (
            <>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/user-config" element={<UserConfig />} />
              <Route exact path="/user-study" element={<UserStudy />} />
              <Route exact path="/one-time-calibration" element={<OTcalib />} />
              <Route exact path="/ha-fitting" element={<HAcalib />} />
              {isAdmin === true && (
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/user-studies" element={<UserStudies />} />
                </>
              )}
            </>
          )}
          {/* <Route path="/*" element={<NotFound />} /> */}
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </div>
  );
};

export default Loading;

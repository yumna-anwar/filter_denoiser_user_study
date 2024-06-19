import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "./Admin";
import UserStudies from "./Admin.UserStudies";
import FiltersA from "./Admin.FilterA";
import FiltersB from "./Admin.FilterB";
import FiltersC from "./Admin.FilterC";
import UserGains from "./Admin.UserGain";
import Dashboard from "./Dashboard";
import UserStudy from "./UserStudy";
import SelectUserStudy from "./SelectUserStudy";
import UserStudyPairwise from "./UserStudyPairwise";
import UserStudyPairwiseDemo from "./UserStudyPairwiseDemo";
import UserConfig from "./UserConfig";
import VentConfig from "./VentConfig";
import InlossConfig from "./InlossConfig";
import FilterConfig from "./FilterConfig";
import PinnaConfig from "./PinnaConfig";
import HAcalib from "./HAcalib";
import GenerateAudio from  "./GenerateAudio"
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

              <Route exact path="/user-study-pairwise" element={<UserStudyPairwise />} />
              <Route exact path="/user-study-pairwise-demo" element={<UserStudyPairwiseDemo />} />

              {isAdmin === true && (
                <>
                <Route exact path="/user-config" element={<UserConfig />} />
                <Route exact path="/filter-config" element={<FilterConfig />} />
                <Route exact path="/vent-config" element={<VentConfig />} />
                <Route exact path="/inloss-config" element={<InlossConfig />} />
                <Route exact path="/user-study/:participantId" element={<UserStudy />} />
                <Route exact path="/select-user-study" element={<SelectUserStudy />} />
                <Route exact path="/pinna-config" element={<PinnaConfig />} />
                <Route exact path="/ha-fitting" element={<HAcalib />} />
                <Route exact path="/gen-audio" element={<GenerateAudio />} />

                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/user-studies" element={<UserStudies />} />
                  <Route path="/admin/filter-A" element={<FiltersA />} />
                  <Route path="/admin/filter-B" element={<FiltersB />} />
                  <Route path="/admin/filter-C" element={<FiltersC />} />
                  <Route path="/admin/user-gains" element={<UserGains />} />


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

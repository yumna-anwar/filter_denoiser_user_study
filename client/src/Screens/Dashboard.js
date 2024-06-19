import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Components/Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentuserId = useSelector((state) => state.CommonReducer.userId);
  const isAdmin = useSelector((state) => state.CommonReducer.isAdmin);



  return (
    <>
      <Header />
      <div className="inner-layout">
        <div className="container d-flex flex-column align-items-center justify-content-center h-100 dashboard">

          {isAdmin && (
            <>
              <div>
                <button
                  className="button btn btn-lg btn-success"
                  type="button"
                  onClick={() => navigate("user-config")}
                >
                  Add User Configuration
                </button>
              </div>

              <div>
                <button
                  className="button btn btn-lg btn-success"
                  type="button"
                  onClick={() => navigate("select-user-study")}
                >
                  Start User Study
                </button>
              </div>
            </>
          )}
          <div>
            <button
              className="button btn btn-lg btn-success"
              type="button"
              onClick={() => navigate("user-study-pairwise-demo")}
              // If you need to include the currentUserId, uncomment the next line
              // onClick={() => navigate(`/user-study-pairwise/${currentUserId}`)}
            >
              Start Demo Pairwise User Study
            </button>
          </div>
          <div>
            <button
              className="button btn btn-lg btn-success"
              type="button"
              onClick={() => navigate("user-study-pairwise")}
              // If you need to include the currentUserId, uncomment the next line
              // onClick={() => navigate(`/user-study-pairwise/${currentUserId}`)}
            >
              Start Pairwise User Study
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;

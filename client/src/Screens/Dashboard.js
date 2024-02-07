import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="inner-layout">
        <div className="container d-flex flex-column align-items-center justify-content-center h-100 dashboard">
        <div><button
          className="button btn btn-lg btn-success"
          type="button"
          onClick={() => navigate("user-config")}
        >
          Add User Configuration
        </button></div>

          <div><button
            className="button btn btn-lg btn-success"
            type="button"
            onClick={() => navigate("user-study")}
          >
            Start User Study
          </button></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

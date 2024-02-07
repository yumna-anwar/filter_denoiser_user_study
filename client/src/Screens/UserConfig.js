import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const UserConfig = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header showHomeBtn={true}/>
      <div className="inner-layout">
        <div className="container d-flex flex-column align-items-center justify-content-center h-100 dashboard">
          <div className="button-container" style={{ textAlign: 'center', margin: '20px' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    type="button"
                    onClick={() => navigate("/filter-config")}
                  >
                    One Time Calibration
                  </button>
                  <span style={{ margin: '0 10px', fontSize: '24px', fontWeight: 'bold' }}>&rarr;</span>
                  <button
                    className="btn btn-secondary btn-lg"
                    type="button"
                    onClick={() => navigate("/ha-fitting")}
                  >
                    HA Fitting
                  </button>
                </div>
              </div>
            </div>
    </>
  );
};

export default UserConfig;

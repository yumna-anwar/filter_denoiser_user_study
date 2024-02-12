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
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{
                        fontSize: "1.1rem",
                        padding: "0.25rem 0.5rem",
                        width: "200px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                         marginRight: "20px", // Add right margin for space
                      }}
                    onClick={() => navigate("/filter-config")}
                  >
                    One Time Calibration
                  </button>
                  <span style={{ margin: '0 10px', fontSize: '24px', fontWeight: 'bold' }}>&rarr;</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    type="button"
                    style={{
                        fontSize: "1.1rem",
                        padding: "0.25rem 0.5rem",
                        width: "200px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                         marginRight: "20px", // Add right margin for space
                      }}
                    onClick={() => navigate("/ha-fitting")}
                  >
                    HA Fitting
                  </button>
                  <span style={{ margin: '0 10px', fontSize: '24px', fontWeight: 'bold' }}>&rarr;</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    type="button"
                    style={{
                        fontSize: "1.1rem",
                        padding: "0.25rem 0.5rem",
                        width: "200px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                         marginRight: "20px", // Add right margin for space
                      }}
                    onClick={() => navigate("/gen-audio")}
                  >
                    Generate User Study Audios
                  </button>
                </div>
              </div>
            </div>
    </>
  );
};

export default UserConfig;

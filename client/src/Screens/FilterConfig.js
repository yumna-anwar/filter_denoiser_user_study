import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const FilterConfig = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header showBackBtn={true}/>

      <div className="inner-layout">
        <div className="container d-flex flex-column align-items-center justify-content-center h-100 dashboard">
          <div className="button-container" style={{ textAlign: 'center', margin: '20px' }}>
                  <button
                    className="btn btn-dark btn-sm"
                    type="button"
                    style={{
                        fontSize: "0.9rem",
                        padding: "0.25rem 0.5rem",
                        width: "150px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                         marginRight: "20px", // Add right margin for space
                      }}
                    onClick={() => navigate("/pinna-config")}
                  >
                    Filter A:<br/> To Achieve Pinna effect
                  </button>

                  <button
                    className="btn btn-dark btn-sm"
                    type="button"
                    style={{
                        fontSize: "0.9rem",
                        padding: "0.25rem 0.5rem",
                        width: "150px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                         marginRight: "20px", // Add right margin for space
                      }}
                    onClick={() => navigate("/vent-config")}
                  >
                    Filter B:<br/> Vent effect
                  </button>

                  <button
                    className="btn btn-dark btn-sm"
                    type="button"
                    style={{
                        fontSize: "0.9rem",
                        padding: "0.25rem 0.5rem",
                        width: "150px", // Adjust the width as needed
                        height: "80px",
                        wordWrap: "break-word",
                      }}
                    onClick={() => navigate("/inloss-config")}
                  >
                    Filter C:<br/> Insertion loss filter
                  </button>
                </div>
              </div>
            </div>
    </>
  );
};

export default FilterConfig;

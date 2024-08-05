import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";
import styles from '../Components/study.module.css';
import Header from "../Components/Header";

const UserStudyPairwiseDemoScreen = () => {
  const navigate = useNavigate();
  const currentuserId = useSelector((state) => state.CommonReducer.userId);
  const isAdmin = useSelector((state) => state.CommonReducer.isAdmin);
 const rate = 'A';
 const [reasons, setReasons] = useState({
   lessAnnoying: 'no',
   lessEffortful: 'no',
   moreNatural: 'no',
   betterQuality: 'no'
 });

 const activeStyle = {
 backgroundColor: '#007bff',  // Bootstrap primary color for consistency
 color: 'white',
 borderRadius: '5px',
 padding: '5px'
 };

 const normalStyle = {
   padding: '5px'
 };
 const activeButtonStyle = {
 backgroundColor: '#28a745', // Green background for active state
 color: 'white'
 };

 const normalButtonStyle = {
   backgroundColor: '#007bff', // Blue background for normal state
   color: 'white'
 };

  return (

    <>
      <Header showStopStudyBtn={true} />
      <div className="inner-layout">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-10 col-xl-8">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h2>Denoiser Study Dummy Screen</h2>

                <div className="study-items d-flex flex-column align-items-center justify-content-center py-3">
              <div className="d-flex justify-content-around w-100" style={{ marginBottom: '20px' }}>
                {/* Shaded box for Audio A */}
                <div style={{ marginRight: '10px', textAlign: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
                  <div className="audio-title" style={{ textAlign: 'center', fontSize: '1.2rem' }}>Audio A</div>
                  <button
                    style={ normalButtonStyle}
                    className="button btn btn-sm play mb-3">
                    <img src={Play} alt="Play" />
                  </button>
                </div>
                {/* Shaded box for Audio B */}
                <div style={{ marginLeft: '10px', textAlign: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
                  <div className="audio-title" style={{ textAlign: 'center', fontSize: '1.2rem' }}>Audio B</div>
                  <button
                    style={ normalButtonStyle}
                    className="button btn btn-sm play mb-3">
                    <img src={Play} alt="Play" />
                  </button>
                </div>
              </div>

              {true && (
                <div className="mt-3" style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                  <p>Which one do you prefer?</p>
                  <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                    <button
                      style={{ border: '1px solid #007bff', padding: '0.25rem 0.5rem', margin: '0 10px', fontSize: '2rem', fontWeight: 'bold', borderRadius: '5px' }}
                      className={`btn btn-sm ${rate === 'A' ? 'btn-primary' : 'btn-outline-primary'}`}
                      >
                      Audio A
                    </button>
                    <button
                      style={{ border: '1px solid #007bff', padding: '0.25rem 0.5rem', margin: '0 10px', fontSize: '2rem', fontWeight: 'bold', borderRadius: '5px' }}
                      className={`btn btn-sm ${rate === 'B' ? 'btn-primary' : 'btn-outline-primary'}`}
                      >
                      Audio B
                    </button>
                  </div>
                </div>
              )}


                <div className="mt-3" style={{ marginTop: '20px', fontSize: '1.2rem' }}>
                  <p>I prefer A because…</p>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ marginRight: '95px' }}>The noise is less annoying: </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'green' }}>Yes</span>
                          <input type="radio" name="lessAnnoying" value="yes" checked={reasons.lessAnnoying === 'yes'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'red' }}>No</span>
                          <input type="radio" name="lessAnnoying" value="no" checked={reasons.lessAnnoying === 'no'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ marginRight: '75px' }}>The listening is less effortful:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'green' }}>Yes</span>
                          <input type="radio" name="lessEffortful" value="yes" checked={reasons.lessEffortful === 'yes'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'red' }}>No</span>
                          <input type="radio" name="lessEffortful" value="no" checked={reasons.lessEffortful === 'no'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ marginRight: '95px' }}>The sound is more natural:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'green' }}>Yes</span>
                          <input type="radio" name="moreNatural" value="yes" checked={reasons.moreNatural === 'yes'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'red' }}>No</span>
                          <input type="radio" name="moreNatural" value="no" checked={reasons.moreNatural === 'no'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ marginRight: '25px' }}>The overall sound quality is better:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'green' }}>Yes</span>
                          <input type="radio" name="betterQuality" value="yes" checked={reasons.betterQuality === 'yes'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: 'red' }}>No</span>
                          <input type="radio" name="betterQuality" value="no" checked={reasons.betterQuality === 'no'} style={{ transform: 'scale(2)', margin: '5px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              <button

                className="btn btn-lg btn-success mt-3"
                onClick={() => alert('Submit Answer')}
                style={{ fontSize: '2rem' }}>
                Submit Answer
              </button>
            </div>
              <br />
                  <div>
                    <button
                      className="button btn btn-lg btn-success"
                      type="button"
                      onClick={() => navigate("/user-study-pairwise-demo")}
                    style={{ fontSize: '2rem' }}>
                      Start Demo Now
                    </button>
                  </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  );
};

export default UserStudyPairwiseDemoScreen;

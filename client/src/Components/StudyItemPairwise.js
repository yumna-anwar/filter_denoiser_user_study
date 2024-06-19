import React, { useState, useEffect, useRef } from "react";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";
import styles from '../Components/study.module.css';
import { toast } from "react-toastify";

const StudyItemPairwise = ({ data, onClickSubmitAnswer }) => {
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const [rate, setRate] = useState('None');
  const [showRating, setShowRating] = useState(false);
  const [reasons, setReasons] = useState({
    lessAnnoying: false,
    lessEffortful: false,
    moreNatural: false,
    betterQuality: false
  });
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [bothPlayed, setBothPlayed] = useState({ audio1: false, audio2: false });

  // Calculate if all reasons have been addressed
  const allReasonsAddressed = Object.values(reasons).every(value => value === 'yes' || value === 'no');

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

  useEffect(() => {
    // Set the source only if it's not already set or has changed
    if (audioRef1.current && data?.path1 && audioRef1.current.src !== data?.path1) {
        audioRef1.current.src = data.path1;
        audioRef1.current.load(); // Ensure to load the new source
    }
    if (audioRef2.current && data?.path2 && audioRef2.current.src !== data?.path2) {
        audioRef2.current.src = data.path2;
        audioRef2.current.load(); // Same as above
    }
}, [data?.path1, data?.path2]); // Depend on data paths to update sources

    const handleAudioEnded1 = () => {
      setShowRating(false); // Set to false if you want the rating to appear only after both audios have played
      setIsPlaying1(false);
      setBothPlayed(prev => ({ ...prev, audio1: true }));
      // if (audioRef2.current) {
      //   audioRef2.current.play().then(() => setIsPlaying2(true)).catch(e => toast.error("Auto-play failed: " + e.message));
      // }
      if (!bothPlayed.audio2) { // Play Audio B automatically only if it hasn't played yet
      audioRef2.current.play().then(() => setIsPlaying2(true)).catch(e => toast.error("Auto-play failed: " + e.message));
      } else {
        setShowRating(true); // Show rating options only if both audios have played
      }
    };

    const handleAudioEnded2 = () => {
      setShowRating(true);
      setIsPlaying2(false);
      setBothPlayed(prev => ({ ...prev, audio2: true }));
      setStartTime(Date.now());
    };

  const handlePlayPause = (audioRef, isPlaying, setIsPlaying) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReasonChange = (reason, value) => {
    setReasons(prev => ({
      ...prev,
      [reason]: value
    }));

  };

  const handleSubmitAnswer = () => {
    setShowRating(false);
    if (onClickSubmitAnswer) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
      onClickSubmitAnswer({ rate: rate, fileName1: data.path1, fileName2: data.path2, timeTaken: timeTaken, reasons: reasons });
    }
    setRate('None');  // Reset the rating after submitting
    setBothPlayed({ audio1: false, audio2: false });
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    // Reset reasons whenever a new rate is selected
    setReasons({
      lessAnnoying: false,
      lessEffortful: false,
      moreNatural: false,
      betterQuality: false
    });

  };

  // Auto-play the first audio after setting the source
  useEffect(() => {
      // Ensure audio is loaded and autoplay only if it is the first load
      if (audioRef1.current && !isPlaying1) {
          const playAudio = async () => {
              try {
                  await audioRef1.current.play();
                  setIsPlaying1(true);
              } catch (error) {
                  console.log('Autoplay failed:', error);
              }
          };
          playAudio();
      }
  }, [data?.path1]); // Depend directly on data?.path1 to re-trigger this effect when path1 changes

  return (
    <div className="study-items d-flex flex-column align-items-center justify-content-center py-3">
  <div className="d-flex justify-content-around w-100" style={{ marginBottom: '20px' }}>
    <div style={{ marginRight: '10px', textAlign: 'center' }}>
      <button onClick={() => handlePlayPause(audioRef1, isPlaying1, setIsPlaying1)}
              style={isPlaying1 ? activeButtonStyle : normalButtonStyle}
              className="button btn btn-sm play mb-3">
        <img src={isPlaying1 ? Pause : Play} alt="Play/Pause" />
      </button>
      <audio ref={audioRef1} onEnded={handleAudioEnded1}>
        <source src={data?.path1} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
    <div style={{ marginLeft: '10px', textAlign: 'center' }}>
      <button onClick={() => handlePlayPause(audioRef2, isPlaying2, setIsPlaying2)}
              style={isPlaying2 ? activeButtonStyle : normalButtonStyle}
              className="button btn btn-sm play mb-3">
        <img src={isPlaying2 ? Pause : Play} alt="Play/Pause" />
      </button>
      <audio ref={audioRef2} onEnded={handleAudioEnded2}>
        <source src={data?.path2} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>

        {showRating && (
          <div className="mt-3" style={{ textAlign: 'center' }}>
            <p>Which one do you prefer?</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
              <button style={{ border: '1px solid #007bff', padding: '0.25rem 0.5rem', margin: '0 10px',fontSize: '1rem', fontWeight: 'bold', borderRadius: '5px' }}
                      className={`btn btn-sm ${rate === 'A' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleRateChange('A')}>
                Audio A
              </button>
              <button style={{ border: '1px solid #007bff', padding: '0.25rem 0.5rem', margin: '0 10px',fontSize: '1rem', fontWeight: 'bold', borderRadius: '5px' }}
                      className={`btn btn-sm ${rate === 'B' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleRateChange('B')}>
                Audio B
              </button>
            </div>
          </div>
        )}

        {(rate === 'A' || rate === 'B') && (
          <div className="mt-3" style={{ marginTop: '20px' }}>
            <p>I prefer {rate} because…</p>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ marginRight: '80px' }}>The noise is less annoying: </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'green' }}>Yes</span>
                    <input type="radio" name="lessAnnoying" value="yes" checked={reasons.lessAnnoying === 'yes'} onChange={() => handleReasonChange('lessAnnoying', 'yes')} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'red' }}>No</span>
                    <input type="radio" name="lessAnnoying" value="no" checked={reasons.lessAnnoying === 'no'} onChange={() => handleReasonChange('lessAnnoying', 'no')} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ marginRight: '62px' }}>The listening is less effortful:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'green' }}>Yes</span>
                    <input type="radio" name="lessEffortful" value="yes" checked={reasons.lessEffortful === 'yes'} onChange={() => handleReasonChange('lessEffortful', 'yes')} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'red' }}>No</span>
                    <input type="radio" name="lessEffortful" value="no" checked={reasons.lessEffortful === 'no'} onChange={() => handleReasonChange('lessEffortful', 'no')} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ marginRight: '80px' }}>The sound is more natural:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'green' }}>Yes</span>
                    <input type="radio" name="moreNatural" value="yes" checked={reasons.moreNatural === 'yes'} onChange={() => handleReasonChange('moreNatural', 'yes')} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'red' }}>No</span>
                    <input type="radio" name="moreNatural" value="no" checked={reasons.moreNatural === 'no'} onChange={() => handleReasonChange('moreNatural', 'no')} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ marginRight: '20px' }}>The overall sound quality is better:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'green' }}>Yes</span>
                    <input type="radio" name="betterQuality" value="yes" checked={reasons.betterQuality === 'yes'} onChange={() => handleReasonChange('betterQuality', 'yes')} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'red' }}>No</span>
                    <input type="radio" name="betterQuality" value="no" checked={reasons.betterQuality === 'no'} onChange={() => handleReasonChange('betterQuality', 'no')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        <button disabled={!allReasonsAddressed || rate === 'None'} // Ensures both a selection and reasons are provided
                className="btn btn-lg btn-success mt-3"
                onClick={handleSubmitAnswer}>
          Submit Answer
        </button>
      </div>
    );
};

export default StudyItemPairwise;

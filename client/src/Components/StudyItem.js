import React, { useState, useEffect, useRef } from "react";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";
import styles from '../Components/study.module.css';
import { toast } from "react-toastify";
const StudyItem = ({ data, onClickSubmitAnswer }) => {
  const audioRef = useRef(null);
  const [rate, setRate] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const handleAudioPlay = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const audioElement = document.querySelector("audio");
    if (audioElement) {
      audioElement.addEventListener("play", handleAudioPlay);
      audioElement.addEventListener("pause", handleAudioPause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", handleAudioPlay);
        audioElement.removeEventListener("pause", handleAudioPause);
      }
    };
  }, []);

  const handleAudioEnded = () => {
    if (!showRating) {
    setShowRating(true); // Show the rating only after the first playback
  }
  if (audioRef.current) {
    audioRef.current.play(); // Loop the audio
  }
  };

  const handlePlayAudio = () => {
    if (audioRef?.current) {
      audioRef?.current?.play();
    }
  };

  const handlePauseAudio = () => {
    if (audioRef?.current) {
      audioRef?.current?.pause();
    }
  };

  const handleSubmitAnswer = () => {
    setShowRating(false);
    if (onClickSubmitAnswer) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
      onClickSubmitAnswer({ rate: rate, fileName: data?.file, timeTaken: timeTaken });
    }
    setRate(0);
  };

  useEffect(() => {
    toast.error(data?.path);
    if (audioRef.current) {
      audioRef.current.src = data?.path;
      setTimeout(() => {
        audioRef.current.play();
      }, 500);
    }
  }, [data?.path]);

  return (
    <div className="study-items d-flex flex-column align-items-center justify-content-center py-3">
      {!isPlaying && (
        <button
          onClick={handlePlayAudio}
          className="button btn btn-lg btn-primary play mb-3"
        >
          {showRating ? (
            <img src={Reload} alt="Study" loading="lazy" />
          ) : (
            <img src={Play} alt="Study" loading="lazy" />
          )}
        </button>
      )}
      {isPlaying && (
        <button
          onClick={handlePauseAudio}
          className="button btn btn-lg btn-primary play mb-3"
        >
          <img src={Pause} alt="Study" loading="lazy" />
        </button>
      )}
      <audio ref={audioRef} onEnded={handleAudioEnded}>
        <source src={data?.path} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {showRating && (
            <div className="mb-3 mt-3">
              <p className="text-center w-100">Please rate the audio</p>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap'  // Change this from 'nowrap' to 'wrap' to handle responsiveness
              }}>
                {[...Array(10)].map((_, index) => (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',  // Corrected from 'alignitems' to 'alignItems'
                    marginRight: '40px',   // Corrected from 'marginright' to 'marginRight'
                    marginBottom: '10px'   // Add some bottom margin for better spacing
                  }} key={index}>
                    <label htmlFor={`inlineRadio${index + 1}`} style={{
                      textAlign: 'center',  // Ensure the text is centered over the input
                      marginBottom: '4px'   // Add some space between the label and the radio button
                    }}>
                      {index + 1}
                    </label>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id={`inlineRadio${index + 1}`}
                      checked={rate === index + 1}
                      onChange={() => setRate(index + 1)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

      <button
        disabled={rate === 0}
        className="button btn btn-lg btn-success mt-3"
        type="button"
        onClick={handleSubmitAnswer}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default StudyItem;

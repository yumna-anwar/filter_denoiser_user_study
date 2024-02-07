import React, { useState, useEffect, useRef } from "react";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";

const StudyItem = ({ data, onClickSubmitAnswer }) => {
  const audioRef = useRef(null);
  const [rate, setRate] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = () => {
    setIsPlaying(true);
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
    setShowRating(true);
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
      onClickSubmitAnswer({ rate: rate, fileName: data?.file });
    }
    setRate(0);
  };

  useEffect(() => {
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
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio1"
              checked={rate === 1}
              onChange={() => setRate(1)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio1">
              1
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio2"
              checked={rate === 2}
              onChange={() => setRate(2)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio2">
              2
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio3"
              checked={rate === 3}
              onChange={() => setRate(3)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio3">
              3
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio4"
              checked={rate === 4}
              onChange={() => setRate(4)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio4">
              4
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio5"
              checked={rate === 5}
              onChange={() => setRate(5)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio5">
              5
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio6"
              checked={rate === 6}
              onChange={() => setRate(6)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio6">
              6
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio7"
              checked={rate === 7}
              onChange={() => setRate(7)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio7">
              7
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio8"
              checked={rate === 8}
              onChange={() => setRate(8)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio8">
              8
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio9"
              checked={rate === 9}
              onChange={() => setRate(9)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio9">
              9
            </label>
          </div>
          <div className="form-check form-check-inline pe-2">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio10"
              checked={rate === 10}
              onChange={() => setRate(10)}
            />
            <label className="form-check-label ps-1 bold" for="inlineRadio10">
              10
            </label>
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

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import styles from '../Components/FilterCentering.module.css';
import CommonService from "../Services/Common/CommonService";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";

const VentConfig = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayAudio, setReplayAudio] = useState(false);
  const navigate = useNavigate();
  const [stepSize, setStepSize] = useState('2');
  const [inputLevelsL, setInputLevelsL] = useState([]);
  const [inputLevelsR, setInputLevelsR] = useState([]);
  const [lginputValues, setlginputValues] = useState([]);
  const [rginputValues, setrginputValues] = useState([]);
  const [gainvaluesString, setgainvaluesString] = useState([]);
  const freq_labels = ['200', '500', '1000', '2000', '3000', '4000', '6000', '8000'];

  useEffect(() => {
    const size = parseInt(stepSize, 10);
    if (!isNaN(size) && size > 0) {
      setInputLevelsL(new Array(size).fill('1'));
      setInputLevelsR(new Array(size).fill('1'));
    } else {
      setInputLevelsL([]); // Ensure no invalid array length
      setInputLevelsR([]);
    }
  }, [stepSize]);

  const handleInputLevelChangeL = (index, value) => {
    const newInputLevelsL = [...inputLevelsL];
    newInputLevelsL[index] = value;
    setInputLevelsL(newInputLevelsL);
  };
  const handleInputLevelChangeR = (index, value) => {
    const newInputLevelsR = [...inputLevelsR];
    newInputLevelsR[index] = value;
    setInputLevelsR(newInputLevelsR);
  };

  const handlelgainChange = (index, value) => {
    const newlgainValues = [...lginputValues];
    newlgainValues[index] = value;
    setlginputValues(newlgainValues);
  };
  const handlergainChange = (index, value) => {
    const newrgainValues = [...rginputValues];
    newrgainValues[index] = value;
    setrginputValues(newrgainValues);
  };

  const handleSubmit = async (e) => {
  //console.log('Attempting to submit form');
  e.preventDefault(); // Prevent default form submission behavior
  // Check which button was clicked
  const multiplyAndConcatenate = (inputLevels, gainValues) => {
    let results = [];
    let resultsstring='';

    gainValues.forEach((gainValue) => {
      resultsstring=resultsstring+'['
      const numericGainValue = parseFloat(gainValue);
        inputLevels.forEach((level) => {
        const numericLevel = parseFloat(level);
        resultsstring=resultsstring+(numericLevel * numericGainValue).toString()
        resultsstring=resultsstring+' '
        results.push(numericLevel * numericGainValue);
      });
      resultsstring=resultsstring.slice(0, -1)+'];'
    });
    return [results,resultsstring];
    };


  const action = e.nativeEvent.submitter.name;
  const gainvaluesStringL = lginputValues.join(',');
  const gainvaluesStringR = rginputValues.join(',');
  // You can do different things depending on the action
  if (action === 'applyPlay') {
    // Logic for Apply & Play
    const [multipliedValuesL,multipliedStringL] = multiplyAndConcatenate(inputLevelsL, lginputValues);
    const [multipliedValuesR,multipliedStringR] = multiplyAndConcatenate(inputLevelsR, rginputValues);
    const mhagainparam = '[' + multipliedStringR + multipliedStringL.slice(0, -1) + ']'; // Corrected variable name
    setgainvaluesString('['+multipliedStringR+multipliedStringL.slice(0, -1)+']')
    try {
      //const mhagainparam = '['+multipliedStringR+multipliedStringL.slice(0, -1)+']'
      var payload = {
        mhagainparam: mhagainparam
      };
      const response = await CommonService.RunFilterAtest(payload);
      setgainvaluesString(response.message)
    } catch (error) {
      console.error('Error:', error);
      setgainvaluesString( error.message)
    }

  } else if (action === 'save') {
    // Logic for Save
    setgainvaluesString(gainvaluesString)
  }
};

  const handlePlayPauseAudio = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause(); // Pause audio playback
      } else {
        audioElement.play(); // Start audio playback
      }
      setIsPlaying(!isPlaying); // Toggle the play state
    }
  };

  const handleReplayAudio = () => {
  const audioElement = audioRef.current;
  if (audioElement) {
    // Pause the audio if it's currently playing
    if (isPlaying) {
      audioElement.pause();
    }

    // Set the audio playback time to the beginning
    audioElement.currentTime = 0;

    // Play the audio
    audioElement.play()
      .then(() => {
        setIsPlaying(true); // Update isPlaying state
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  useEffect(() => {
    // When replayAudio becomes true, reset it to false and play the audio
    if (replayAudio) {
      handleReplayAudio(); // Call the replay function directly
      setReplayAudio(false); // Reset replayAudio
    }
  }, [replayAudio]);



  return (
  <>
    <Header showExitBtn={true}/>

    <div className={styles.centeringContainer}>
      <form onSubmit={handleSubmit} className={styles.formLayout}>
        <h2 class={styles.smallheading}>Achieve Vent Effect</h2>
        <div className={styles.inlineGroup}>
          <label htmlFor="stepSize">Input Level (dB):</label>
          <input
            id="stepSize"
            type="number"
            value={stepSize}
            onChange={(e) => setStepSize(e.target.value)}
            min="1"
          />
        </div>

        <h3>Right Channel Gain</h3>
        <div className={styles.inlineGroup}>
          {freq_labels.map((label, index) => (
            <div key={index}>
              <label htmlFor={`input-${index}`}>{`${label} Hz`}</label>
              <input id={`input-${index}`} type="text" value={rginputValues[index]}
              onChange={(e) => handlergainChange(index, e.target.value)}/>
            </div>
          ))}
        </div>
        <div className={styles.inlineGroup}>
          {inputLevelsR.map((level, index) => (
            <div key={index}>
              <label htmlFor={`inputLevel-${index}`}>{index * (120/(stepSize-1))} dB:</label>
              <input
                id={`inputLevel-${index}`}
                type="text"
                value={level}
                onChange={(e) => handleInputLevelChangeR(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <h3>Left Channel Gain</h3>
        <div className={styles.inlineGroup}>
          {freq_labels.map((label, index) => (
            <div key={index}>
              <label htmlFor={`input-${index}`}>{`${label} Hz`}</label>
              <input id={`input-${index}`} type="text" value={lginputValues[index]}
              onChange={(e) => handlelgainChange(index, e.target.value)} />
            </div>
          ))}
        </div>

        <div className={styles.inlineGroup}>
          {inputLevelsL.map((level, index) => (
            <div key={index}>
              <label htmlFor={`inputLevel-${index}`}>{index * (120/(stepSize-1))} dB:</label>
              <input
                id={`inputLevel-${index}`}
                type="text"
                value={level}
                onChange={(e) => handleInputLevelChangeL(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button type="submit" name="applyPlay">Apply & Play</button>

        <button
            onClick={handlePlayPauseAudio}
            className={`button btn btn-lg btn-primary play mb-3 ${styles.playButton}`}
            style={{ width: "70px", height: "50px" }}
          >
            <img
              src={isPlaying ? Pause : Play} // Toggle icon based on isPlaying state
              alt={isPlaying ? "Pause" : "Play"} // Toggle alt text based on isPlaying state
              loading="lazy"
              style={{ width: "100%", height: "100%" }}
            />
          </button>
          <button onClick={handleReplayAudio} className={`button btn btn-lg btn-primary play mb-3 ${styles.playButton}`}
          style={{ width: "70px", height: "45px" }}><img
            src={Reload}
            loading="lazy"
            style={{ width: "100%", height: "100%" }}
          /></button>

          <audio ref={audioRef} >
            <source src="/api/stream-filterA-audio" type="audio/wav" />
            Your browser does not support the audio element.
          </audio>


        <button type="submit" name="save">Save</button>
        <p>{gainvaluesString}</p>
      </form>
    </div>

  </>
);
};

  export default VentConfig;

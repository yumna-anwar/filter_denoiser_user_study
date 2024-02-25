import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import styles from '../Components/FilterCentering.module.css';
import CommonService from "../Services/Common/CommonService";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";

const StudyItem = ({ filterType }) => {
  //const filterType = useState(filterType);
  const userId = useSelector((state) => state.CommonReducer.userId);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayAudio, setReplayAudio] = useState(false);
  const navigate = useNavigate();
  const [stepSize, setStepSize] = useState('2');
  const [oldfilters, setOldfilters] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [inputLevelsL, setInputLevelsL] = useState([]);
  const [inputLevelsR, setInputLevelsR] = useState([]);
  const [lginputValues, setlginputValues] = useState([]);
  const [rginputValues, setrginputValues] = useState([]);
  const [gainvaluesString, setgainvaluesString] = useState([]);
  const [logString, setlogString] = useState([]);
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

  useEffect(() => {
    fetchfilter();
  }, []);
  const fetchfilter = async () => {
    try {
      let response;
      if (filterType=="A"){
        response = await CommonService.GetFilterA();
        toast.success("Filter A Found");
      } else if (filterType=="B"){
        response = await CommonService.GetFilterB();
      }else if (filterType=="C"){
        response = await CommonService.GetFilterC();
      }else{
        toast.error("Filter not identified");
        response = await CommonService.GetFilterA();
      }

      if (response.success) {
        const data = response.data;
        const userIDsAndDates = data.map(entry => ({
          sno: entry.sno,
          userId: entry.UserId,
          date: entry.date
        }));
        setOldfilters(userIDsAndDates)
      } else {
        console.error("Failed to fetch filters");
        // setgainvaluesString("Failed to fetch user IDs")
      }
    } catch (error) {
      console.error("Error fetching user filters:", error);
    }
  };

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
  const [multipliedValuesL,multipliedStringL] = multiplyAndConcatenate(inputLevelsL, lginputValues);
  const [multipliedValuesR,multipliedStringR] = multiplyAndConcatenate(inputLevelsR, rginputValues);
  const mhagainparam = '[' + multipliedStringR + multipliedStringL.slice(0, -1) + ']'; // Corrected variable name
  setgainvaluesString(mhagainparam)

  if (action === 'applyPlay') {
    // Logic for Apply & Play
    try {
      //const mhagainparam = '['+multipliedStringR+multipliedStringL.slice(0, -1)+']'
      var payload = {
        mhagainparam: mhagainparam
      };
      let response;
      if (filterType=="A"){
        response = await CommonService.RunFilterAtest(payload);
      } else if (filterType=="B"){
        response = await CommonService.RunFilterBtest(payload);
      }else if (filterType=="C"){
        response = await CommonService.RunFilterCtest(payload);
      }else{
        toast.error("Filter not identified");
      }

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

  } else if (action === 'save') {
    // Logic for Save
    var payload = {
      UserId: userId,
      Step: stepSize,
      RHz200: rginputValues[0],
      RHz500: rginputValues[1],
      RHz1000: rginputValues[2],
      RHz2000: rginputValues[3],
      RHz3000: rginputValues[4],
      RHz4000: rginputValues[5],
      RHz6000: rginputValues[6],
      RHz8000: rginputValues[7],
      LHz200: lginputValues[0],
      LHz500: lginputValues[1],
      LHz1000: lginputValues[2],
      LHz2000: lginputValues[3],
      LHz3000: lginputValues[4],
      LHz4000: lginputValues[5],
      LHz6000: lginputValues[6],
      LHz8000: lginputValues[7],
      Volume: volume,
      Gaintable: mhagainparam
    };
    let response;
    if (filterType=="A"){
      response = await CommonService.AddFilterA(payload);
    } else if (filterType=="B"){
      response = await CommonService.AddFilterB(payload);
    }else if (filterType=="C"){
      response = await CommonService.AddFilterC(payload);
    }else{
      toast.error("Filter not identified");
    }

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

  }
  };

  const handlePlayPauseAudio = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause(); // Pause audio playback
        //setlogString("Audio Paused");
        toast.success("Audio Paused");
      } else {
        audioElement.volume=parseFloat(volume, 10);
        audioElement.play(); // Start audio playback
        //setlogString("Audio Playing");
        toast.success("Audio Playing");
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

      // Set the audio source URL with a unique query parameter
      let audioSourceUrl;
      if (filterType=="A"){
         audioSourceUrl = "http://localhost:3001/assets/test_sentence/filter"+filterType+"-test/stereo_ISTS.wav";
      } else if (filterType=="B"){
         audioSourceUrl = "http://localhost:3001/assets/test_sentence/filter"+filterType+"-test/stereo_Pink_Noise.wav";
      }else if (filterType=="C"){
         audioSourceUrl = "http://localhost:3001/assets/test_sentence/filter"+filterType+"-test/stereo_Pink_Noise.wav";
      }else{
         audioSourceUrl = "http://localhost:3001/assets/test_sentence/filter"+filterType+"-test/stereo_ISTS.wav";
      }

      const uniqueUrl = audioSourceUrl + "?t=" + Date.now(); // Append current timestamp as query parameter
      audioElement.src = uniqueUrl;

      // Load and play the audio
      audioElement.load();
      audioElement.volume=parseFloat(volume, 10);
      audioElement.play()

      // Set the audio playback time to the beginning
      audioElement.currentTime = 0;
      audioElement.play()
        .then(() => {
          setIsPlaying(true); // Update isPlaying state
          //setlogString("Audio Reloaded");
          toast.success("Audio Reloaded");
        })
        .catch((error) => {
          //setlogString("Error playing audio:" + error.message);
          toast.success(error.message);
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

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = parseFloat(e.target.value);
      //setlogString("Volume changed to:" + e.target.value);
      toast.success("Volume changed to: " + e.target.value);
    }
  };

  const handleFilterSelection = async (e) => {
    const newFilterId = e.target.value;
    setFilterId(newFilterId);
    let response;
    if (filterType=="A"){
       response = await CommonService.GetFilterAById(newFilterId);
    } else if (filterType=="B"){
       response = await CommonService.GetFilterBById(newFilterId);
    }else if (filterType=="C"){
       response = await CommonService.GetFilterCById(newFilterId);
    }else{
      toast.error("Filter not identified");
    }


    const data = response.data
    setStepSize(data.step);
    setrginputValues([data.R200hz,data.R500hz,data.R1000hz,data.R2000hz,data.R3000hz,data.R4000hz,data.R6000hz,data.R8000hz])
    setlginputValues([data.L200hz,data.L500hz,data.L1000hz,data.L2000hz,data.L3000hz,data.R4000hz,data.L6000hz,data.L8000hz])
    setVolume(data.volume)
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    };


  return (
    <div className={styles.centeringContainer}>
      <form onSubmit={handleSubmit} className={styles.formLayout}>

          {filterType === "A" ? (
            <h2 class={styles.smallheading}>Achieve Pinna Effect</h2>
        ) : filterType === "B" ?(
          <h2 class={styles.smallheading}>Vent Effect</h2>
        ):filterType === "C" ?(
          <h2 class={styles.smallheading}>Insertion Loss</h2>
        ): (
          <h2 class={styles.smallheading}>FILTER NOT IDENTIFIED</h2>
        )}


        <div className={styles.inlineGroup}>
            <label htmlFor="userId">Load from previously saved:</label>
            <select
              id="filterId"
              value={filterId}
              onChange={handleFilterSelection}
            >
              <option value="">Load from previously saved</option>
              {oldfilters.map(({ sno, userId, date }) => (
                <option key={sno} value={sno}>
                  {`${sno} - ${userId} - ${date}`}
                </option>
              ))}
            </select>
          </div>

        <div className={styles.inlineGroup}>
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
          style={{ width: "70px", height: "50px" }}><img
            src={Reload}
            loading="lazy"
            style={{ width: "100%", height: "100%" }}
          /></button>

          <audio ref={audioRef} >
          {filterType === "A" ? (
            <source src={`http://localhost:3001/assets/test_sentence/filter${filterType}-test/stereo_ISTS.wav`} type="audio/wav" />
            ) : filterType === "B" ?(
          <source src={`http://localhost:3001/assets/test_sentence/filter${filterType}-test/stereo_Pink_Noise.wav`} type="audio/wav" />
          ):filterType === "C" ?(
          <source src={`http://localhost:3001/assets/test_sentence/filter${filterType}-test/stereo_Pink_Noise.wav`} type="audio/wav" />
          ): (
          <source src={`http://localhost:3001/assets/test_sentence/filter${filterType}-test/stereo_ISTS.wav`} type="audio/wav" />
          )}
            Your browser does not support the audio element.
          </audio>
          </div>

         <div className={styles.inlineGroup}>
           <label htmlFor="volume">Volume:</label>
           <input
             id="volume"
             type="range"
             min="0"
             max="1"
             step="0.01"
             value={volume}
             onChange={handleVolumeChange}
           />
         </div>

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

        <button type="submit" name="applyPlay"
        className={`button btn btn-lg btn-secondary play mb-3 ${styles.playButton}`}
        style={{ width: "100px", height: "50px" }}>Apply</button>
        <button type="submit" name="save"
        className={`button btn btn-lg btn-success play mb-3 ${styles.playButton}`}
        style={{ width: "80px", height: "50px" }}>Save</button>




      </form>
    </div>

  );
};

export default StudyItem;

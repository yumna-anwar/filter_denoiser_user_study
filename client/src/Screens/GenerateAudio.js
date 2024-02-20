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

const GenerateAudio = () => {
  const userId = useSelector((state) => state.CommonReducer.userId);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayAudio, setReplayAudio] = useState(false);
  const navigate = useNavigate();
  const [participantIds, setParticipantsIds] = useState([]); // List of user IDs
  const [participantId, setParticipantId] = useState(""); // Selected user ID
  const [oldfiltersA, setOldfiltersA] = useState([]);
  const [oldfiltersB, setOldfiltersB] = useState([]);
  const [oldfiltersC, setOldfiltersC] = useState([]);
  const [filterIdA, setFilterIdA] = useState('');
  const [filterIdB, setFilterIdB] = useState('');
  const [filterIdC, setFilterIdC] = useState('');
  const [filterAgtable, setFilterAgtable] = useState('');
  const [filterBgtable, setFilterBgtable] = useState('');
  const [filterCgtable, setFilterCgtable] = useState('');


  useEffect(() => {
    fetchfilter("A");
    fetchfilter("B");
    fetchfilter("C");
    fetchParticipantIds();
  }, []);

  const fetchParticipantIds = async () => {
    try {
      const response = await CommonService.GetUserGain();
      if (response.success) {
        const data = response.data;
        const ids = Object.values(data).map(user => user.participantID);
        setParticipantsIds(ids);
      } else {
        console.error("Failed to fetch user IDs");
        // setgainvaluesString("Failed to fetch user IDs")
      }
    } catch (error) {
      console.error("Error fetching user IDs:", error);
    }
  };

  const fetchfilter = async (filterType) => {
    try {
      let response;
      if (filterType=="A"){
        response = await CommonService.GetFilterA();
        //toast.success("Filter A Found");
      } else if (filterType=="B"){
        response = await CommonService.GetFilterB();
        //toast.success("Filter B Found");
      }else if (filterType=="C"){
        response = await CommonService.GetFilterC();
        //toast.success("Filter C Found");
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

        if (filterType=="A"){
          setOldfiltersA(userIDsAndDates)
        } else if (filterType=="B"){
          setOldfiltersB(userIDsAndDates)
        }else if (filterType=="C"){
          setOldfiltersC(userIDsAndDates)
        }else{
          toast.error("Filter not identified");
          response = await CommonService.GetFilterA();
        }

      } else {
        console.error("Failed to fetch filters");
        // setgainvaluesString("Failed to fetch user IDs")
      }
    } catch (error) {
      console.error("Error fetching user filters:", error);
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
        audioElement.volume=0.5
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
      const audioSourceUrl = "http://localhost:3001/assets/test_sentence/filterA-test/stereo_ISTS.wav";
      const uniqueUrl = audioSourceUrl + "?t=" + Date.now(); // Append current timestamp as query parameter
      audioElement.src = uniqueUrl;

      // Load and play the audio
      audioElement.load();
      audioElement.volume=0.5
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

  const handleFilterSelection = async (e, filterType) => {
    const newFilterId = e.target.value;
    setFilterIdA(newFilterId)
    let response;
    if (filterType=="A"){
       response = await CommonService.GetFilterAById(newFilterId);

       setFilterAgtable(response.data.gtable)
    } else if (filterType=="B"){
       response = await CommonService.GetFilterBById(newFilterId);
       setFilterBgtable(response.data.gtable)
    }else if (filterType=="C"){
       response = await CommonService.GetFilterCById(newFilterId);
       setFilterCgtable(response.data.gtable)
    }else{
      toast.error("Filter not identified");
    }

    const data = response.data
    toast.success(data.gtable);
    };

    const handleSubmit = async (e) => {
      //console.log('Attempting to submit form');
      e.preventDefault(); // Prevent default form submission behavior

      };

  return (
  <>
    <Header showBackBtn={true}/>

    <div className={styles.centeringContainer}>
    <form onSubmit={handleSubmit} className={styles.formLayout}>

    <div className={styles.inlineGroup}>
        <label htmlFor="userId">Load Filter A:</label>
        <select
          id="filterIdA"
          value={filterIdA}
          onChange={(e) => handleFilterSelection(e, 'A')}
        >
          <option value="">Load Filter A</option>
          {oldfiltersA.map(({ sno, userId, date }) => (
            <option key={sno} value={sno}>
              {`${sno} - ${userId} - ${date}`}
            </option>
          ))}
        </select>
      </div>
      <p>Selected Filter A gain table: {filterAgtable}</p>
      <div className={styles.inlineGroup}>
          <label htmlFor="userId">Load Filter B:</label>
          <select
            id="filterIdB"
            value={filterIdB}
            onChange={(e) => handleFilterSelection(e, 'B')}
          >
            <option value="">Load Filter B</option>
            {oldfiltersB.map(({ sno, userId, date }) => (
              <option key={sno} value={sno}>
                {`${sno} - ${userId} - ${date}`}
              </option>
            ))}
          </select>
        </div>
        <p>Selected Filter B gain table: {filterBgtable}</p>
        <div className={styles.inlineGroup}>
            <label htmlFor="userId">Load Filter C:</label>
            <select
              id="filterIdC"
              value={filterIdC}
              onChange={(e) => handleFilterSelection(e, 'C')}
            >
              <option value="">Load Filter C</option>
              {oldfiltersC.map(({ sno, userId, date }) => (
                <option key={sno} value={sno}>
                  {`${sno} - ${userId} - ${date}`}
                </option>
              ))}
            </select>
          </div>
          <p>Selected Filter C gain table: {filterCgtable}</p>
          <br />
    <div className={styles.inlineGroup}>
        <label htmlFor="participantId">Select Participant:</label>
        <select
          id="participantId"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        >
          <option value="">Select Participant ID</option>
          {participantIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>


      <button type="submit" name="save"
      className={`button btn btn-lg btn-success play mb-3 ${styles.playButton}`}
      style={{ width: "180px", height: "55px" }}>Generate Audio</button>

        </form>
    </div>

  </>
);
};

export default GenerateAudio;

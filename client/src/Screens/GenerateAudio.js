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

  return (
  <>
    <Header showExitBtn={true}/>

    <div className={styles.centeringContainer}>
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
    </div>

  </>
);
};

export default GenerateAudio;

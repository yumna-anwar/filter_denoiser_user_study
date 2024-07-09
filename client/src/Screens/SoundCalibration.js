import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../Components/Header";
import { toast } from "react-toastify";
import CommonService from "../Services/Common/CommonService";
const SoundCalibration = () => {
  const participantId = useSelector((state) => state.CommonReducer.userId);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  // Example fetching an audio URL - adjust according to your actual API/service structure
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        // Assuming `CommonService.fetchAudio` is a method that fetches the audio file URL
        const url = "http://localhost:3001/assets/test_sentence/combined_speech.wav";
        setAudioUrl(url);
      } catch (error) {
        toast.error("Error fetching audio file: " + error.message);
      }
    };

    fetchAudio();
  }, [participantId]);


  return (
      <>
        <Header showHomeBtn={true} />
        <div className="inner-layout">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-10 col-xl-8">
                <div className="d-flex flex-column justify-content-center align-items-center">
                  {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} controls loop>
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default SoundCalibration;

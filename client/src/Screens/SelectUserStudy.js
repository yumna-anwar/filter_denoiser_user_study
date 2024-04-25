import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonService from "../Services/Common/CommonService";
import Header from "../Components/Header";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import styles from '../Components/FilterCentering.module.css';

const SelectUserStudy = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.CommonReducer.userId);
  const [participantId, setParticipantId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userStudyGuid, setUserStudyGuid] = useState(uuidv4());

  const loadFiles = async () => {
    const response = await CommonService.GetAllFiles();
    if (response.success) {
      setFileData(response.fileData);
    }
  };

  useEffect(() => {
    //loadFiles();
    fetchParticipantIds();
  }, []);


  const handleParticipantSelection = async (e) => {
    const newParticipantId = e.target.value;
    setParticipantId(newParticipantId)
    };

  const fetchParticipantIds = async () => {
    try {
      const response = await CommonService.GetAllDirectories();
      //toast.success("Fetching all directories");
      if (response.success) {
        const ids = response.directories;//Object.values(data).map(user => user.participantID);

        setParticipantIds(ids);
      } else {
        toast.error("Error in fetching user directories");
        // setgainvaluesString("Failed to fetch user IDs")
      }
    } catch (error) {
      toast.error("Failed to fetch user directories");
      toast.error(error.message);
    }
  };


  return (
    <>
      <Header showStopStudyBtn={true} />
      <div className="inner-layout">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-10 col-xl-8">
              <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2 class={styles.smallheading}>SELECT USER</h2>
                    <div className={styles.inlineGroup}>
                        <label htmlFor="participantId">Select User:</label>
                        <select
                          id="participantId"
                          value={participantId}
                          onChange={handleParticipantSelection}
                        >
                          <option value="">Select User ID</option>
                          {participantIds.map((id) => (
                            <option key={id} value={id}>
                              {id}
                            </option>
                          ))}
                        </select>
                      </div>
                      <br />
                      <div className={styles.inlineGroup}>
                        <button
                        className="button btn btn-lg btn-success"
                        type="button"
                        onClick={() => navigate(`/user-study/${participantId}`)}
                      >
                        Start User Study
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

export default SelectUserStudy;

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Header from "../Components/Header";
import FilesModal from '../Components/FilesModal';
import SpinnerModal from '../Components/SpinnerModal';
import styles from '../Components/FilterCentering.module.css';
import CommonService from "../Services/Common/CommonService";
import Play from "../Assests/Images/play.svg";
import Pause from "../Assests/Images/pause.svg";
import Reload from "../Assests/Images/reload.svg";

const GenerateAudio = () => {
  const userId = useSelector((state) => state.CommonReducer.userId);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [latency, setLatency] = useState(0);
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
  const [filterUsergtable, setFilterUsergtable] = useState('');
  const [filterAgtable, setFilterAgtable] = useState('');
  const [filterBgtable, setFilterBgtable] = useState('');
  const [filterCgtable, setFilterCgtable] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        }

      } else {
        console.error("Failed to fetch filters");
        // setgainvaluesString("Failed to fetch user IDs")
      }
    } catch (error) {
      console.error("Error fetching user filters:", error);
    }
  };


  const handleUsergainSelection = async (e) => {
    const newParticipantId = e.target.value;
    setParticipantId(newParticipantId);
    const response = await CommonService.GetUserGainById(newParticipantId);

    if (response.success) {
      setFilterUsergtable(response.data.gtable)
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    };

  const handleFilterSelection = async (e, filterType) => {
    const newFilterId = e.target.value;

    let response;
    if (filterType=="A"){
        setFilterIdA(newFilterId)
       response = await CommonService.GetFilterAById(newFilterId);

       setFilterAgtable(response.data.gtable)
    } else if (filterType=="B"){
      setFilterIdB(newFilterId)
       response = await CommonService.GetFilterBById(newFilterId);
       setFilterBgtable(response.data.gtable)
    }else if (filterType=="C"){
      setFilterIdC(newFilterId)
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
      const action = e.nativeEvent.submitter.name;
      if (action === 'save') {

        setIsLoading(true);
        try {
          //const mhagainparam = '['+multipliedStringR+multipliedStringL.slice(0, -1)+']'

          var payload = {
            mhagainparam: filterUsergtable,
            filterAparam: filterAgtable,
            filterBparam: filterBgtable,
            filterCparam: filterCgtable,
            latency: latency,
            participantId: participantId

          };
          const response = await CommonService.RunUserGainAll(payload);
          toast.success(response.message)
        } catch (error) {
          console.error('Error:', error);
          toast.success( error.message)
        }finally {
        setIsLoading(false); // Stop loading
      }
      }

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
          onChange={(e) => handleUsergainSelection(e)}
        >
          <option value="">Select Participant ID</option>
          {participantIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
      <p>Selected User HA gain table: {filterUsergtable}</p>

      <div className={styles.inlineGroup}>
        <label htmlFor="stepSize">Latency (ms):</label>
        <input
          id="latency"
          type="number"
          value={latency}
          onChange={(e) => setLatency(e.target.value)}
          min="0"
        />
      </div>


      <button type="submit" name="save"
      className={`button btn btn-lg btn-success play mb-3 ${styles.playButton}`}
      style={{ width: "180px", height: "55px" }}>{isLoading ? 'Processing...' : 'Generate Audio'}</button>

      <SpinnerModal isOpen={isLoading}>
        <div className={styles.modalheader}>Processing...</div>
        <div className={styles.modalbody}>
          <div className={styles.loader}></div>
        </div>
      </SpinnerModal>


      <div className={styles.inlineGroup}>
      <button onClick={() => setModalOpen(true)}>View Data</button>
      <FilesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} participantId={participantId} />
      </div>

        </form>


    </div>

  </>
);
};

export default GenerateAudio;

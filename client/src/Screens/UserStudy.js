import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import CommonService from "../Services/Common/CommonService";
import StudyItem from "../Components/StudyItem";
import Header from "../Components/Header";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import styles from '../Components/FilterCentering.module.css';
import { useParams } from 'react-router-dom';

const UserStudy = () => {
  const { participantId } = useParams();
  const userId = participantId//useSelector((state) => state.CommonReducer.userId);
  const [fileData, setFileData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userStudyGuid, setUserStudyGuid] = useState(uuidv4());

  const loadFiles = async () => {
    const response = await CommonService.GetAllFilesUser(participantId);
    //const response = await CommonService.GetAllFiles(participantId);
    if (response.success) {
      setFileData(response.fileData);
    }
  };

  useEffect(() => {
    toast.success("Study loaded");
    toast.success("User: "+participantId);
    loadFiles();
  }, []);

  const handleOnClickSubmitAnswer = async (data) => {
    var payload = {
      UserId: userId,
      FileName: data.fileName,
      Rate: data.rate,
      Guid: userStudyGuid,
    };
    var response = await CommonService.AddUserStudy(payload);
    if (response.success) {
      toast.success(response.message);
      if (currentIndex < fileData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      toast.error(response.message);
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
                      <h2>Denoiser Study</h2>
                      <h6>
                        Set {currentIndex + 1}: {currentIndex + 1}/{fileData.length}
                      </h6>
                      {fileData.length > 0 && currentIndex < fileData.length && (
                        <StudyItem
                          data={fileData[currentIndex]}
                          onClickSubmitAnswer={handleOnClickSubmitAnswer}
                        />
                      )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default UserStudy;

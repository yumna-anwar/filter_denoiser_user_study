import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import StudyItemPairwise from "../Components/StudyItemPairwise";
import Header from "../Components/Header";
import CommonService from "../Services/Common/CommonService"; // Assuming this service exists and is set up to fetch files

const UserStudyPairwiseDemo = () => {
  const participantId = useSelector((state) => state.CommonReducer.userId);
  //const { participantId } = useParams();
  const userId = participantId
  const [fileData, setFileData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userStudyGuid, setUserStudyGuid] = useState(uuidv4());
  const [isStudyComplete, setIsStudyComplete] = useState(false);

  const loadFiles = async () => {
        try {
          const filePairs = await CommonService.GetAllFilesPairwise();
          if (filePairs.success) {
            // Assuming you want to randomize and then pick the first 5 pairs for demo purposes
            const shuffledPairs = shuffleArray([...filePairs.filePairs]); // Copy and shuffle the original array
            const demoPairs = shuffledPairs.slice(0, 2); // Slice the first 5 pairs for the demo
            setFileData(demoPairs);
          } else {
            // toast.error("Failed to load file pairs");
          }
        } catch (error) {
          console.error("Error fetching file pairs:", error);
          // toast.error("Error loading files.");
        }
      };

      // useEffect to load files on component mount
   useEffect(() => {
     loadFiles();
   }, [participantId]); // Dependency on participantId ensures re-fetching if it changes


   // Function to shuffle array, used to randomize the order of audio file pairs
  function shuffleArray(array, seed) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }


   const handleOnClickSubmitAnswer = async (data) => {
     var payload = {
       UserId: userId,
       FileName1: data.fileName1,
       FileName2: data.fileName2,
       Rate: data.rate,
       TimeTaken: data.timeTaken,
       Guid: userStudyGuid,
     };
     // toast.success(payload.FileName1);
     // toast.success(payload.FileName2);
     if (currentIndex < fileData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsStudyComplete(true); // Set study completion state
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
                {!isStudyComplete ? (
                  <>
                    <h6>
                      Set {currentIndex + 1}: {currentIndex + 1}/{fileData.length}
                    </h6>
                    <StudyItemPairwise
                      data={fileData[currentIndex]}
                      onClickSubmitAnswer={handleOnClickSubmitAnswer}
                    />
                  </>
                ) : (
                  <h6>Study completed</h6>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default UserStudyPairwiseDemo;

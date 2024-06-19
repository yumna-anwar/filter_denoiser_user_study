import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import StudyItemPairwise from "../Components/StudyItemPairwise";
import Header from "../Components/Header";
import CommonService from "../Services/Common/CommonService"; // Assuming this service exists and is set up to fetch files

const UserStudyPairwise = () => {
  const participantId = useSelector((state) => state.CommonReducer.userId);
  //const { participantId } = useParams();
  const userId = participantId
  const [fileData, setFileData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userStudyGuid, setUserStudyGuid] = useState(uuidv4());
  const [isStudyComplete, setIsStudyComplete] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = 3; // You've specified splitting into three sets

    const loadFiles = async () => {
        try {
          const filePairs = await CommonService.GetAllFilesPairwise();
          if (filePairs.success) {
            const shuffledPairs = shuffleArray([...filePairs.filePairs]);
            setFileData(shuffledPairs);
          } else {
            toast.error("Failed to load file pairs");
          }
        } catch (error) {
          console.error("Error fetching file pairs:", error);
          toast.error("Error loading files.");
        }
      };

      // useEffect to load files on component mount
   useEffect(() => {
     loadFiles();
   }, [participantId]); // Dependency on participantId ensures re-fetching if it changes


  const itemsPerSet = fileData.length > 0 ? Math.ceil(fileData.length / totalSets) : 0;

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
       ReasonslessAnnoying: data.reasons['lessAnnoying'],
       ReasonslessEffortful: data.reasons['lessEffortful'],
       ReasonsmoreNatural: data.reasons['moreNatural'],
       ReasonsbetterQuality: data.reasons['betterQuality'],
       Guid: userStudyGuid,
     };

     var response = await CommonService.AddUserStudyPairwise(payload);
     if (response.success) {
      // if (currentIndex < itemsPerSet * currentSet - 1 && currentIndex < fileData.length - 1) {
      if (currentIndex < itemsPerSet * currentSet - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentSet < totalSets) {
        setIsBreak(true); // Set break state to true
      } else {
        setIsStudyComplete(true);
      }
    } else {
      toast.error(response.message);
    }
   };

   const handleContinue = () => {
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      // setCurrentIndex(itemsPerSet * (currentSet - 1));
      setCurrentIndex(itemsPerSet * currentSet );
      setIsBreak(false); // Exit break state
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

                {!isStudyComplete ? (
                isBreak ? (
                  <>
                    <h6>Break Time. Please click continue when ready.</h6>
                    <button className="btn btn-primary" onClick={handleContinue}>Continue</button>
                  </>
                ) : (
                  <>
                    <h6>
                      Set {currentSet}: Trial {currentIndex - itemsPerSet * (currentSet - 1) + 1} of {itemsPerSet}
                    </h6>
                    <StudyItemPairwise
                      data={fileData[currentIndex]}
                      onClickSubmitAnswer={handleOnClickSubmitAnswer}
                    />
                  </>
                )
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

export default UserStudyPairwise;

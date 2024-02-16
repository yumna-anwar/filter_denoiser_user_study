import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import styles from '../Components/FilterCentering.module.css';
import CommonService from "../Services/Common/CommonService";
import FilterItem from "../Components/FilterItem";

const PinnaConfig = () => {
  return (
  <>
    <Header showExitBtn={true}/>

    <FilterItem
      filterType={"A"}
    />

  </>
);
};
  export default PinnaConfig;

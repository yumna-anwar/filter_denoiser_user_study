
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import styles from '../Components/FilterCentering.module.css';
import CommonService from "../Services/Common/CommonService";
import FilterItem from "../Components/FilterItem";

const VentConfig = () => {
  return (
  <>
    <Header showExitBtn={true}/>

    <FilterItem
      filterType={"B"}
    />

  </>
);
};

export default VentConfig;

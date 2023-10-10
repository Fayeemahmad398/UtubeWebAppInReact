import React, { createContext, useState } from "react";
import {
  fetchLogosOfChannels,
  calculateViewCounts,
  parseISO8601Duration,
  CalculateLikeAndComment,
  calculateTime,
} from "../CommonFunctions/commonFuncs";
import { useContext } from "react";

const useMyContext = createContext();

function MyContext({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [playingVideo, setPlayingVideo] = useState(""); //video obj to play in iframe
  const [relaventData, setRelaventData] = useState([]); //during playing video other data would be show aside

  const values = {
    searchTerm: searchTerm,
    relaventData: relaventData,
    playingVideo: playingVideo,
    setPlayingVideo: setPlayingVideo,
    setRelaventData: setRelaventData,
    setSearchTerm: setSearchTerm,
    calculateViewCounts: calculateViewCounts,
    fetchLogosOfChannels: fetchLogosOfChannels,
    parseISO8601Duration: parseISO8601Duration,
    calculateTime: calculateTime,
    calculateViewCounts: calculateViewCounts,
    CalculateLikeAndComment: CalculateLikeAndComment,
  };

  return (
    <useMyContext.Provider value={values}>{children}</useMyContext.Provider>
  );
}

export default MyContext;

export const useMyContextFuncs = function () {
  return useContext(useMyContext);
};

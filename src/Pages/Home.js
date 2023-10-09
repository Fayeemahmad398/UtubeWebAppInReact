import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  calculateViewCounts,
  calculateTime,
  parseISO8601Duration,
} from "../CommonFunctions/commonFuncs";

import { useMyContextFuncs } from "../myContext/MyContext";

const Home = () => {
  const [videos, setVideos] = useState([]);

  const api_key = process.env.REACT_APP_API_KEY;

  const urlForTrending = `https://www.googleapis.com/youtube/v3/videos?key=${api_key}
  &part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=12&regionCode=IN`;

  const navigator = useNavigate();
  const useContextData = useMyContextFuncs();

  function FetchTrendingData() {
    return new Promise((resolve, reject) => {
      axios
        .get(urlForTrending)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.status);
            resolve(response.data.items);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  async function handleTrendingPromise() {
    const defaultData = await FetchTrendingData(); //fetching trending videos
    const defaultData1 = await useContextData.fetchLogosOfChannels(defaultData); //fetching logos for channels
    localStorage.setItem("trendingDataWithLogo", JSON.stringify(defaultData1));
    setVideos(defaultData1);
  }

  // -----------------------------------------------
  
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("trendingDataWithLogo"))) {
      setVideos(JSON.parse(localStorage.getItem("trendingDataWithLogo")));
      console.log("Local working for trending Data");
    } else {
      console.log("api working for trending");
      handleTrendingPromise();
    }
  }, []);
  console.log(videos)
  // ---------------------------------------
  return (
    <div id="mainT">
      {videos.length > 0 &&
        videos.map((obj) => {
          return (
            <div
              key={obj.id}
              className="onevideobox"
              onClick={() => {
                useContextData.setPlayingVideo(obj);
                useContextData.setRelaventData(videos);
                navigator(`/VideoPlay`);
              }}
            >
              <div >
                <img src={obj.snippet.thumbnails.high.url} className="imges" />
              </div>
              <div id="duration">
                <p id="durP">
                  {obj.contentDetails &&
                    parseISO8601Duration(obj.contentDetails.duration)}
                </p>
              </div>
              <div className="homelogotitle">
                <div className="channelimglogo">
                  <img className="channel-logo" src={obj.urllogo} alt="" />
                  <h5>{obj.snippet.title}</h5>
                </div>
                <div className="channelNameOnHome">
                  <p className="channelsName">{obj.snippet.channelTitle}</p>
                </div>
              </div>
              <div id="flexDiv">
                <p>{calculateViewCounts(obj.statistics.viewCount)} . </p>
                <p>{calculateTime(obj.snippet.publishedAt) + " "} ago</p>
              </div>
            </div>
          );
        })}
      <h1>{}</h1>
    </div>
  );
};

export default Home;

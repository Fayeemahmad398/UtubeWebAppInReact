import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useMyContextFuncs } from "../myContext/MyContext";
import { toast } from "react-toastify";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const navigator = useNavigate();
  const {
    parseISO8601Duration,
    calculateTime,
    calculateViewCounts,
    setPlayingVideo,
    setRelaventData,
    fetchLogosOfChannels,
  } = useMyContextFuncs();

  const api_key = process.env.REACT_APP_API_KEY;

  // base url with endpoint videos
  const urlForTrending = `https://www.googleapis.com/youtube/v3/videos`;
  let trendingUrlParams = {
    key: `${api_key}`,
    part: "snippet,statistics,contentDetails",
    chart: "mostPopular",
    maxResults: 15,
    regionCode: `IN`,
  };

  function FetchTrendingData() {
    return new Promise((resolve, reject) => {
      axios
        .get(urlForTrending, { params: trendingUrlParams })
        .then((response) => {
          if (response.status == 200) {
            console.log(response.status);
            resolve(response.data.items);
          } else {
            reject({ code: response.status });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function handleTrendingPromise() {
    try {
      const defaultData = await FetchTrendingData(); //fetching trending videos
      const defaultData1 = await fetchLogosOfChannels(defaultData); //fetching logos for channels
      sessionStorage.setItem(
        "trendingDataWithLogo",
        JSON.stringify(defaultData1)
      );
      setVideos(defaultData1);
    } catch (error) {
      toast.error(`Unexpected  Error is: ${error.code}`, {
        style: {
          color: "red",
        },
      });

      console.log(error.code);
    }
  }

  // -----------------------------------------------

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("trendingDataWithLogo"))) {
      setVideos(JSON.parse(sessionStorage.getItem("trendingDataWithLogo")));
      console.log("session working for trending Data");
    } else {
      console.log("api working for trending");
      handleTrendingPromise();
    }
  }, []);

  console.log(videos);
  // --------------------------------------------
  return (
    <div id="mainT">
      {videos.length > 0 &&
        videos.map((obj) => {
          return (
            <div
              key={obj.id}
              className="onevideobox"
              onClick={() => {
                setPlayingVideo(obj);
                setRelaventData(videos);
                navigator(`/VideoPlay`);
              }}
            >
              <div>
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
                  <img className="channel-logo" src={obj.urllogo} alt="NA" />
                  <h5 className="title-of-video">{obj.snippet.title}</h5>
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

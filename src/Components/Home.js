import axios from "axios";
import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router";
import { useContext } from "react";
import MyContext from "./GlobalContext";

export const calculateViewCounts = (stringNumber) => {
  const viewcounts = parseInt(stringNumber);

  if ((viewcounts > 999) & (viewcounts < 1000000)) {
    return (viewcounts / 1000).toFixed(1) + "K views";
  } else if ((viewcounts >= 1000000) & (viewcounts < 1000000000)) {
    return (viewcounts / 1000000).toFixed(1) + "M views";
  } else if (viewcounts >= 1000000000) {
    return (viewcounts / 1000000000).toFixed(1) + "B views";
  } else {
    return viewcounts.toString() + " views";
  }
};
export function CalculateLikeAndComment(number) {
  const getViews = calculateViewCounts(number);
  return getViews.slice(0, getViews.length - 5);
}
export const calculateTime = (timeInUTC) => {
  const time_Ago_in_secs = ((new Date() - new Date(timeInUTC)) / 1000).toFixed(
    0
  );
  const time_Ago_in_mins = (time_Ago_in_secs / 60).toFixed(0);
  const time_Ago_in_hours = (time_Ago_in_mins / 60).toFixed(0);
  const time_Ago_in_days = (time_Ago_in_hours / 24).toFixed(0);
  const time_ago_in_weeks = (time_Ago_in_days / 7).toFixed(0);
  const time_Ago_in_months = (time_Ago_in_days / 30).toFixed(0);
  const time_Ago_in_years = (time_Ago_in_months / 12).toFixed(0);

  if (time_Ago_in_years > 0) {
    return time_Ago_in_years + " years";
  } else if (time_Ago_in_months > 0) {
    return time_Ago_in_months + " months";
  } else if (time_ago_in_weeks > 0 && time_ago_in_weeks < 4) {
    if (time_Ago_in_days < 7) {
      return time_Ago_in_days + " days"; //it was bug
    } else {
      return time_ago_in_weeks + " weeks";
    }
  } else if (time_Ago_in_days > 0) {
    return time_Ago_in_days + " days";
  } else if (time_Ago_in_hours > 0) {
    return time_Ago_in_hours + " hours";
  } else if (time_Ago_in_mins > 0) {
    return time_Ago_in_mins + " mins";
  } else {
    return time_Ago_in_secs + " secs";
  }
};

export const parseISO8601Duration = (duration) => {
  const matches = duration.match(/[0-9]+[HMS]/g);
  let timeString = "";
  if (matches) {
    matches.forEach((match) => {
      const unit = match.charAt(match.length - 1);
      const value = parseInt(match.slice(0, -1), 10);

      if (unit === "H") timeString += value + " hours ";
      else if (unit === "M") timeString += value + " mins ";
      else if (unit === "S") timeString += value + " secs ";
    });
  }
  return timeString.trim();
};
const Home = () => {
  const [videos, setVideos] = useState([]);
  const api_key = process.env.REACT_APP_UTUBEKEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?key=${api_key}&part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=12&regionCode=IN`;
  const myGlobalObj = useContext(MyContext);
  console.log(myGlobalObj);
  const navigator = useNavigate();

  function fetchLogosOfChannels(defaultData) {
    const newArrForIds = [];
    defaultData.map((obj) => {
      newArrForIds.push(obj.snippet.channelId);
    });

    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${newArrForIds.toString()}&key=${api_key}`
        )
        .then((response) => {
          if (response.status === 200) {
            for (let i = 0; i < response.data.items.length; i++) {
              defaultData[i].urllogo =
                response.data.items[i].snippet.thumbnails.default.url;
              console.log("Df");
            }
            resolve(defaultData);
          } else {
            reject("error is there");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  function FetchTrendingData() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            resolve(response.data.items);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  useEffect(() => {
    myGlobalObj.fetchLogosOfChannels = fetchLogosOfChannels;

    async function handlepromise() {
      const defaultData = await FetchTrendingData();
      const defaultData1 = await fetchLogosOfChannels(defaultData);
      localStorage.setItem(
        "trendingDataWithLogo",
        JSON.stringify(defaultData1)
      );
      setVideos(defaultData1);
    }

    if (JSON.parse(localStorage.getItem("trendingDataWithLogo"))) {
      setVideos(JSON.parse(localStorage.getItem("trendingDataWithLogo")));
      console.log("local working for trending");
    } else {
      console.log("api working");
      handlepromise();
    }
  }, []);

  return (
    <div id="mainT">
      {videos.length > 0 &&
        videos.map((obj) => {
          return (
            <div
              key={obj.id}
              className="onevideobox"
              onClick={() => {
                myGlobalObj.playingVideo = obj;
                myGlobalObj.relaventData = videos;
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
                  <img className="channel-logo" src={obj.urllogo} alt="" />
                  <h5>{obj.snippet.title}</h5>
                </div>
                {console.log(videos)}
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

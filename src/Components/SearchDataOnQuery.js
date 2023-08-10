import { useEffect, useState } from "react";
import MyContext from "./GlobalContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const SearchDataOnQuery = () => {
  const navigator = useNavigate();
  const [Data, setData] = useState([]);
  const api_key = process.env.REACT_APP_UTUBEKEY;
  const myGlobalObj = useContext(MyContext);
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${api_key}&part=snippet&type=video&q=${
    myGlobalObj.searchTerm
  }&maxResults=${15}`;
  function findResultsOnSearch() {
    return new Promise((resolve, reject) => {
      axios
        .get(searchUrl)
        .then((response) => {
          console.log(response);
          resolve(response.data.items);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  function findDataOnVideoIds(data) {
    const newArrForIds = [];
    data.forEach((obj) => {
      newArrForIds.push(obj.id.videoId);
    });
    console.log(newArrForIds);
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${api_key}&part=snippet,statistics,contentDetails&id=${newArrForIds.toString()}`;

    return new Promise((resolve, reject) => {
      axios
        .get(videoDetailsUrl)
        .then((response) => {
          console.log(response);
          resolve(response.data.items);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  }

  useEffect(() => {
    async function handleAyncFunc() {
      const data = await findResultsOnSearch();
      const dataOnVideosIds = await findDataOnVideoIds(data);
      const searchDataWithLogo = await myGlobalObj.fetchLogosOfChannels(
        dataOnVideosIds
      );
      localStorage.setItem(
        "searchFinalData",
        JSON.stringify(searchDataWithLogo)
      );
      console.log(searchDataWithLogo);
      setData(searchDataWithLogo);
    }

    if (localStorage.getItem("searchFinalData")) {
      console.log("localWorkingfor searchresult");

      setData(JSON.parse(localStorage.getItem("searchFinalData")));
    } else {
      handleAyncFunc();
    }
  }, []);
  localStorage.setItem("globalobj", JSON.stringify(myGlobalObj));
  // console.log(Data);

  return (
    <div className="category-data">
      {Data.map((obj) => {
        return (
          <div
            key={obj.id}
            className="one-video-cate"
            onClick={() => {
              myGlobalObj.playingVideo = obj;
              myGlobalObj.relaventData = Data;
              navigator("/VideoPlay");
            }}
          >
            <div className="imgsearch">
              <img src={obj.snippet.thumbnails.high.url} alt="" />
              <strong id="durations">
                {myGlobalObj.parseISO8601Duration(obj.contentDetails.duration)}
              </strong>
            </div>

            <div className="right-ofSearchData">
              <h5>{obj.snippet.title}</h5>
              <div className="viewMonth">
                <strong>
                  {myGlobalObj.calculateViewCounts(obj.statistics.viewCount)}.
                </strong>
                <strong>
                  {myGlobalObj.calculateTime(obj.snippet.publishedAt)} ago
                </strong>
              </div>
              <div className="channelLogo">
                <div className="logochannel">
                  <img
                    src={
                      !obj.urllogo
                        ? "data:image/png;base64,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"
                        : obj.urllogo
                    }
                    alt=""
                  />
                </div>
                <strong>{obj.snippet.channelTitle}</strong>
              </div>
              <p className="descriptions">
                {obj.snippet.description.slice(0, 60).replaceAll("#", " ")}...
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SearchDataOnQuery;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";

const SearchDataOnQuery = () => {
  const navigator = useNavigate();
  const [Data, setData] = useState([]);
  const api_key = process.env.REACT_APP_API_KEY;
  const useContextData = useMyContextFuncs();

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${api_key}
  &part=snippet&type=video&q=${useContextData.searchTerm}&maxResults=${15}`;

  function findResultsOnSearch() {
    return new Promise((resolve, reject) => {
      axios
        .get(searchUrl)
        .then((response) => {
          if (response.status == 200) {
            resolve([...response.data.items]); //did not
            console.log(response.data.items);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  function findDataOnVideoIdsToviewsAndLike(data) {
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
          console.log(response.data.items);
          resolve(response.data.items);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  }

  async function handleAyncFunc() {
    const data = await findResultsOnSearch(); //gets videos ids and other

    const dataOnVideosIds = await findDataOnVideoIdsToviewsAndLike(data);
    //to get viewcount/likecount/duration (contentdetails/statistics)
    const searchDataWithLogo = await useContextData.fetchLogosOfChannels(
      dataOnVideosIds
    );

    localStorage.setItem("searchFinalData", JSON.stringify(searchDataWithLogo));
    setData(searchDataWithLogo);
  }
  // -----------------------------------------------------------------

  useEffect(() => {
    if (localStorage.getItem("searchFinalData")) {
      console.log("localWorkingfor searchresult");
      setData(JSON.parse(localStorage.getItem("searchFinalData")));
    } else {
      handleAyncFunc();
    }
  }, []);
  // -----------------------------------------------------------------

  return (
    <div className="category-data">
      {Data.map((obj) => {
        return (
          <div
            key={obj.id}
            className="video-box-here"
            onClick={() => {
              useContextData.setPlayingVideo(obj);
              useContextData.setRelaventData(Data);
              navigator("/VideoPlay");
            }}
          >
            <div className="img-inner-side">
              <img src={obj.snippet.thumbnails.high.url} alt="" />
              <strong className="durationsOnSearch">
                {useContextData.parseISO8601Duration(
                  obj.contentDetails.duration
                )}
              </strong>
            </div>

            <div className="right-ofSearchDataOne">
              <h5>{obj.snippet.title}</h5>
              <div className="viewMonth">
                <strong>
                  {useContextData.calculateViewCounts(obj.statistics.viewCount)}
                  .
                </strong>
                <strong>
                  {useContextData.calculateTime(obj.snippet.publishedAt)} ago
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

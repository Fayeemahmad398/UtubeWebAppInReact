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
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJaQ6dxqPCDW3iP7iLU1-zeESsjNGopFwRfQ&usqp=CAU"
                        : obj.urllogo
                    }
                    alt=""
                  />
                </div>
                <strong className="channel-name-">{obj.snippet.channelTitle}</strong>
              </div>
              <p className="descriptions">
                {obj.snippet.description.slice(0, 100).replaceAll("#", " ")}...
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SearchDataOnQuery;

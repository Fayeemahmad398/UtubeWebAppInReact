import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";
import { toast } from "react-toastify";

const SearchDataOnQuery = () => {
  const { searchVal } = useParams();

  console.log(searchVal);
  const navigator = useNavigate();
  const [Data, setData] = useState([]);
  const api_key = process.env.REACT_APP_API_KEY;
  const {
    setPlayingVideo,
    setRelaventData,
    parseISO8601Duration,
    calculateTime,
    calculateViewCounts,
    fetchLogosOfChannels
  } = useMyContextFuncs();
  // End points with base url
  const searchUrl = `https://www.googleapis.com/youtube/v3/search`;
  const videoUrl = `https://www.googleapis.com/youtube/v3/videos`;

  // params of different endpoints

  let searchParams = {
    key: `${api_key}`,
    q: `${searchVal}`,
    part: "snippet",
    type: "video",
    maxResults: "15",
  };

  let videosParams = {
    key: `${api_key}`,
    part: "snippet,statistics,contentDetails",
  };

  // -------------------------------------------
  // Fetching info with search end point
  function findResultsOnSearch() {
    return new Promise((resolve, reject) => {
      axios
        .get(searchUrl, { params: searchParams })
        .then((response) => {
          if (response.status == 200) {
            resolve([...response.data.items]);
            console.log(response.data.items);
          } else {
            reject({ code: response.status });
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  // fetching info with video end point
  function findDataOnVideoIdsToviewsAndLike(data) {
    const newArrForIds = [];
    data.forEach((obj) => {
      newArrForIds.push(obj.id.videoId);
    });

    videosParams.id = newArrForIds.toString();

    return new Promise((resolve, reject) => {
      axios
        .get(videoUrl, { params: videosParams })
        .then((response) => {
          if (response.status == 200) {
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

  async function handleAyncFunc() {
    try {
      const data = await findResultsOnSearch();
      const dataOnVideosIds = await findDataOnVideoIdsToviewsAndLike(data);
      //to get viewcount/likecount/duration (contentdetails/statistics)
      const searchDataWithLogo = await fetchLogosOfChannels(dataOnVideosIds);

      setData(searchDataWithLogo);
    } catch (error) {
      toast.error(`Unexpected  Error is: ${error.code}`, {
        style: {
          color: "red",
        },
      });

      console.log(error.code);
    }
  }

  useEffect(() => {
    handleAyncFunc();
  }, [searchVal]);

  return (
    <div className="category-data">
      {Data.map((obj) => {
        return (
          <div
            key={obj.id}
            className="video-box-here"
            onClick={() => {
              setPlayingVideo(obj);
              setRelaventData(Data);
              navigator("/VideoPlay");
            }}
          >
            <div className="img-inner-side">
              <img src={obj.snippet.thumbnails.high.url} alt="" />
              <strong className="durationsOnSearch">
                {parseISO8601Duration(obj.contentDetails.duration)}
              </strong>
            </div>

            <div className="right-ofSearchDataOne">
              <h5>{obj.snippet.title}</h5>
              <div className="viewMonth">
                <strong>
                  {calculateViewCounts(obj.statistics.viewCount)}.
                </strong>
                <strong>{calculateTime(obj.snippet.publishedAt)} ago</strong>
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
                <strong className="channel-name-">
                  {obj.snippet.channelTitle}
                </strong>
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

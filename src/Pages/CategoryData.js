import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";
import { toast } from "react-toastify";

const CategoryData = () => {
  const [data, setData] = useState([]);
  const {
    setPlayingVideo,
    parseISO8601Duration,
    calculateTime,
    setRelaventData,
    calculateViewCounts,
    fetchLogosOfChannels,
  } = useMyContextFuncs();
  const navigator = useNavigate();
  const { categoryId } = useParams();

  const api_key = process.env.REACT_APP_API_KEY;
  const apiUrlForCategory = `https://www.googleapis.com/youtube/v3/search`;

  let queryParams = {
    key: `${api_key}`,
    part: "snippet",
    type: "video",
    videoCategoryId: `${categoryId}`,
    maxResults: `15`,
  };

  function fetchVideosTogetViewsAndcontentDetails(dataToUpadate) {
    const newArrForIds = [];
    for (let i = 0; i < dataToUpadate.length; i++) {
      newArrForIds.push(dataToUpadate[i].id.videoId);
    }

    let videosParams = {
      key: api_key,
      part: "snippet,statistics,contentDetails",
      id: `${newArrForIds.toString()}`,
    };

    const apiTovideos = `https://www.googleapis.com/youtube/v3/videos`;

    return new Promise((resolve, reject) => {
      axios
        .get(apiTovideos, { params: videosParams })
        .then((response) => {
          if (response.status == 200) {
            for (let i = 0; i < dataToUpadate.length; i++) {
              dataToUpadate[i].statistics = response.data.items[i].statistics;
              dataToUpadate[i].contentDetails =
                response.data.items[i].contentDetails;
            }

            resolve(dataToUpadate);
          } else {
            reject({ code: response.status });
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  }

  function fetchDataAccToCategory() {
    return new Promise((resolve, reject) => {
      axios
        .get(apiUrlForCategory, { params: queryParams })
        .then((response) => {
          if (response.status == 200) {
            resolve(response.data.items);
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
  async function handlepromise() {
    try {
      const data = await fetchDataAccToCategory();
      const updatedData = await fetchLogosOfChannels(data);
      const newData = await fetchVideosTogetViewsAndcontentDetails(updatedData);
      setData(newData);
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
    handlepromise();
  }, [categoryId]);

  return (
    <div id="mainT">
      {data.length > 0 &&
        data.map((obj) => {
          return (
            <div
              key={obj.id}
              className="onevideobox"
              onClick={() => {
                setPlayingVideo(obj);
                setRelaventData(data);
                navigator(`/VideoPlay`);
              }}
            >
              <div style={{ position: "relative" }}>
                <img src={obj.snippet.thumbnails.high.url} className="imges" />
                <div className="duration-class">
                  <p id="durP">
                    {console.log(
                      parseISO8601Duration(obj.contentDetails.duration)
                    )}
                    {parseISO8601Duration(obj.contentDetails.duration)}
                  </p>
                </div>
              </div>

              <div className="homelogotitle">
                <div className="channelimglogo">
                  <img
                    className="channel-logo"
                    src={
                      obj.urllogo
                        ? obj.urllogo
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJaQ6dxqPCDW3iP7iLU1-zeESsjNGopFwRfQ&usqp=CAU"
                    }
                    alt=""
                  />
                  <h5 className="title-of-video">
                    {obj.snippet.title.slice(0, 60)}.....
                  </h5>
                </div>
                <div className="channelNameOnHome">
                  <p className="channelsName">{obj.snippet.channelTitle}</p>
                </div>
              </div>
              <div id="flexDiv">
                <p>{calculateViewCounts(obj.statistics.viewCount)} .</p>
                <p>{calculateTime(obj.snippet.publishedAt) + " "} ago</p>
              </div>
            </div>
          );
        })}
      <h1>{}</h1>
    </div>
  );
};
export default CategoryData;

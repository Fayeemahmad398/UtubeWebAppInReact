import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";

const CategoryData = () => {
  const [data, setData] = useState([]);
  const useContextData = useMyContextFuncs();
  const navigator = useNavigate();
  const api_key = process.env.REACT_APP_API_KEY;
  const apiUrlForCategory = `https://www.googleapis.com/youtube/v3/search?key=${api_key}&part=snippet&type=video&videoCategoryId=${useContextData.categoryId}&maxResults=15`;
  console.log(useContextData);

  function fetchVideosTogetViewsAndcontentDetails(dataToUpadate) {
    const newArrForIds = [];
    for (let i = 0; i < dataToUpadate.length; i++) {
      newArrForIds.push(dataToUpadate[i].id.videoId);
    }
    const apiTOviewCount = `https://www.googleapis.com/youtube/v3/videos?key=${api_key}&part=snippet,statistics,contentDetails&id=${newArrForIds.toString()}`;
    return new Promise((resolve, reject) => {
      axios
        .get(apiTOviewCount)
        .then((response) => {
          localStorage.setItem(
            "viewcountArr",
            JSON.stringify(response.data.items)
          );

          for (let i = 0; i < dataToUpadate.length; i++) {
            dataToUpadate[i].statistics = response.data.items[i].statistics;
            dataToUpadate[i].contentDetails =
              response.data.items[i].contentDetails;
          }
          localStorage.setItem(
            "categoryDataFinal",
            JSON.stringify(dataToUpadate)
          );
          resolve(dataToUpadate);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  }

  function fetchDataAccToCategory() {
    console.log(useContextData);
    return new Promise((resolve, reject) => {
      axios
        .get(apiUrlForCategory)
        .then((response) => {
          localStorage.setItem(
            "dataForCategoryWithoutLogo",
            JSON.stringify(response.data.items)
          );
          resolve(response.data.items);
          console.log(response.data.items);
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
      const updatedData = await useContextData.fetchLogosOfChannels(data);
      const newData = await fetchVideosTogetViewsAndcontentDetails(updatedData);
      setData(newData);

      localStorage.setItem(
        "DataOncategoryAfterLogoandVies",
        JSON.stringify(newData)
      );
    } catch (error) {
      console.log(error);
    }
  }
  // --------------------------------------------------
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("DataOncategoryAfterLogoandVies"))) {
      setData(
        JSON.parse(localStorage.getItem("DataOncategoryAfterLogoandVies"))
      );
      console.log("local storage working in categorydata fianl");
    } else {
      console.log(useContextData);
      handlepromise();
    }
  }, [useContextData.categoryId]);

  // ---------------------------------------------------------
  console.log(data);
  return (
    <div id="mainT">
      {data.length > 0 &&
        data.map((obj) => {
          return (
            <div
              key={obj.id}
              className="onevideobox"
              onClick={() => {
                useContextData.setPlayingVideo(obj);
                useContextData.setRelaventData(data);

                navigator(`/VideoPlay`);
              }}
            >
              <div style={{ position: "relative" }}>
                <img src={obj.snippet.thumbnails.high.url} className="imges" />
                <div className="duration-class">
                  <p id="durP">
                    {console.log(
                      useContextData.parseISO8601Duration(
                        obj.contentDetails.duration
                      )
                    )}
                    {useContextData.parseISO8601Duration(
                      obj.contentDetails.duration
                    )}
                  </p>
                </div>
              </div>

              <div className="homelogotitle">
                <div className="channelimglogo">
                    <img className="channel-logo" src={obj.urllogo ?obj.urllogo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJaQ6dxqPCDW3iP7iLU1-zeESsjNGopFwRfQ&usqp=CAU"} alt="" />
                  <h5 className="title-of-video">
                    {obj.snippet.title.slice(0, 60)}.....
                  </h5>
                </div>
                <div className="channelNameOnHome">
                  <p className="channelsName">{obj.snippet.channelTitle}</p>
                </div>
              </div>
              <div id="flexDiv">
                <p>
                  {useContextData.calculateViewCounts(obj.statistics.viewCount)}{" "}
                  .
                </p>
                <p>
                  {useContextData.calculateTime(obj.snippet.publishedAt) + " "}{" "}
                  ago
                </p>
              </div>
            </div>
          );
        })}
      <h1>{}</h1>
    </div>
  );
};
export default CategoryData;

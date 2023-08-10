import axios from "axios";
import MyContext from "./GlobalContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
const CategoryData = () => {
  const [data, setData] = useState([]);
  const myGlobalObj = useContext(MyContext);
  const navigator = useNavigate();
  // console.log(myGlobalObj);

  const api_key = process.env.REACT_APP_UTUBEKEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${api_key}&part=snippet&type=video&videoCategoryId=${myGlobalObj.categoryId}&maxResults=15`;
  function fetchLogos(updateData) {
    return new Promise((resolve, reject) => {
      const collOfIds = [];

      for (let i = 0; i < updateData.length; i++) {
        collOfIds.push(updateData[i].snippet.channelId);
      }
      // console.log(collOfIds);

      axios
        .get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${collOfIds.toString()}&key=${api_key}`
        )
        .then((response) => {
          console.log(response.data.items);
          for (let i = 0; i < response.data.items.length; i++) {
            updateData[i].channelLogo =
              response.data.items[i].snippet.thumbnails.default.url;
          }

          // localStorage.setItem(
          //   "updatedDataForCategory",
          //   JSON.stringify(updateData)
          // );
          // fetchVideosTogetViewsAndcontentDetails(updateData);
          // setData(updateData);
          resolve(updateData);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
  function fetchVideosTogetViewsAndcontentDetails(dataToUpadate) {
    // console.log(dataToUpadate);
    const newArrForIds = [];
    for (let i = 0; i < dataToUpadate.length; i++) {
      newArrForIds.push(dataToUpadate[i].id.videoId);
    }
    const apiTOviewCount = `https://www.googleapis.com/youtube/v3/videos?key=${api_key}&part=snippet,statistics,contentDetails&id=${newArrForIds.toString()}`;
    // console.log(newArrForIds);

    return new Promise((resolve, reject) => {
      axios
        .get(apiTOviewCount)
        .then((response) => {
          // console.log(response);
          localStorage.setItem(
            "viewcountArr",
            JSON.stringify(response.data.items)
          );

          for (let i = 0; i < dataToUpadate.length; i++) {
            dataToUpadate[i].statistics = response.data.items[i].statistics;
            dataToUpadate[i].contentDetails =
              response.data.items[i].contentDetails;
          }
          // setData([...dataToUpadate]);
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
    return new Promise((resolve, reject) => {
      axios
        .get(apiUrl)
        .then((response) => {
          localStorage.setItem(
            "dataForCategoryWithoutLogo",
            JSON.stringify(response.data.items)
          );
          resolve(response.data.items);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("DataOncategoryAfterLogoandVies"))) {
      setData(
        JSON.parse(localStorage.getItem("DataOncategoryAfterLogoandVies"))
      );
      console.log("local storage working in categorydata fianl");
    } else {
      async function handlepromise() {
        const data = await fetchDataAccToCategory();
        console.log(data);
        const updatedData = await myGlobalObj.fetchLogosOfChannels(data);
        const newData = await fetchVideosTogetViewsAndcontentDetails(
          updatedData
        );

        localStorage.setItem(
          "DataOncategoryAfterLogoandVies",
          JSON.stringify(newData)
        );
        console.log(newData);
        setData(newData);
      }
      handlepromise();
    }
  }, [myGlobalObj.categoryId]);

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
                myGlobalObj.playingVideo = obj;
                myGlobalObj.relaventData = data;

                navigator(`/VideoPlay`);
              }}
            >
              <div>
                <img src={obj.snippet.thumbnails.high.url} className="imges" />
              </div>
              <div id="duration">
                <p id="durP">
                  {obj.contentDetails &&
                    myGlobalObj.parseISO8601Duration(
                      obj.contentDetails.duration
                    )}
                </p>
              </div>
              <div className="homelogotitle">
                <div className="channelimglogo">
                  <img className="channel-logo" src={obj.urllogo} alt="" />
                  <h5>{obj.snippet.title.slice(0, 60)}.....</h5>
                </div>
                <div className="channelNameOnHome">
                  <p className="channelsName">{obj.snippet.channelTitle}</p>
                </div>
              </div>
              <div id="flexDiv">
                <p>
                  {myGlobalObj.calculateViewCounts(obj.statistics.viewCount)} .
                </p>
                <p>
                  {myGlobalObj.calculateTime(obj.snippet.publishedAt) + " "} ago
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

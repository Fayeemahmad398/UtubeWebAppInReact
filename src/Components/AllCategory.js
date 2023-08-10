import axios from "axios";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import MyContext from "./GlobalContext";
import { useContext } from "react";
const AllCategory = () => {
  const api_key = process.env.REACT_APP_UTUBEKEY;
  const [AllCategories, setCategory] = useState([]);
  const [SlicedArray, setSlicedArr] = useState([]);
  const [indexes, setIndex] = useState({ start: 0, end: 5 });

  const navigator = useNavigate();

  const myGlobalObj = useContext(MyContext);

  // console.log(myGlobalObj);

  useEffect(() => {
    function callToApiForCategory() {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `https://www.googleapis.com/youtube/v3/videoCategories?key=${api_key}&part=snippet&regionCode=IN`
          )
          .then((response) => {
            if (response.status === 200) {
              // console.log(response.data.items);
              return resolve(response.data.items);
            }
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
      });
    }

    async function handlePromise() {
      const data = await callToApiForCategory();
      localStorage.setItem("foundCategory", JSON.stringify(data));

      setCategory(data);
    }

    if (JSON.parse(localStorage.getItem("foundCategory"))) {
      setCategory(JSON.parse(localStorage.getItem("foundCategory")));

      console.log("working local for category all");
    } else {
      handlePromise();
    }
  }, []);

  function slicedArray() {
    return AllCategories.filter((obj, index) => {
      if (index >= indexes.start && index <= indexes.end) {
        return obj;
      }
    });
  }

  useEffect(() => {
    if (AllCategories.length > 0) {
      const SlicedArray = slicedArray();
      setSlicedArr(SlicedArray);
    }
  }, [AllCategories, indexes.start]);

  return (
    <div className="categories">
      <button
        disabled={indexes.start == 0 ? true : false}
        className="btnsarrow left"
        onClick={() => {
          if (indexes.start > 0) {
            setIndex({
              ...indexes,
              start: indexes.start - 1,
              end: indexes.end - 1,
            });
          }
        }}
      >
        <FaAngleLeft className="arrows" />
      </button>
      {SlicedArray.map((obj) => {
        return (
          <div
            className="oneCategory"
            onClick={() => {
              // console.log(obj.id)
              myGlobalObj.categoryId = obj.id;
              navigator("/CategoryData");
            }}
          >
            <strong>{obj.snippet.title}</strong>
          </div>
        );
      })}

      <button
        disabled={indexes.end == 30 ? true : false}
        className="btnsarrow right"
        onClick={() => {
          if (indexes.end < 30) {
            console.log("clicked on right");
            setIndex({
              ...indexes,
              end: indexes.end + 1,
              start: indexes.start + 1,
            });
            console.log(indexes.start, indexes.end);
          }
        }}
      >
        <FaAngleRight className="arrows" />
      </button>
    </div>
  );
};
export default AllCategory;

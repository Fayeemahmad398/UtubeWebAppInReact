import axios from "axios";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";
import "../style/allCategory.css";

const AllCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const api_key = process.env.REACT_APP_API_KEY;
  const useContextData = useMyContextFuncs();
  const [slideValue, setSlideValue] = useState(0);

  const navigator = useNavigate();

  function callToApiForCategory() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videoCategories?key=${api_key}&part=snippet&regionCode=IN`
        )
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.items);
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

    setAllCategories(data);
  }

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("foundCategory"))) {
      setAllCategories(JSON.parse(localStorage.getItem("foundCategory")));

      console.log("working local for category all");
    } else {
      handlePromise();
    }
  }, []);

  function handleLeft() {
    setSlideValue((prev) => {
      return prev - 1;
    });
  }
  function handleRight() {
    setSlideValue((prev) => {
      return prev + 1;
    });
  }

  console.log(slideValue);
  return (
    <div className="categories">
      <button
        className="btnsarrow left"
        onClick={handleLeft}
        disabled={slideValue == 0}
      >
        <FaAngleLeft className="arrows" />
      </button>
      {allCategories.map((obj, index) => {
        return (
          <div
            className={`oneCategory`}
            style={{ transform: `translateX(-${slideValue}00%)` }}
            onClick={() => {
              useContextData.categoryId = obj.id;
              navigator("/CategoryData");
            }}
          >
            <strong style={{ width: "120px", textAlign: "center" }}>
              {obj.snippet.title}
            </strong>
          </div>
        );
      })}

      <button
        className="btnsarrow right"
        onClick={handleRight}
        disabled={slideValue == 37}
      >
        <FaAngleRight className="arrows" />
      </button>
    </div>
  );
};
export default AllCategory;

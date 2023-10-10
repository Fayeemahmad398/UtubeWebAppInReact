import axios from "axios";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";
import "../style/allCategory.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            return resolve(response.data.items);
          } else {
            reject({ code: response.status });
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  async function handlePromise() {
    try {
      const data = await callToApiForCategory();

      setAllCategories(data);

      useContextData.setProgress(() => 100);
    } catch (error) {
      useContextData.setProgress(() => 100);

      toast.error(
        `Unexpected  Error is:${
          error?.response?.data?.error?.errors[0]?.reason ?? error.message
        }`,
        {
          style: {
            color: "red",
          },
        }
      );
    }
  }

  useEffect(() => {
    handlePromise();
    useContextData.setProgress((prev) => prev + 20);
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
              navigator(`/CategoryData/${obj.id}`);
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
        disabled={slideValue == allCategories.length}
      >
        <FaAngleRight className="arrows" />
      </button>
    </div>
  );
};
export default AllCategory;

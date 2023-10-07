import Navbar from "./Components/Navabar";
import CategoryData from "./Components/CategoryData";
import "./Components/style.css";




import Home from "./Components/Home";
import { Routes, Route } from "react-router";
import VideoPlay from "./Components/VideoPlay";
import "./Components/videoPage.css";
import MyContext from "./Components/GlobalContext";
import AllCategory from "./Components/AllCategory";
import "./Components/CategoryData.css";
import {
  calculateViewCounts,
  parseISO8601Duration,
  CalculateLikeAndComment,
  calculateTime,
} from "./Components/Home";
import SearchDataOnQuery from "./Components/SearchDataOnQuery";
import { useContext } from "react";

const App = () => {
  return (
    <div>
      <MyContext.Provider
        value={{
          calculateViewCounts: calculateViewCounts,
          calculateTime: calculateTime,
          parseISO8601Duration: parseISO8601Duration,
          calculateTime: calculateTime,
          calculateViewCounts: calculateViewCounts,
          CalculateLikeAndComment: CalculateLikeAndComment,
        }}
      >
        <Navbar />
        <AllCategory />
        <Routes>
          <Route path="/categoryData" element={<CategoryData />} />

          <Route path="/" element={<Home />} />
          <Route path={`/VideoPlay`} element={<VideoPlay />} />

          <Route path={"/SearchDataOnQuery"} element={<SearchDataOnQuery />} />
        </Routes>
      </MyContext.Provider>
    </div>
  );
};
export default App;

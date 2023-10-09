import Navbar from "./Components/Navabar";
import CategoryData from "./Pages/CategoryData";
import "./style/home.css";
import "./style/searchDataOnQuery.css";

import Home from "./Pages/Home";
import { Routes, Route } from "react-router";
import VideoPlay from "./Pages/VideoPlay";
import "./style/videoPlay.css";
import AllCategory from "./Components/AllCategory";
import "./style/CategoryData.css";
import SearchDataOnQuery from "./Pages/SearchDataOnQuery";

const App = () => {
  return (
    <div>
      <Navbar />
      <AllCategory />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoryData" element={<CategoryData />} />
        <Route path={`/VideoPlay`} element={<VideoPlay />} />
        <Route path={"/SearchDataOnQuery"} element={<SearchDataOnQuery />} />
      </Routes>
    </div>
  );
};
export default App;

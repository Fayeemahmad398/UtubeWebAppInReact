import "./style/home.css";
import "./style/searchDataOnQuery.css";
import "./style/CategoryData.css";
import "./style/videoPlay.css";
import { ToastContainer } from "react-toastify";
import CategoryData from "./Pages/CategoryData";
import Navbar from "./Components/Navabar";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router";
import VideoPlay from "./Pages/VideoPlay";
import AllCategory from "./Components/AllCategory";
import SearchDataOnQuery from "./Pages/SearchDataOnQuery";

const App = () => {
  return (
    <div>
      <Navbar />
      <ToastContainer />
      <AllCategory />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoryData/:categoryId" element={<CategoryData />} />
        <Route path={`/VideoPlay`} element={<VideoPlay />} />
        <Route
          path={"/SearchDataOnQuery/:searchVal"}
          element={<SearchDataOnQuery />}
        />
      </Routes>
    </div>
  );
};
export default App;

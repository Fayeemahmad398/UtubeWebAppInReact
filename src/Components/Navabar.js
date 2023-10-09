import { FaMicrophone, FaSearch, FaToggleOn } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useMyContextFuncs } from "../myContext/MyContext";
import "../style/navbar.css";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const Navbar = () => {
  const navigator = useNavigate();

  const useContextData = useMyContextFuncs();

  function handleKeysDown(event) {
    console.log(useContextData);
    if (event.key == "Enter") {
      navigator("/SearchDataOnQuery");
    }
  }

  return (
    <div>
      <div id="navbar">
        <div id="navbar-left">
          <div id="utubelogo">
            <img
              src="https://logodownload.org/wp-content/uploads/2014/10/youtube-logo-9.png"
              alt=""
            />
          </div>
          <p>IN</p>
        </div>

        <div id="navbar-mid">
          <input
            type="text"
            value={useContextData.searchTerm}
            placeholder="Search"
            id="search"
            onChange={(event) => {
              useContextData.setSearchTerm(event.target.value);
            }}
            onKeyDown={(event) => {
              handleKeysDown(event);
            }}
          />
          <button
            id="find"
            onClick={() => {
              navigator("/SearchDataOnQuery");
            }}
          >
            <FaSearch />
          </button>
          <span id="mic">
            <FaMicrophone />
          </span>
        </div>

        <div id="navbar-right">
          <div className="cameraimg">
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.taACaGo1_28G9E-UqijqSgHaEo&pid=Api&P=0"
              alt=""
            />
          </div>
          <div className="notify-icon">
            <NotificationsNoneIcon />
          </div>
          <div
            style={{
              height: "35px",
              width: "35px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "black",
              borderRadius:"100%"
            }}
          >
            <h4 id="alpha">F</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

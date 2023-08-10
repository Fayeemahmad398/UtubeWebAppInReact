import { useState } from "react";
import { FaMicrophone, FaSearch, FaToggleOn } from "react-icons/fa";
import { useContext } from "react";
import MyContext from "./GlobalContext";
import { useNavigate } from "react-router";
const Navbar = () => {
  const [search, setSearch] = useState("");
  const myGlobalObj = useContext(MyContext);
  const api_key = process.env.REACT_APP_UTUBEKEY;
  const navigator = useNavigate();
  console.log(myGlobalObj);

  function handleKeysDown(event) {
    console.log(event.key);
    if (event.key == "Enter") {
      navigator("/SearchDataOnQuery");
    }
  }

  return (
    <div>
      <div id="navbar">
        <div id="navbar-left">
          <div id="drawer">
            <FaToggleOn className="togglelight" />
          </div>
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
            value={search}
            placeholder="Search"
            id="search"
            onChange={(event) => {
              setSearch(event.target.value);
              myGlobalObj.searchTerm = event.target.value;
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
          <span className="cameraimg">
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.taACaGo1_28G9E-UqijqSgHaEo&pid=Api&P=0"
              alt=""
            />
          </span>
          <span>
            <i class="fa-regular fa-bell"></i>
          </span>
          <span>
            <h4 id="alpha">F</h4>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { Context } from "../App";

// Media
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";

const Homepage = () => {
  const navigate = useNavigate();
  const [showmenu, setShowmenu] = useState(false);
  const { userid } = useParams();
  const user_id = useContext(Context);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (userid != user_id) {
      localStorage.removeItem("user_id");
      navigate("/");
    }
  }, []);

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden ">
        <header className="flex w-[100vw] bg-blue-300 py-3">
          <div className="flex w-full justify-between items-center">
            <div></div>
            {showmenu ? (
              <div className="flex absolute top-0 left-0">
                <Menu />
                <div
                  className="text-3xl"
                  onClick={() => {
                    setShowmenu(!showmenu);
                  }}
                >
                  <RiCloseLargeFill />
                </div>
              </div>
            ) : (
              <div
                className="text-3xl absolute"
                onClick={() => {
                  setShowmenu(!showmenu);
                }}
              >
                <RxHamburgerMenu />
              </div>
            )}

            <div>
              <h1>Book Store</h1>
            </div>
            <div className="p-2 flex items-center gap-2">
              <div
                onClick={() => {
                  navigate(`/cart/${user_id}`);
                }}
              >
                <FaCartShopping />
              </div>
              <div className="text-red-700">5</div>
            </div>
          </div>
        </header>
        <div>
          <input
            type="text"
            placeholder="Search For Book"
            className="py-1 px-3 border-1 rounded-sm"
          />
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block">
        <header className="flex w-[100vw] bg-blue-300 py-3">
          <div className="flex w-full justify-between">
            {showmenu ? (
              <div className="flex absolute">
                <Menu />
                <div
                  className="text-3xl"
                  onClick={() => {
                    setShowmenu(!showmenu);
                  }}
                >
                  <RiCloseLargeFill />
                </div>
              </div>
            ) : (
              <div
                className="text-3xl absolute"
                onClick={() => {
                  setShowmenu(!showmenu);
                }}
              >
                <RxHamburgerMenu />
              </div>
            )}
            <div className="ml-20">
              <input
                type="text"
                placeholder="Search For Book"
                className="py-1 px-3 border-1 rounded-sm"
              />
            </div>
            <div>
              <h1>Book Store</h1>
            </div>
            <div className="p-2 flex items-center gap-2">
              <FaCartShopping />
              <div className="text-red-700">5</div>
            </div>
          </div>
        </header>
        <h1>Homepage</h1>
      </div>
    </>
  );
};

export default Homepage;

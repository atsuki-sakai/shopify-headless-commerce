import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Marquee } from "@components/ui";
import { useUI, useScrollY, useCustomerState } from "@components/context";
import style from "./Header.module.css";
import cn from "classnames";
import { Cart, Menu, Person, Search } from "@components/icon";

const Header = () => {
  const { onDrawerOpen, onCartOpen } = useUI();
  const { loggedCustomer } = useCustomerState();
  const scrollY = useScrollY();
  const changeBgColorY = 800;
  const [changeBgolor, setChangeBgColor] = useState(false);
  const [searchText, setSearchText] = useState("");

  const headerClassName = cn(style.wrapper, {
    [style.hide]: !changeBgolor,
    [style.show]: changeBgolor,
  });

  const switchBgColor = (y: number) => {
    if (y >= changeBgColorY) {
      setChangeBgColor(true);
    } else {
      setChangeBgColor(false);
    }
  };

  useEffect(() => {
    switchBgColor(scrollY);
  }, [scrollY]);

  return (
    <header className={style.root}>
      <div className={headerClassName}>
        {/* MARQUEE */}
        <div className="bg-green-800">
          <Marquee>
            <div className={style.marquee}>
              <p>丹波篠山の特産品を買うならまぼろし屋！</p>
              <p>8000円以上お買い上げで送料無料</p>
            </div>
          </Marquee>
        </div>
        {/* MOBIEL HEADER */}
        <div className={style.mobile_container}>
          <div className={style.mobile_menu}>
            <button onClick={onDrawerOpen}>
              <Menu className="h-10 w-10" />
            </button>
            <button className="invisible">
              <Menu />
            </button>
          </div>
          <div className="">
            <Link href={"/"} passHref>
              <a>
                <h1 className="text-lg font-bold">丹波篠山物産</h1>
                <p className="text-[10px] scale-75 -translate-y-1 -translate-x-3">
                  丹波篠山の食料品卸の店
                </p>
              </a>
            </Link>
          </div>
          <div className={style.mobile_menu}>
            {
              <div className="relative">
                <div
                  className={`absolute -top-1 -left-2 h-2 w-2 ${
                    loggedCustomer ? "bg-green-500" : ""
                  } rounded-full`}
                ></div>
                <Link
                  href={
                    loggedCustomer ? "/customer/my-page" : "/customer/login"
                  }
                  passHref
                >
                  <a>
                    <Person className={`h-8 w-8`} />
                  </a>
                </Link>
              </div>
            }
            <button onClick={onCartOpen}>
              <Cart className="h-8 w-8" />
            </button>
          </div>
        </div>
        {/* DESKTOP HEADER */}
        <div className={style.desktop_container}>
          <div className="bg-white tracking-[1px]">
            <div className={style.desktop_menu_wrapper}>
              <div className="md:translate-y-7">
                <Link href={"/"} passHref>
                  <a>
                    <h1 className="text-lg  text-left">丹波篠山物産</h1>
                    <p className="text-xs scale-75 md:scale-80 -translate-x-5 -translate-y-1 text-left pl-1">
                      丹波篠山の食料品卸の店
                    </p>
                  </a>
                </Link>
              </div>
              <div className={style.desktop_menu}>
                <button>商品一覧</button>
                <button onClick={onCartOpen}>料理レシピ</button>
                <button onClick={onCartOpen}>まぼろし屋について</button>
                <button onClick={onDrawerOpen}>会員登録</button>
                <button onClick={onCartOpen}>お問い合わせ</button>
              </div>
            </div>
            <div className="pb-2 w-full shadow-md">
              <div className="flex items-center justify-end px-8">
                <div className="flex items-center space-x-3 mt-1 text-base text-gray-500 font-sans">
                  <p>商品検索</p>
                  <input
                    className=" ml-2 bg-gray-100 rounded-md focus:outline-none p-1"
                    type="text"
                  />
                  <Link
                    as={`/products/search/${searchText}`}
                    href={{
                      pathname: `/products/search/[text]`,
                      query: { titleOnly: false, text: searchText },
                    }}
                    passHref
                  >
                    <a>
                      <div className="w-8 h-8 bg-gray-600 ml-2 flex justify-center rounded-md items-center shadow-md">
                        <Search className="text-white h-6 w-6" />
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

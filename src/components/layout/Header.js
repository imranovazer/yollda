import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import NavbarButton from "../ui/icons/NavbarButton";
import { useTranslation } from "next-i18next";
import YolldaLogo from "../ui/icons/Yollda";
import RegisterBar from "./RegisterBar";
import CrossIcon from "../ui/icons/CrossIcon";
import UserIcon from "../ui/icons/UserIcon";
import { useAuth } from "../../contex/AuthContex";
import axiosInstance from "../../axios";
import { useRouter } from "next/router";
import useIsMobile from "../../hooks/useIsMobile";

const Header = ({
  logo,
  theme = "normal",
  onOpen,
  isBurgerOpen,
  closeBurgerModal,
  isFleetLayout,
}) => {
  const { t } = useTranslation("common");
  const { isAuth, userData, logOut } = useAuth();
  const router = useRouter();
  const [isUserLogoutMenuOpen, setIsUserLogoutMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const modalRef = useRef(null);
  const logoRef = useRef(null);
  const logoutRef = useRef(null);

  const [isTransparent, setIsTransparent] = useState(theme === "transparent");
  const [registerMethodsOpen, setRegisterMethodsOpen] = useState(false);

  const isMobile = useIsMobile();

  const toggleDropdown = () => {
    setIsUserLogoutMenuOpen((prevState) => !prevState);
  };

  const registerMethodsSwitch = () => {
    if (isBurgerOpen) closeBurgerModal();
    setRegisterMethodsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setIsUserLogoutMenuOpen(false);
      }
    };

    if (isUserLogoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserLogoutMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setRegisterMethodsOpen(false);
      }
    };

    if (registerMethodsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [registerMethodsOpen]);

  useEffect(() => {
    if (isBurgerOpen) {
      setRegisterMethodsOpen(false);
      setIsTransparent(false);
      logoRef.current.classList.add("fill-green-dark");
      logoRef.current.classList.remove("fill-white");
    } else if (
      !isBurgerOpen &&
      theme === "transparent" &&
      window.scrollY === 0
    ) {
      setIsTransparent(true);
      logoRef.current.classList.add("fill-white");
      logoRef.current.classList.remove("fill-green-dark");
    }
  }, [isBurgerOpen]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/v1/account/logout/");
      logOut();
      router.push("/signup");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 0) {
          headerRef.current.classList.add("shadow-md", "bg-white");
          if (theme === "transparent") {
            logoRef.current.classList.add("fill-green-dark");
            logoRef.current.classList.remove("fill-white");
            setIsTransparent(false);
          }
        } else {
          headerRef.current.classList.remove("shadow-md");
          if (theme === "transparent") {
            headerRef.current.classList.remove("bg-white");
          }

          if (theme === "transparent" && !isBurgerOpen) {
            logoRef.current.classList.add("fill-white");
            logoRef.current.classList.remove("fill-green-dark");
            setIsTransparent(true);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBurgerOpen]);

  return (
    <header
      ref={headerRef}
      className={`header w-full flex justify-center fixed top-0 left-0 z-30 transition-all duration-300 ${
        theme === "transparent" ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="flex justify-between items-center py-4">
          <Link href="/" passHref>
            <YolldaLogo
              ref={logoRef}
              className={`max-w-24 lg:max-w-32 cursor-pointer ${
                theme === "transparent" ? "fill-white" : "fill-green-dark"
              }`}
            />
          </Link>

          <div
            className={`flex items-center space-s-4 md:space-s-6 lg:space-s-8 ${
              isTransparent ? "text-white" : "text-black"
            }`}
          >
            <LanguageSwitcher />

            {!isFleetLayout ? (
              <>
                <div className="hidden md:flex items-center space-s-4 md:space-s-6 lg:space-s-8">
                  <Link href="/contact">
                    <h5 className="text-span-responsive font-bold">
                      {t("buttons.support")}
                    </h5>
                  </Link>

                  <div className="ms-4 relative">
                    <Button
                      text={t("navigation.join")}
                      onClick={registerMethodsSwitch}
                      classes={`${
                        isTransparent
                          ? "bg-white text-green-950 hover:bg-slate-400 "
                          : "bg-green-dark hover:green-secondary-dark text-white"
                      } whitespace-nowrap h-8 `}
                    />
                    {registerMethodsOpen && (
                      <div
                        ref={modalRef}
                        className="absolute top-16 right-0 rtl:right-auto rtl:left-0 z-50 w-[380px] transition-all duration-300"
                      >
                        <RegisterBar
                          individual={true}
                          handleClose={() => setRegisterMethodsOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onOpen}
                  className={isTransparent ? "text-white" : ""}
                >
                  {isBurgerOpen ? <CrossIcon /> : <NavbarButton />}
                </button>
              </>
            ) : isMobile ? (
              <button onClick={onOpen} className="fleet-sidebar-toggle">
                {isBurgerOpen ? <CrossIcon /> : <NavbarButton />}
              </button>
            ) : (
              isAuth && (
                <div ref={logoutRef} className="relative">
                  <button onClick={toggleDropdown}>
                    <UserIcon />
                  </button>
                  {isUserLogoutMenuOpen && (
                    <div className="absolute right-0 top-12 w-72 bg-white rounded-[15px] shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 truncate">
                              {userData?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150 group"
                        >
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

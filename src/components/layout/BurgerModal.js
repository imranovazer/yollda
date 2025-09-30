import Link from "next/link";
import { useTranslation } from "next-i18next";
import RegisterBar from "./RegisterBar";
import { useEffect, useState } from "react";
import ArrowDown from "../ui/icons/ArrowDown";
import RegisterMethods from "../../utils/registerMethods";
import { useRouter } from "next/router";

const BurgerModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("common");
  const burgerLinks = [
    {
      column: t("navigation_links.headings.products"),
      items: [
        { label: t("navigation_links.links.assist.tow"), url: "/tow-assist" },
        {
          label: t("navigation_links.links.assist.battery"),
          url: "/battery-assist",
        },
        { label: t("navigation_links.links.assist.fuel"), url: "/fuel-assist" },
        { label: t("navigation_links.links.assist.tire"), url: "/tire-assist" },
      ],
    },
    {
      column: t("navigation_links.headings.earn"),
      items: [
        {
          label: t("navigation_links.links.earn_sub.yollda_partners"),
          url: "/earn/yollda-partners",
        },
        {
          label: t("navigation_links.links.earn_sub.tow_drivers"),
          url: "/earn/tow-drivers",
        },
        {
          label: t("navigation_links.links.earn_sub.yollda_fleets"),
          url: "/earn/yollda-fleets",
        },
      ],
    },
    {
      column: t("navigation_links.headings.company"),
      items: [
        { label: t("navigation_links.links.about"), url: "/about" },
        { label: t("navigation_links.links.careers"), url: "/careers" },
        { label: t("navigation_links.links.blogs"), url: "/blog" },
        {
          label: t("navigation_links.links.brand_guideness"),
          url: "/brand-guidelines",
        },
      ],
    },
    {
      column: t("navigation_links.headings.support"),
      items: [
        {
          label: t("navigation_links.links.support.yollda_partners"),
          url: "/support/yollda-partners",
        },
        {
          label: t("navigation_links.links.support.tow_drivers"),
          url: "/support/tow-drivers",
        },
        {
          label: t("navigation_links.links.support.yollda_fleets"),
          url: "/support/yollda-fleets",
        },
        {
          label: t("navigation_links.links.support.contact_us"),
          url: "/contact",
        },
      ],
    },
    {
      column: t("navigation_links.headings.safety"),
      items: [
        {
          label: t("navigation_links.links.safety.driver_safety"),
          url: "/driver-safety",
        },
      ],
    },
    {
      column: t("navigation_links.headings.locations"),
      items: [
        {
          label: t("navigation_links.links.locations.our_cities"),
          url: "/our-cities",
        },
      ],
    },
  ];
  const legalLinks = [
    {
      label: t("navigation_links.links.termAndCondition"),
      url: `/${locale}/terms`,
    },
    { label: t("navigation_links.links.privacy"), url: "/privacy" },
    { label: t("navigation_links.links.cookies"), url: "/cookies" },
    { label: t("navigation_links.links.security"), url: "/security" },
  ];

  const mobileBarItems = [
    {
      id: 1,
      label: t("navigation_links.headings.signUp"),
      items: [...RegisterMethods()],
      isOpen: true,
    },
    {
      id: 2,
      label: t("navigation_links.headings.products"),
      items: burgerLinks[0].items,
      isOpen: false,
    },
    {
      id: 3,
      label: t("navigation_links.headings.earn"),
      items: burgerLinks[1].items,
      isOpen: false,
    },
    {
      id: 4,
      label: t("navigation_links.headings.company"),
      items: burgerLinks[2].items,
      isOpen: false,
    },
    {
      id: 5,
      label: t("navigation_links.headings.support"),
      items: burgerLinks[3].items,
      isOpen: false,
    },
    {
      id: 6,
      label: t("navigation_links.headings.suppport"),
      items: burgerLinks[4].items,
      isOpen: false,
    },
    {
      id: 7,
      label: t("navigation_links.headings.locations"),
      items: burgerLinks[5].items,
      isOpen: false,
    },
    { id: 8, label: t("navigation_links.headings.other"), items: legalLinks },
  ];

  const [barItems, setBarItems] = useState(mobileBarItems);
  const toggleMenuItem = (id) => {
    setBarItems((prev) =>
      prev.map((item) => ({
        ...item,
        isOpen: item.id === id ? !item.isOpen : false,
      }))
    );
  };
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isOpen && isMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  return (
    isOpen && (
      <>
        <div className="hidden md:block fixed left-0 top-0 w-full bg-white rounded-b-2xl  py-16 lg:py-24 shadow-2xl z-20">
          <div className="max-w-[1440px] mx-auto pt-[30px] px-6 sm:px-8 md:px-14 lg:px-16 flex justify-between gap-6">
            <div className="bg-[#f8fafa]  w-full rounded-xl p-[42px] flex flex-col gap-9 justify-between">
              <div className="grid grid-cols-4 gap-3 gap-y-16 w-full">
                {burgerLinks.map((item) => (
                  <ul
                    key={item.column}
                    className="flex flex-col  gap-[8px] font-[700] "
                  >
                    <li className="font-bold py-1 px-3 text-gray-700">
                      {item.column}
                    </li>
                    {item.items.map((link) => (
                      <li
                        key={link.label}
                        className=" font-[500] text-gray-500"
                      >
                        <Link
                          href={link.url}
                          className="py-1 px-3 hover:text-gray-600 hover:bg-[#f3f4f6] transition-colors duration-300 rounded-lg"
                        >
                          {" "}
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <ul className="flex items-center gap-6 font-[500] text-gray-700">
                {legalLinks.map((link) => (
                  <li
                    key={link.label}
                    className="py-1 px-3 hover:text-gray-600 hover:bg-[#f3f4f6] transition-colors duration-300 rounded-lg"
                  >
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden xl:block min-w-[380px]">
              <RegisterBar handleClose={onClose} />
            </div>
          </div>
        </div>
        {/* Mobile-------------------------------- */}
        <div className="md:hidden fixed left-0 top-0 w-full h-full bg-white overflow-y-auto z-20">
          <div className="space-y-6 flex-1 mt-[100px] mx-6">
            <div className="space-y-4">
              {barItems.map((item) => (
                <div key={item.id} className="  transition-all duration-200 ">
                  <button
                    onClick={() => toggleMenuItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between  "
                  >
                    <span className="text-span-responsive text-[16px] font-[600] text-gray-800 pe-4">
                      {item.label}
                    </span>
                    <ArrowDown
                      strokeColor={`stroke-gray-500`}
                      className={`transition-transform duration-200 ${
                        item.isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {item.isOpen && (
                    <div className="px-6 pb-4 animate-fade-in pl-10">
                      <div className="pt-2 flex flex-col gap-6 ">
                        {item.items.map((navigation) => (
                          <Link
                            key={navigation.label}
                            href={navigation.url}
                            className="text-p-small-responsive text-gray-500 text-[16px] font-[500] flex items-center gap-2"
                          >
                            {navigation.icon && navigation.icon}
                            {navigation.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="px-6 pb-6">
                <div className="flex flex-col gap-[8px] mt-8">
                  <span className="font-[500] text-gray-400 text-[14px]">
                    {t("navbar.all_needs")}
                  </span>
                  <a
                    href={"siteData?.[0]?.linkedin"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit bg-light-green text-white font-bold px-6 py-3 rounded-2xl text-button-responsive transition-all duration-200 transform hover:scale-105"
                  >
                    {t("buttons.download_yollda")}
                  </a>
                </div>
                <div className="flex flex-col gap-[8px] mt-8">
                  <span className="font-[500] text-gray-400 text-[14px]">
                    {t("navbar.manage_your_fleet")}
                  </span>
                  <a
                    href={"siteData?.[0]?.linkedin"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit bg-light-green text-white font-bold px-6 py-3 rounded-2xl text-button-responsive transition-all duration-200 transform hover:scale-105"
                  >
                    {t("buttons.download_ypartner")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default BurgerModal;

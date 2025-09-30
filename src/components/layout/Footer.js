import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import YolldaLogo from "../ui/icons/Yollda";

const Footer = ({ siteData }) => {
  const { t } = useTranslation("common");
  const [selectedApp, setSelectedApp] = useState("yollda");

  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const { locale } = router;

  return (
    <footer className="bg-green-dark text-gray-700 py-8 lg:py-28 relative z-10">
      <div className="w-full flex justify-center">
        <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
          {/* Main Footer Content */}
          {/* Logo and App Download Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between mb-12">
            <div className="lg:mr-12">
              <div className="flex items-center space-s-2 mb-2 lg:mb-6">
                <Link href="/" passHref>
                  <YolldaLogo className="max-w-24 lg:max-w-32 cursor-pointer fill-light-green" />
                </Link>
              </div>

              <div className="mb-6 lg:mb-8">
                <div className="inline-flex space-s-2 p-2 rounded-xl bg-green-secondary-dark">
                  <button
                    className={`px-6 py-1 rounded-xl text-span-small-responsive duration-200 ${
                      selectedApp === "yollda"
                        ? "bg-green-dark text-white font-medium"
                        : "text-gray-500"
                    } `}
                    onClick={() => setSelectedApp("yollda")}
                  >
                    Yollda
                  </button>
                  <button
                    className={`px-6 py-1 rounded-xl text-span-small-responsive duration-200 ${
                      selectedApp === "yollda_partner"
                        ? "bg-green-dark text-white font-medium"
                        : "text-gray-500"
                    } `}
                    onClick={() => setSelectedApp("yollda_partner")}
                  >
                    Yollda Partner
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-6 lg:mb-8 text-span-responsive">
                {t("navigation_links.available_text")}
              </p>

              <a
                href={"siteData?.[0]?.linkedin"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-light-green text-white font-bold px-6 py-3 rounded-2xl text-button-responsive transition-all duration-200 transform hover:scale-105"
              >
                Get Yollda
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 mt-12 lg:mt-0">
              {/* Products Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.products")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/assist/tow/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.assist.tow")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/assist/fuel/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.assist.fuel")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/assist/battery/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.assist.battery")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/assist/tire/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.assist.tire")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Earn Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.earn")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/earn/earn_sub/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.earn_sub.yollda_partners")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/earn/earn_sub/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.earn_sub.tow_drivers")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/earn/earn_sub/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.earn_sub.yollda_fleets")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.company")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/about/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.about")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/careers/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.careers")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/blogs`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.blogs")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/brand_guideness`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.brand_guideness")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.support")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/support/yollda_partners/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.support.yollda_partners")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/support/tow_drivers/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.support.tow_drivers")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/support/yollda_fleets/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.support.yollda_fleets")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/support/contact_us/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.support.contact_us")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Safety Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.safety")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/safety/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.safety.driver_safety")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Locations Column */}
              <div>
                <h4 className="span-small-responsive font-semibold mb-4 text-white">
                  {t("navigation_links.headings.locations")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={`/locations/${locale}`}
                      className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("navigation_links.links.locations.our_cities")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-light-secondary-green pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              {/* Social Media Icons */}
              <div className="flex justify-center space-s-4">
                {siteData?.[0]?.facebook && (
                  <a
                    href={siteData[0].facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    <img
                      src="/facebook.png"
                      alt="Facebook"
                      className="w-5 h-5"
                    />
                  </a>
                )}
                {siteData?.[0]?.twitter && (
                  <a
                    href={siteData[0].twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    <img src="/twitter.png" alt="Twitter" className="w-5 h-5" />
                  </a>
                )}
                {siteData?.[0]?.instagram && (
                  <a
                    href={siteData[0].instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    <img
                      src="/instagram.png"
                      alt="Instagram"
                      className="w-5 h-5"
                    />
                  </a>
                )}
                {siteData?.[0]?.linkedin && (
                  <a
                    href={siteData[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    <img
                      src="/linkedin.png"
                      alt="LinkedIn"
                      className="w-5 h-5"
                    />
                  </a>
                )}
                {siteData?.[0]?.tiktok && (
                  <a
                    href={siteData[0].tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    <img src="/tiktok.png" alt="Tiktok" className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Legal Links and Copyright */}
              <div className="flex flex-col lg:flex-row mt-8 lg:mt-0 items-center space-y-4 lg:space-y-0 lg:space-s-8">
                <div className="flex flex-wrap justify-center lg:justify-end space-s-6 text-gray-400">
                  <a
                    href={`/${locale}/terms`}
                    className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("navigation_links.links.termAndCondition")}
                  </a>
                  <a
                    href={`/privacy/${locale}`}
                    className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("navigation_links.links.privacy")}
                  </a>
                  <a
                    href={`/security/${locale}`}
                    className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("navigation_links.links.security")}
                  </a>
                  <a
                    href={`/cookies/${locale}`}
                    className="text-white hover:text-light-green transition-colors duration-200 text-span-small-responsive"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("navigation_links.links.cookies")}
                  </a>
                </div>
                <div className="text-white text-span-small-responsive">
                  © {currentYear} Yollda. {t("navigation_links.copyright")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

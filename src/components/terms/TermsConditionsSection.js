import { useMemo, useState } from "react";
import ArrowDown from "../ui/icons/ArrowDown";
import Link from "next/link";
import { i18n, useTranslation } from "next-i18next";
import { fetchFromAPI } from "../../hooks/apiFetcher";

export default function TermsConditionsSection({
  termsData,
  countriesData: { results: countriesList },
}) {
  const [termsList, setTermsList] = useState(termsData || []);
  const [countrCode, setCountryCode] = useState("AZ");

  const selecetedCountry = useMemo(
    () => countriesList?.find((c) => c.code === countrCode),
    [countrCode]
  );

  const handleCountryChange = async (country) => {
    try {
      const response = await fetchFromAPI(
        "/api/v1/web/terms/",
        i18n?.language,
        {
          Country: country,
        }
      );
      setCountryCode(country);
      setTermsList(response || []);
    } catch (error) {
      console.error("Failed to fetch terms:", error);
    } finally {
      setIsDropdownOpen(false); // always executed
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation("common");

  const widthPattern = [
    "w-full md:w-[30%] xl:w-[23%]", // 1/3
    "w-full md:w-[30%] xl:w-[43%]", // 1/2
    "w-full md:w-[30%] xl:w-[30%]", // 1/4
    "w-full md:w-[30%] xl:w-[45%]", // repeat
    "w-full md:w-[30%] xl:w-[28%]",
    "w-full md:w-[30%] xl:w-[23%]",
  ];

  return (
    <div className="w-full flex justify-center py-12 lg:py-20">
      <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-secondary text-section-lg-title-responsive uppercase font-extrabold text-green-dark">
            {t("terms_page.condition_section.heading")}
          </h1>

          {/* Country Dropdown */}
          <div className="flex justify-center mt-8">
            <div className="relative w-full max-w-sm">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-light-green/10 border border-light-green/20 rounded-xl px-4 py-3 text-left flex items-center justify-between text-green-dark hover:bg-light-green/20  transition-colors duration-200"
              >
                <span className="text-span-responsive font-medium">
                  {selecetedCountry?.name}
                </span>
                <ArrowDown
                  strokeColor={`stroke-gray-500`}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  {countriesList?.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountryChange(country.code)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-span-responsive "
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="text-center mt-14 mb-6">
          <h2 className="text-h2-responsive font-bold text-green-dark mb-12">
            {t("terms_page.condition_section.categories")}
          </h2>

          {/* Categories Grid */}
          <div className="flex flex-wrap gap-6">
            {termsList
              ?.slice() // copy to avoid mutating original
              .map((category, index) => {
                const widthClass = widthPattern[index % widthPattern.length];

                return (
                  <Link
                    key={category.id}
                    href={`/terms/${category.slug}`}
                    className={`${widthClass} min-h-[170px] bg-light-green/10 hover:bg-light-green/20  xl p-6 rounded-2xl transition-all duration-300 cursor-pointer group hover:shadow-lg hover:scale-105 border border-light-green/20`}
                  >
                    <div className="text-left">
                      <h6 className="h6-responsive font-bold text-green-dark mb-3 group-hover:text-green-800 transition-colors duration-200">
                        {category.title}
                      </h6>
                      <p className="text-span-small-responsive text-green-dark/70 font-medium">
                        {category.sub_title}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

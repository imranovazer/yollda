import { useEffect, useMemo, useRef, useState } from "react";
import LinkIcon from "./../../ui/icons/Link";
import ArrowDown from "../../ui/icons/ArrowDown";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";

import CustomInput2 from "./CustomInput2";

export default function PartnerSignupSection({
  isSubmitted,
  setIsSubmitted,
  countriesData: { results: countriesList },
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const params = useSearchParams();
  const services = [
    {
      id: 1,
      type: "TOW_TRUCK",
      title: t("contactus_page.services.tow_truck"),
    },
    {
      id: 2,
      type: "TOW_TRUCK_CARGO",
      title: t("contactus_page.services.tow_truck_cargo"),
    },
    {
      id: 3,
      type: "TIRE_REPAIR",
      title: t("contactus_page.services.tire_repair"),
    },
    {
      id: 4,
      type: "FUEL_DELIVERY",
      title: t("contactus_page.services.fuel_delivery"),
    },
    {
      id: 5,
      type: "BATTERY_CHARGE",
      title: t("contactus_page.services.battery_charge"),
    },
  ];

  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+994",
    email: "",
    service_type: "",
    country: "",
    city: "",
    agreeToTerms: false,
    agreeToPromotions: false,
  });

  console.log(formData.phoneNumber, formData.countryCode);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const countryCodeDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/account/locations/?country_id=${formData.country}`
        );
        const data = await res.json();
        setCities(data);
      } catch (error) {}
    };

    if (formData.country) fetchCities();
  }, [formData.country]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      service_type: params.get("service_type") || "",
    }));
  }, [params]);

  // Close the dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryCodeDropdownRef.current &&
        !countryCodeDropdownRef.current.contains(event.target)
      ) {
        setIsCountryCodeOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    const phoneRegex = /^[0-9\s\-\(\)]{7,15}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t(
        "signup_page.signup_section.form.errors.phone_required"
      );
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = t(
        "signup_page.signup_section.form.errors.phone_invalid"
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t(
        "signup_page.signup_section.form.errors.email_required"
      );
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t(
        "signup_page.signup_section.form.errors.email_invalid"
      );
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = t(
        "signup_page.signup_section.form.errors.country_required"
      );
    }

    // City validation
    if (!formData.city) {
      newErrors.city = t(
        "signup_page.signup_section.form.errors.city_required"
      );
    }

    // Terms agreement validation (required)
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t(
        "signup_page.signup_section.form.errors.terms_required"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldReset = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));

    // Clear error when user starts typing/selecting
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would make the actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/account/check-user/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_prefix: formData.countryCode.slice(1),
            phone: formData.phoneNumber,
            country: formData.country,
            service_type: formData.service_type,
            city: formData.city,
            email: formData.email,
          }),
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        router.push(
          `/fleet-login?token=${
            responseData?.token
          }&prefix=${formData.countryCode.slice(1)}&phone=${
            formData.phoneNumber
          }`
        );
        //no need for now as we redirect
        // setIsSubmitted(true);
      } else {
        if (responseData?.message?.[0]) {
          setError(responseData?.message?.[0]);
        }
        if (responseData?.error) {
          setError(responseData?.error);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapCountryCodeToCountryName = useMemo(() => {
    if (formData.country) {
      const foundCountry = countriesList?.find(
        (country) => formData.country === country.id
      );
      return foundCountry?.name;
    }
    return "";
  }, [formData.country]);

  const selectedCountryCode = useMemo(() => {
    return countriesList?.find((c) => c.phone_code === formData.countryCode);
  }, [formData.countryCode]);

  const selectedCity = useMemo(() => {
    return cities?.find((city) => city.id === formData.city);
  }, [formData.city]);

  const selectedServiceType = useMemo(() => {
    return services?.find((c) => c.type === formData.service_type);
  }, [formData.service_type]);

  return (
    <section className="relative">
      <img
        src="/PartnerSignup.png"
        alt="Beautiful image"
        className="h-[530px] lg:h-[900px] w-full object-cover -mt-24 md:-mt-32 lg:-mt-24"
      />
      <div className="absolute top-0 left-0 z-10 w-full flex justify-center py-12 lg:py-20 mt-16 lg:mt-24">
        <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="grid lg:grid-cols-2 ">
            {/* Left Side - Content */}
            <div className="max-w-[90%] text-white">
              {/* Support Badge */}
              <div className="inline-block mb-4">
                <span className="text-light-green text-span-responsive font-bold">
                  {t("signup_page.signup_section.support_badge")}
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="font-secondary text-h2-responsive uppercase font-bold leading-tight mb-2">
                {t("signup_page.signup_section.heading")}
              </h2>

              {/* Description */}
              <p className="text-p-responsive text-white/90 mb-4 leading-relaxed">
                {t("signup_page.signup_section.description")}
              </p>

              {/* CTA Button */}
              <a
                href={"siteData?.[0]?.linkedin"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-light-green text-white font-bold px-6 py-3 rounded-2xl text-button-responsive transition-all duration-200 transform hover:scale-105"
              >
                {t("signup_page.signup_section.cta_button")}
              </a>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:max-w-[90%] ms-auto bg-white rounded-3xl shadow-2xl p-6 mt-10">
              {isSubmitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-dark"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-h2-responsive font-bold text-green-dark mb-4">
                    {t("signup_page.signup_section.submitted.welcome")}
                  </h2>
                  <p className="text-span-responsive text-gray-500 mb-8">
                    {t("signup_page.signup_section.submitted.description")}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          phoneNumber: "",
                          countryCode: "+994",
                          email: "",
                          country: "",
                          city: "",
                          agreeToTerms: false,
                          agreeToPromotions: false,
                        });
                      }}
                      className="w-full bg-green-dark hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-light-green px-8 py-4 rounded-xl font-bold transition-all duration-200 transform disabled:transform-none text-button-large-responsive flex items-center justify-center"
                    >
                      {t("signup_page.signup_section.submitted.another")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form Header */}
                  <div className="mb-4">
                    <h3 className="text-h3-responsive font-bold text-gray-900 mb-2">
                      {t("signup_page.signup_section.form.heading")}
                    </h3>
                    <Link
                      href={"/signup/fleet"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex items-center text-light-green text-span-small-responsive font-medium mb-4"
                    >
                      <LinkIcon
                        strokeColor="stroke-light-green"
                        className={"me-1 h-5"}
                      />
                      {t("signup_page.signup_section.form.as_fleet")}
                    </Link>
                    <p className="text-p-small-responsive text-gray-500 leading-relaxed">
                      {t("signup_page.signup_section.form.description")}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Phone Number */}

                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.phone_number")}
                      </label>

                      <CustomInput2
                        errors={errors}
                        handleInputChange={handleInputChange}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-span-small-responsive mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.email")}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder={t(
                            "signup_page.signup_section.form.email"
                          )}
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full border ${
                            errors.email ? "border-red-400" : "border-gray-300"
                          } rounded-xl px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent transition-all duration-200 text-input-responsive`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-span-small-responsive mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Country Dropdown */}
                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.country")}
                      </label>
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                          className={`w-full border ${
                            errors.country
                              ? "border-red-400"
                              : "border-gray-300"
                          } rounded-xl px-4 py-2 text-left flex items-center justify-between text-gray-900 hover:bg-gray-200 transition-colors duration-200
                                            ${
                                              isCountryOpen & !errors.country
                                                ? "focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent"
                                                : ""
                                            }
                                        `}
                        >
                          <span
                            className={`text-input-responsive ${
                              formData.country
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {mapCountryCodeToCountryName ||
                              t("signup_page.signup_section.form.country")}
                          </span>
                          <ArrowDown
                            strokeColor={`stroke-gray-500`}
                            className={`transition-transform duration-200 !ms-auto ${
                              isCountryOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isCountryOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-60 overflow-y-auto custom-contact-scrollbar">
                            {countriesList?.map((country) => (
                              <button
                                key={country.id}
                                type="button"
                                onClick={() => {
                                  handleInputChange("country", country.id);
                                  handleFieldReset("city");
                                  setIsCountryOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-200 text-span-responsive first:rounded-t-xl last:rounded-b-xl text-gray-700"
                              >
                                {country.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.country && (
                        <p className="text-red-500 text-span-small-responsive mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>

                    {/* City Dropdown */}
                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.city")}
                      </label>
                      <div className="relative" ref={cityDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCityOpen(!isCityOpen)}
                          className={`w-full border ${
                            errors.city ? "border-red-400" : "border-gray-300"
                          } rounded-xl px-4 py-2 text-left flex items-center justify-between text-gray-900 hover:bg-gray-200 transition-colors duration-200
                                            ${
                                              isCityOpen & !errors.city
                                                ? "focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent"
                                                : ""
                                            }
                                        `}
                        >
                          <span
                            className={`text-input-responsive ${
                              formData.city ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {selectedCity?.name ||
                              t("signup_page.signup_section.form.city")}
                          </span>
                          <ArrowDown
                            strokeColor={`stroke-gray-500`}
                            className={`transition-transform duration-200 !ms-auto ${
                              isCityOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isCityOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto custom-contact-scrollbar">
                            {cities.map((city) => (
                              <button
                                key={city?.id}
                                type="button"
                                onClick={() => {
                                  handleInputChange("city", city?.id);
                                  setIsCityOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-200 text-span-responsive first:rounded-t-xl last:rounded-b-xl text-gray-700"
                              >
                                {city?.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-span-small-responsive mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.services")}
                      </label>
                      <div className="relative" ref={servicesDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsServiceOpen(!isServiceOpen)}
                          className={`w-full border ${
                            errors.city ? "border-red-400" : "border-gray-300"
                          } rounded-xl px-4 py-2 text-left flex items-center justify-between text-gray-900 hover:bg-gray-200 transition-colors duration-200
                                            ${
                                              isServiceOpen &
                                              !errors.service_type
                                                ? "focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent"
                                                : ""
                                            }
                                        `}
                        >
                          <span
                            className={`text-input-responsive ${
                              formData.service_type
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {selectedServiceType?.title ||
                              t("contactus_page.form.services")}
                          </span>
                          <ArrowDown
                            strokeColor={`stroke-gray-500`}
                            className={`transition-transform duration-200 ${
                              isServiceOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isServiceOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-60 overflow-y-auto custom-contact-scrollbar">
                            {services.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => {
                                  handleInputChange(
                                    "service_type",
                                    service.type
                                  );
                                  setIsServiceOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-200 text-span-responsive first:rounded-t-xl last:rounded-b-xl text-gray-700"
                              >
                                {service.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.service_type && (
                        <p className="text-red-400 text-span-small-responsive mt-1">
                          {errors.service_type}
                        </p>
                      )}
                    </div>

                    {/* Terms Agreement Checkbox - REQUIRED */}
                    <div className="space-y-4">
                      <div className="flex items-start space-s-3">
                        <div className="relative flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) =>
                              handleInputChange(
                                "agreeToTerms",
                                e.target.checked
                              )
                            }
                            className="sr-only"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleInputChange(
                                "agreeToTerms",
                                !formData.agreeToTerms
                              )
                            }
                            className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                              formData.agreeToTerms
                                ? "bg-light-green border-light-green"
                                : errors.agreeToTerms
                                ? "border-red-400"
                                : "border-gray-300 hover:border-light-green"
                            }`}
                          >
                            {formData.agreeToTerms && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex-1">
                          <p className="text-span-small-responsive text-gray-500 leading-relaxed">
                            {t("signup_page.signup_section.form.iagree")}{" "}
                            <a
                              href={`/${locale}/terms/`}
                              className="text-light-green hover:text-green-dark transition-colors duration-200 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("navigation_links.links.termAndCondition")}
                            </a>{" "}
                            {t("signup_page.signup_section.form.and")}{" "}
                            <a
                              href={`/privacy/`}
                              className="text-light-green hover:text-green-dark transition-colors duration-200 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("navigation_links.links.privacy")}
                            </a>
                            {t("signup_page.signup_section.form.confirm")}
                          </p>
                        </div>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-span-small-responsive">
                          {errors.agreeToTerms}
                        </p>
                      )}

                      <div className="flex items-start space-s-3">
                        <p className="text-span-small-responsive text-gray-500 leading-relaxed">
                          {t("signup_page.signup_section.form.warning")}
                        </p>
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-500 text-span-small-responsive mt-1">
                        {error}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-dark hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-light-green px-8 py-4 rounded-xl font-bold transition-all duration-200 transform disabled:transform-none text-button-large-responsive flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-s-2 text-white">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>
                            {t(
                              "signup_page.signup_section.form.become_partner"
                            )}
                            ...
                          </span>
                        </div>
                      ) : (
                        t("signup_page.signup_section.form.become_partner")
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

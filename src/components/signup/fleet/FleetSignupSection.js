import { useEffect, useMemo, useRef, useState } from "react";
import ArrowDown from "../../ui/icons/ArrowDown";
import { useTranslation } from "next-i18next";
import ReactInputMask from "react-input-mask";
import { useRouter } from "next/router";

// NEW: local countries + helpers

import { PHONE_COUNTRIES, isoToEmojiFlag } from "../../../utils/phone-counties";

// libphonenumber-js
import {
  getExampleNumber,
  parsePhoneNumberFromString,
  AsYouType,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json"; // example numbers per country (small file)

const USE_FLAG_ICONS = true; // set true if you installed "flag-icons" CSS

export default function FleetSignupSection({
  isSubmitted,
  setIsSubmitted,
  // countriesData prop no longer required — keeping for backward compatibility:
  countriesData,
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const fleetSizes = [
    t("fleetSizes.1-10"),
    t("fleetSizes.11-25"),
    t("fleetSizes.26-50"),
    t("fleetSizes.51-100"),
    t("fleetSizes.100+"),
  ];

  // pick a safe default from local list
  const DEFAULT_ISO = "AZ";
  const defaultCountry =
    PHONE_COUNTRIES.find((c) => c.iso2 === DEFAULT_ISO) || PHONE_COUNTRIES[0];

  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: defaultCountry?.dialCode || "+994",
    countryIso2: defaultCountry?.iso2 || "AZ",
    service_type: "FLEET",
    email: "",
    fleetSize: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFleetSizeOpen, setIsFleetSizeOpen] = useState(false);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);

  const countryCodeDropdownRef = useRef(null);
  const fleetSizeDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryCodeDropdownRef.current &&
        !countryCodeDropdownRef.current.contains(event.target)
      ) {
        setIsCountryCodeOpen(false);
      }
      if (
        fleetSizeDropdownRef.current &&
        !fleetSizeDropdownRef.current.contains(event.target)
      ) {
        setIsFleetSizeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =====> PHONE MASK UTILITIES <=====

  // Turn a formatted national example like "99 999 99 99" or "(201) 555-0123"
  // into a ReactInputMask mask: digits -> 9, keep punctuation/spaces.
  const nationalFormatToMask = (fmt) => {
    // Remove leading country code characters if any sneaked in
    // then map every digit to "9"
    return fmt.replace(/[0-9]/g, "9");
  };

  // Build a country-specific national mask from example numbers.
  const getMaskForCountry = (iso2) => {
    try {
      // get an example MOBILE number (best for signups)
      const ex = getExampleNumber(iso2, examples);
      if (!ex) return "999999999999"; // fallback

      // national formatting (no +country)
      const national = ex.formatNational(); // e.g. "(201) 555-0123"
      const maskFromNational = nationalFormatToMask(national);

      // Some countries have variable lengths; ReactInputMask needs a single mask.
      // This keeps it simple. If mask still contains no digits, fallback:
      if (!/[9]/.test(maskFromNational)) return "999999999999";
      return maskFromNational;
    } catch {
      return "999999999999";
    }
  };

  const selectedCountry = useMemo(() => {
    // prefer match by iso2 stored in state
    const direct = PHONE_COUNTRIES.find((c) => c.iso2 === formData.countryIso2);
    if (direct) return direct;

    // fallback by dial code (if state came from legacy "+994")
    return (
      PHONE_COUNTRIES.find((c) => c.dialCode === formData.countryCode) ||
      PHONE_COUNTRIES[0]
    );
  }, [formData.countryIso2, formData.countryCode]);

  const phoneMask = useMemo(() => {
    return getMaskForCountry(selectedCountry.iso2);
  }, [selectedCountry.iso2]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Phone validation using libphonenumber-js
    const full = `${selectedCountry.dialCode}${formData.phoneNumber.replace(
      /\D/g,
      ""
    )}`;
    const parsed = parsePhoneNumberFromString(full);
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t(
        "signup_page.signup_section.form.errors.phone_required"
      );
    } else if (!(parsed && parsed.isValid())) {
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

    // Fleet size
    if (!formData.fleetSize) {
      newErrors.fleetSize = t(
        "fleet.signup_section.form.errors.required_fleet_size"
      );
    }

    // Terms
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

  const handleCountryPick = (iso2) => {
    const c = PHONE_COUNTRIES.find((x) => x.iso2 === iso2);
    if (!c) return;

    // Update both code and iso2; reset phone if you want (not required)
    setFormData((prev) => ({
      ...prev,
      countryIso2: c.iso2,
      countryCode: c.dialCode,
      // phoneNumber: "", // optional reset
    }));
    setIsCountryCodeOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/v1/account/check-user/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_prefix: formData.countryCode.slice(1),
            phone: formData.phoneNumber,
            service_type: formData.service_type,
            email: formData.email,
            fleet_size: formData.fleetSize,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        router.push(
          `/fleet-login?token=${
            data?.token
          }&prefix=${formData.countryCode.slice(1)}&phone=${
            formData.phoneNumber
          }`
        );
      } else {
        if (data?.message?.[0]) setError(data?.message?.[0]);
        if (data?.error) setError(data?.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        t("signup_page.signup_section.form.errors.general_failed") ||
          "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // For the button preview: render emoji flag or CSS flag
  const renderFlag = (iso2) => {
    if (USE_FLAG_ICONS) {
      // Requires `flag-icons` CSS installed and imported globally
      return (
        <span className={`fi fi-${iso2.toLowerCase()} rounded-[4px] w-5 h-5`} />
      );
    }
    return (
      <span className="text-lg leading-none" aria-hidden>
        {isoToEmojiFlag(iso2)}
      </span>
    );
  };

  return (
    <section className="relative">
      <img
        src="/FleetSignup.png"
        alt="Beautiful image"
        className="h-[530px] lg:h-[670px] w-full object-cover -mt-24 md:-mt-32 lg:-mt-24"
      />
      <div className="absolute top-0 left-0 z-10 w-full flex justify-center py-12 lg:py-20 mt-16 lg:mt-24">
        <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
          <div className="grid lg:grid-cols-2 ">
            {/* Left Side - Content */}
            <div className="max-w-[90%] text-white">
              <div className="inline-block mb-4">
                <span className="text-light-green text-span-responsive font-bold">
                  {t("signup_page.signup_section.support_badge")}
                </span>
              </div>

              <h2 className="font-secondary text-h2-responsive uppercase font-bold leading-tight mb-2">
                {t("signup_page.signup_section.heading")}
              </h2>

              <p className="text-p-responsive text-white/90 mb-4 leading-relaxed">
                {t("signup_page.signup_section.description")}
              </p>

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
                    {t("fleet.signup_section.submitted.welcome")}
                  </h2>
                  <p className="text-span-responsive text-gray-500 mb-8">
                    {t("fleet.signup_section.submitted.description")}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          phoneNumber: "",
                          countryCode: defaultCountry?.dialCode || "+994",
                          countryIso2: defaultCountry?.iso2 || "AZ",
                          service_type: "FLEET",
                          email: "",
                          fleetSize: "",
                          agreeToTerms: false,
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
                      {t("fleet.signup_section.form.heading")}
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("signup_page.signup_section.form.phone_number")}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative" ref={countryCodeDropdownRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setIsCountryCodeOpen(!isCountryCodeOpen)
                            }
                            className={`bg-gray-50 w-[150px] h-11 border border-gray-300 rounded-xl px-3 py-2 text-gray-700 flex items-center gap-2 hover:bg-gray-200 transition-colors duration-200 min-w-[120px]
                              ${
                                isCountryCodeOpen
                                  ? "focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent"
                                  : ""
                              }`}
                          >
                            {renderFlag(selectedCountry.iso2)}
                            <span className="text-span-responsive">
                              {selectedCountry.dialCode}
                            </span>
                            <ArrowDown
                              strokeColor={`stroke-gray-500`}
                              className={`transition-transform duration-200 !ms-auto ${
                                isCountryCodeOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isCountryCodeOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto custom-contact-scrollbar">
                              {PHONE_COUNTRIES.map((country) => (
                                <button
                                  key={country.iso2}
                                  type="button"
                                  onClick={() =>
                                    handleCountryPick(country.iso2)
                                  }
                                  className="w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-200 text-span-responsive first:rounded-t-xl last:rounded-b-xl flex items-center gap-3"
                                >
                                  {renderFlag(country.iso2)}
                                  <span className="text-gray-700">
                                    {country.name}
                                  </span>
                                  <span className="text-gray-500 ms-auto">
                                    {country.dialCode}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <ReactInputMask
                            mask={phoneMask}
                            maskChar={null}
                            placeholder={phoneMask.replace(/9/g, "x")}
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              handleInputChange("phoneNumber", e.target.value)
                            }
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="tel"
                                className={`w-full border ${
                                  errors.phoneNumber
                                    ? "border-red-400"
                                    : "border-gray-300"
                                } rounded-xl px-4 py-2 text-gray-900 placeholder-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent 
                                transition-all duration-200 text-input-responsive`}
                              />
                            )}
                          </ReactInputMask>
                        </div>
                      </div>

                      {errors.phoneNumber && (
                        <p className="text-red-500 text-span-small-responsive mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Email */}
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

                    {/* Fleet Size */}
                    <div>
                      <label className="block text-span-small-responsive font-bold text-gray-800 mb-2">
                        {t("fleet.signup_section.form.vehicles_size")}
                      </label>
                      <div className="relative" ref={fleetSizeDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsFleetSizeOpen(!isFleetSizeOpen)}
                          className={`w-full border ${
                            errors.fleetSize
                              ? "border-red-400"
                              : "border-gray-300"
                          } rounded-xl px-4 py-2 text-left flex items-center justify-between text-gray-900 hover:bg-gray-200 transition-colors duration-200
                            ${
                              isFleetSizeOpen && !errors.fleetSize
                                ? "focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent"
                                : ""
                            }`}
                        >
                          <span
                            className={`text-input-responsive ${
                              formData.fleetSize
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {formData.fleetSize || fleetSizes[0]}
                          </span>
                          <ArrowDown
                            strokeColor={`stroke-gray-500`}
                            className={`transition-transform duration-200 !ms-auto ${
                              isFleetSizeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isFleetSizeOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-60 overflow-y-auto custom-contact-scrollbar">
                            {fleetSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => {
                                  handleInputChange("fleetSize", size);
                                  setIsFleetSizeOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-200 transition-colors duration-200 text-span-responsive first:rounded-t-xl last:rounded-b-xl text-gray-700"
                              >
                                {size}
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

                    <div className="space-y-4">
                      <p className="text-span-responsive text-gray-500 font-medium leading-relaxed">
                        {t("fleet.signup_section.form.already")}{" "}
                        <a
                          href={`/terms/`}
                          className="text-light-green hover:text-green-dark transition-colors duration-200 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("fleet.signup_section.form.sign_in")}
                        </a>
                      </p>
                    </div>

                    <hr className="my-6 md:my-10 lg:my-16 h-[1px] bg-gray-200 border-0" />

                    {/* Terms */}
                    <div className="space-y-4">
                      <div className="flex items-center space-s-3">
                        <div className="relative flex-shrink-0">
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
                            {t("fleet.signup_section.form.yagree")}{" "}
                            <a
                              href={`/${locale}/terms/`}
                              className="text-light-green hover:text-green-dark transition-colors duration-200 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("navigation_links.links.termAndCondition")}
                            </a>{" "}
                            {t("fleet.signup_section.form.and")}{" "}
                            <a
                              href={`/privacy/`}
                              className="text-light-green hover:text-green-dark transition-colors duration-200 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("navigation_links.links.privacy")}
                            </a>
                          </p>
                        </div>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-span-small-responsive">
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-500 text-span-small-responsive mt-1">
                        {error}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-dark hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-light-green px-8 py-4 rounded-xl font-bold transition-all duration-200 transform disabled:transform-none text-button-large-responsive flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-s-2 text-white">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t("fleet.signup_section.form.becoming")}</span>
                        </div>
                      ) : (
                        t("fleet.signup_section.form.as_fleet_owner")
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

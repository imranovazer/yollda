import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "next-i18next";

export default function ServicesCarousel({ ourServicesData }) {
  const { t } = useTranslation("common");
  // const services = [
  //   {
  //     id: 1,
  //     title: t("our_services.services.emergency_towing_title"),
  //     description: t("our_services.services.emergency_towing_description"),
  //     buttonText: t("our_services.services.emergency_towing_button"),
  //     image:
  //       "https://images.pexels.com/photos/3964704/pexels-photo-3964704.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     bgColor: "from-gray-700 to-gray-800",
  //   },
  //   {
  //     id: 2,
  //     title: t("our_services.services.tire_repair_title"),
  //     description: t("our_services.services.tire_repair_description"),
  //     buttonText: t("our_services.services.tire_repair_button"),
  //     image:
  //       "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     bgColor: "from-gray-700 to-gray-800",
  //   },
  //   {
  //     id: 3,
  //     title: t("our_services.services.allver_business_title"),
  //     description: t("our_services.services.allver_business_description"),
  //     buttonText: t("our_services.services.allver_business_button"),
  //     image:
  //       "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     bgColor: "from-gray-700 to-gray-800",
  //   },
  //   {
  //     id: 4,
  //     title: t("our_services.services.fuel_delivery_title"),
  //     description: t("our_services.services.fuel_delivery_description"),
  //     buttonText: t("our_services.services.fuel_delivery_button"),
  //     image:
  //       "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     bgColor: "from-gray-700 to-gray-800",
  //   },
  //   {
  //     id: 5,
  //     title: t("our_services.services.peer_help_title"),
  //     description: t("our_services.services.peer_help_description"),
  //     buttonText: t("our_services.services.peer_help_button"),
  //     image:
  //       "https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=800",
  //     bgColor: "from-gray-700 to-gray-800",
  //   },
  // ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  // const [isDragging, setIsDragging] = useState(false);

  // Desktop carousel - shows multiple slides with enhanced touch
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    // containScroll: "trimSnaps",
    containScroll: false,
    slidesToScroll: 1,

    skipSnaps: false,
    // Enhanced touch settings
    dragFree: false,
    watchDrag: false,
    watchResize: true,
    watchSlides: true,
    draggable: false,
    // Touch sensitivity and behavior
    startIndex: 0,
    inViewThreshold: 0.7,
  });

  // Mobile carousel - shows one slide at a time with optimized touch
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    // containScroll: "trimSnaps",
    containScroll: false,
    slidesToScroll: 1,
    // Mobile-optimized touch settings
    dragFree: false,

    watchDrag: false,
    watchResize: true,
    watchSlides: true,
    // Better mobile touch response
    startIndex: 0,
    inViewThreshold: 0.5,
  });

  const updateCurrent = useCallback((emblaApi) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    updateCurrent(emblaApi);
  }, [emblaApi, updateCurrent]);

  const onMobileSelect = useCallback(() => {
    if (!mobileEmblaApi) return;
    updateCurrent(mobileEmblaApi);
  }, [mobileEmblaApi, updateCurrent]);

  // Handle drag start/end for better UX
  // const onDragStart = useCallback(() => {
  //   setIsDragging(true);
  // }, []);

  // const onDragEnd = useCallback(() => {
  //   setIsDragging(false);
  // }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    // emblaApi.on("pointerDown", onDragStart);
    // emblaApi.on("pointerUp", onDragEnd);
    onSelect();
    const tick = () => {
      if (document.hidden) return;
      if (emblaApi) emblaApi.scrollNext();
      if (mobileEmblaApi) mobileEmblaApi.scrollNext();
    };

    const id = setInterval(tick, 3000);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      // emblaApi.off("pointerDown", onDragStart);
      // emblaApi.off("pointerUp", onDragEnd);
      clearInterval(id);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!mobileEmblaApi) return;

    mobileEmblaApi.on("select", onMobileSelect);
    mobileEmblaApi.on("reInit", onMobileSelect);
    // mobileEmblaApi.on("pointerDown", onDragStart);
    // mobileEmblaApi.on("pointerUp", onDragEnd);
    onMobileSelect();

    return () => {
      mobileEmblaApi.off("select", onMobileSelect);
      mobileEmblaApi.off("reInit", onMobileSelect);
      // mobileEmblaApi.off("pointerDown", onDragStart);
      // mobileEmblaApi.off("pointerUp", onDragEnd);
    };
  }, [mobileEmblaApi, onMobileSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    if (mobileEmblaApi) mobileEmblaApi.scrollPrev();
  }, [emblaApi, mobileEmblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    if (mobileEmblaApi) mobileEmblaApi.scrollNext();
  }, [emblaApi, mobileEmblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
      if (mobileEmblaApi) mobileEmblaApi.scrollTo(index);
    },
    [emblaApi, mobileEmblaApi]
  );

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 lg:mb-20" />

        {/* Desktop Carousel */}
        <div className="hidden md:block relative h-[32rem]">
          <div ref={emblaRef}>
            <div className="flex rtl:flex-row-reverse">
              {ourServicesData?.results?.map((service, index) => {
                const total = ourServicesData.results.length;
                const rawDiff = Math.abs(index - selectedIndex);
                const diff = Math.min(rawDiff, total - rawDiff);

                let scaleClass = "h-[26rem]";

                if (diff === 0) {
                  scaleClass = "scale-105 z-10 h-[32rem]";
                } else if (diff === 1) {
                  scaleClass = "z-0 h-[30rem]";
                }

                return (
                  <div
                    key={service.id}
                    className="flex-[0_0_30%] min-w-0 px-3 my-auto"
                  >
                    <div
                      className={`w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ease-out ${scaleClass}`}
                    >
                      <div
                        className={`relative h-full bg-gradient-to-br select-none from-gray-900 to-gray-800 flex flex-col justify-between p-6 text-white`}
                      >
                        {/* Background Image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-60"
                          style={{ backgroundImage: `url(${service.banner})` }}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <h3 className="text-h4-responsive font-bold mb-4">
                            {service.title}
                          </h3>
                          <p className="body-regular mb-6 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        {/* Button */}
                        <div className="relative z-10">
                          <a
                            href={service.deeplink_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-light-green hover:light-secondary-green text-white px-6 py-3 rounded-full font-semibold text-button-responsive transition-all duration-200 transform hover:scale-105"
                          >
                            {service.action_title}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden h-[32rem]">
          <div ref={mobileEmblaRef}>
            <div className="flex rtl:flex-row-reverse">
              {ourServicesData?.results?.map((service, index) => {
                const total = ourServicesData.results.length;
                const rawDiff = Math.abs(index - selectedIndex);
                const diff = Math.min(rawDiff, total - rawDiff);

                let scaleClass = "h-[26rem]";

                if (diff === 0) {
                  scaleClass = "scale-105 z-10 h-[32rem]";
                } else if (diff === 1) {
                  scaleClass = "z-0 h-[30rem]";
                }

                return (
                  <div
                    key={service.id}
                    className="flex-[0_0_75%] min-w-0 px-2 my-auto"
                  >
                    <div
                      className={`w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ease-out ${scaleClass}`}
                    >
                      <div
                        className={`relative h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-between p-6 text-white`}
                      >
                        {/* Background Image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-60"
                          style={{ backgroundImage: `url(${service.banner})` }}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <h3 className="text-h4-responsive font-bold mb-4">
                            {service.title}
                          </h3>
                          <p className="body-regular mb-6 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        {/* Button */}
                        <div className="relative z-10">
                          <a
                            href={service.deeplink_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-light-green hover:light-secondary-green text-white px-6 py-3 rounded-full font-semibold text-button-responsive transition-all duration-200 transform hover:scale-105"
                          >
                            {service.action_title}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8 space-s-6 mr-2 lg:mr-0">
          <div></div>
          {/* Dots Indicator */}
          <div className="hidden md:flex space-s-2">
            {ourServicesData?.results?.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-light-green scale-125 shadow-lg"
                    : "bg-gray-400 hover:bg-gray-500 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows - Both on Right */}
          <div className="flex space-s-3">
            {/* Previous Button */}
            <button
              onClick={scrollPrev}
              className="bg-gray-300 hover:bg-gray-500 rounded-xl p-3 shadow-lg transition-all duration-400 border border-gray-200 rtl:-rotate-180"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={scrollNext}
              className="bg-gray-300 hover:bg-gray-500 rounded-xl p-3 shadow-lg transition-all duration-400 border border-gray-200 rtl:rotate-180"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

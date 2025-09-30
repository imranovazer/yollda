import Breadcrumb from "../ui/Breadcrumb";

import { useTranslation } from "next-i18next";

import SubscribeNewsletter from "../ui/SubscribeNewsletter";
import { useRouter } from "next/router";
import { formatDate } from "../../hooks/formatDate";

export default function SingleNewSection({ newData }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const breadcrumbItems = [
    { label: t("navigation.news"), url: "/news" },
    { label: newData?.category?.title, url: "" },
  ];

  return (
    <div className="w-full flex justify-center py-12 lg:py-20">
      <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
        <div className="flex flex-col lg:w-[80%] mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <h2 className="font-secondary text-h2-responsive uppercase font-bold text-green-dark lg:w-[80%]">
            {newData?.title}
          </h2>

          <div className="flex flex-wrap gap-2 md:gap-1 md:space-s-4 mt-6">
            {newData?.tags?.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 text-span-responsive cursor-default font-medium rounded-full transition-all duration-200 text-green-dark bg-light-green/20`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center mt-6">
            <img src="/calendar.svg" className="me-2" alt="calendar icon" />
            <span className="text-span-small-responsive text-gray-500">
              {formatDate(newData?.created_at, locale)}
            </span>
          </div>
        </div>
        <img
          src={newData?.banner}
          alt={"new image"}
          className="w-full max-h-[250px] md:max-h-[450px] lg:max-h-[650px] object-cover mt-6 rounded-2xl"
        />

        <div className="flex flex-col lg:w-[80%] mx-auto mt-10">
          <div
            className="lg:w-[80%]
                        prose-h1:text-h1-responsive prose-h1:mt-12 prose-h1:mb-8 
                        prose-h2:text-h2-responsive prose-h2:mt-12 prose-h2:mb-8 
                        prose-h3:text-h3-responsive prose-h3:mt-8 prose-h3:mb-6
                        prose-h4:text-h4-responsive prose-h4:mt-8 prose-h4:mb-6
                        prose-h5:text-h5-responsive prose-h5:mt-6 prose-h5:mt-4
                        prose-h6:text-h6-responsive prose-h6:mt-4 prose-h6:mt-0

                        prose-headings:text-green-dark prose-headings:!font-bold
                        prose-p:text-gray-500
                        prose-a:text-gray-800 prose-a:underline
                        prose-strong:text-gray-800

                        prose-hr:my-5
                      
                        prose-hr:h-[2px]
                        prose-hr:bg-gray-200
                        prose-hr:border-0

                        prose-ul:text-gray-500 prose-ol:text-gray-500
                        prose-ul:list-disc
                        prose-li:list-inside
                        prose-li:marker:text-gray-500
                        prose-li:marker:-pr-20
                        "
            dangerouslySetInnerHTML={{ __html: newData?.content }}
          />
        </div>

        <div className="mt-24">
          <SubscribeNewsletter />
        </div>
      </div>
    </div>
  );
}

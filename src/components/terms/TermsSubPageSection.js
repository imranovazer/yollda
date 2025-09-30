import React from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { useTranslation } from "next-i18next";
import { formatDate } from "../../hooks/formatDate";
import { useRouter } from "next/router";

// const mockTermsData = {
//   users: {
//     id: "yollda-users",
//     title: "Yollda Users",
//     subtitle: "Service Beneficiaries",
//     lastUpdated: "March 8, 2022",
//     content: `
//       <h6>Eligibility</h6>
//       <p>You <strong>must</strong> be <a href="asd"/>link</a> at least 18 years old to use the Yollda app. By registering, you confirm that the information provided is accurate and up to date.</p>
//       <p>You must be at least 18 years old to use the Yollda app. By registering, you confirm that the information provided is accurate and up to date.</p>
//       <hr/>
//       <p>You must be at least 18 years old to use the Yollda app. By registering, you confirm that the information provided is accurate and up to date.</p>
//       <p>You must be at least 18 years old to use the Yollda app. By registering, you confirm that the information provided is accurate and up to date.</p>
//       <p>You must be at least 18 years old to use the Yollda app. By registering, you confirm that the information provided is accurate and up to date.</p>

//       <h4>Services Provided</h4>
//       <p>Yollda allows users to request services such as towing, tire repair, battery jump-starts, and fuel delivery. Services are delivered by independent service providers (Yollda Partners or Fleet Owners).</p>
//       <ul><li>sdkfkdsf</li><li>sllgdflkgdfg</li></ul>
//       <h2>Payments</h2>
//       <p>All payments are processed through the Yollda app. Users agree to pay the price indicated prior to confirming the service.</p>

//       <h2>Cancellations and Refunds</h2>
//       <p>Users may cancel a request before a provider is assigned without penalty. Once a provider is en route, cancellation fees may apply.</p>

//       <h2>Liability</h2>
//       <p>Yollda is a platform connecting users with service providers. We are not liable for damages caused by service providers. Complaints may be filed through the app.</p>
//     `,
//   },
// };

function TermsSubPageSection({ specificTermData }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const breadcrumbItems = [
    { label: t("navigation.terms"), url: "/terms" },
    {
      label: specificTermData?.title || t("navigation.terms-special"),
      url: "",
    },
  ];

  return (
    <div className="w-full flex justify-center py-12 md:py-20">
      <div className="max-w-[1440px] w-full px-6 sm:px-8 md:px-16 lg:px-20">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col">
          <h1 className="text-h1-responsive uppercase font-bold text-green-dark lg:w-[80%]">
            {specificTermData?.title || ""}
          </h1>
          <div className="flex items-center mt-6">
            <img src="/calendar.svg" className="me-2" alt="calendar icon" />
            <span className="text-span-small-responsive text-gray-500">
              {formatDate(specificTermData?.updated_at, locale)}
            </span>
          </div>
          <p className="text-gray-500 text-large-responsive mt-3 lg:w-[80%]">
            {specificTermData?.sub_title || ""}
          </p>
          {/* <hr className="my-6 md:my-10 lg:my-16 h-[2px] bg-gray-200 border-0" /> */}

          <div
            className="lg:w-[80%] mt-4 lg:mt-8
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
            dangerouslySetInnerHTML={{ __html: specificTermData.description }}
          />
        </div>
      </div>
    </div>
  );
}

export default TermsSubPageSection;

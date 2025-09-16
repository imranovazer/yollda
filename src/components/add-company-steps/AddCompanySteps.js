import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import CaseIcon from "../ui/icons/CaseIcon";
import FileIcon from "../ui/icons/FileIcon";
import VehicleIcon from "../ui/icons/VehicleIcon";
import CardIcon from "../ui/icons/CardIcon";
import FlashIcon from "../ui/icons/FlashIcon";
import TickCircle from "../ui/icons/TickCircle";
import ClockIcon from "../ui/icons/ClockIcon";
import CrossCirlce from "../ui/icons/CrossCircle";
import DangerIcon from "../ui/icons/DangerIcon";
import DeleteModal from "./DeleteModal";
import axiosInstance from "../../axios";
import Link from "next/link";
import LoadingScreen from "../ui/LoadingScreen";

const TaskStatus = {
  REVIEW: "review",
  ACCEPTED: 1,
  IDLE: 2,
  DECLINED: 3,
};

/* ------- Mocked backend data (simulate API response) ------- */
const useSteps = () =>
  useMemo(
    () => [
      {
        icon: CaseIcon,
      },
      {
        icon: FileIcon,
      },
      {
        icon: VehicleIcon,
      },
      {
        icon: CardIcon,
      },
    ],
    []
  );

/* ------- Helper to determine gradient for connecting line ------- */
const getTimelineGradient = (currentStepStatus, nextStepStatus) => {
  const isCurrentCompleted = currentStepStatus === TaskStatus.ACCEPTED;
  const isNextCompleted = nextStepStatus === TaskStatus.ACCEPTED;

  if (isCurrentCompleted && isNextCompleted) {
    return "bg-gradient-to-b from-emerald-400 to-emerald-400";
  } else if (isCurrentCompleted && !isNextCompleted) {
    return "bg-gradient-to-b from-emerald-400 via-emerald-300 to-gray-200";
  } else if (!isCurrentCompleted && isNextCompleted) {
    return "bg-gradient-to-b from-gray-200 via-emerald-300 to-emerald-400";
  } else {
    return "bg-gradient-to-b from-gray-200 to-gray-200";
  }
};

/* ------- Step card ------- */
function StepCard({ step, Icon, isLast, nextStep }) {
  const { t } = useTranslation();
  const getStepStyles = (status) => {
    switch (status) {
      case TaskStatus.ACCEPTED:
        return {
          outerRing: "bg-emerald-400/20",
          innerCircle: "bg-emerald-400",
          iconColor: "#FFFFFF",
        };
      case TaskStatus.DECLINED:
        return {
          outerRing: "bg-red-400/20",
          innerCircle: "bg-red-400",
          iconColor: "#FFFFFF",
        };
      case TaskStatus.REVIEW:
        return {
          outerRing: "bg-amber-400/20",
          innerCircle: "bg-amber-400",
          iconColor: "#FFFFFF",
        };
      default: // IDLE
        return {
          outerRing: "bg-gray-200/20",
          innerCircle: "bg-gray-100",
          iconColor: "#6B7280",
        };
    }
  };

  const stepStyles = getStepStyles(step?.status?.status);

  return (
    <div className="flex w-full">
      {/* Timeline rail + bullet */}
      <div className="relative w-[50px]">
        <div
          className={`absolute top-0 left-0 w-[38px] h-[38px] ${stepStyles.outerRing} rounded-full flex items-center justify-center`}
        >
          <div
            className={`w-[32px] h-[32px] ${stepStyles.innerCircle} rounded-full z-20 flex justify-center items-center shadow-sm`}
          >
            <Icon color={stepStyles.iconColor} />
          </div>
        </div>

        {!isLast && (
          <div
            className={`absolute top-[19px] left-[16px] w-[6px] h-[calc(100%+19px)] ${getTimelineGradient(
              step.status.status,
              nextStep?.status
            )} rounded-full`}
          />
        )}
      </div>

      {/* Card */}
      <div className="rounded-[26px] p-4 shadow-lg flex flex-col gap-3 w-full bg-white border border-gray-100">
        <div className="flex flex-col gap-3">
          <h3 className="text-gray-800 text-[20px] font-[600]">
            {step?.title}
          </h3>
          <p className="text-[16px] font-[500] text-gray-500">
            {step?.description}
          </p>
        </div>

        {step?.status?.status === TaskStatus.IDLE ||
          (step?.status?.status === null && (
            <Link
              href={`/add-company-steps/${step.id}`}
              className="rounded-[16px] text-[12px] text-gray-600 font-[600] hover:bg-gray-200 bg-gray-100 py-[6px] px-[16px] w-fit transition-all duration-200 hover:shadow-sm"
            >
              {t("add_company_steps.statuses.addInfo")}
            </Link>
          ))}
        {step?.status?.status === TaskStatus.DECLINED && (
          <Link
            href={`/add-company-steps/${step.id}`}
            className="rounded-[16px] text-[12px] text-red-600 font-[600] hover:bg-red-100 bg-red-50 py-[6px] px-[16px] w-fit transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
          >
            <CrossCirlce color="#DC2626" />
            {t("add_company_steps.statuses.declined")}
          </Link>
        )}
        {step?.status?.status === TaskStatus.ACCEPTED && (
          <Link
            href={`/add-company-steps/${step.id}`}
            className="rounded-[16px] text-[12px] text-emerald-600 font-[600] hover:bg-emerald-100 bg-emerald-50 py-[6px] px-[16px] w-fit transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
          >
            <TickCircle color="#059669" />
            {t("add_company_steps.statuses.accepted")}
          </Link>
        )}
        {step?.status?.status === TaskStatus.REVIEW && (
          <Link
            href={`/add-company-steps/${step.id}`}
            className="rounded-[16px] text-[12px] text-amber-600 font-[600] hover:bg-amber-100 bg-amber-50 py-[6px] px-[16px] w-fit transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
          >
            <ClockIcon color="#D97706" />
            {t("add_company_steps.statuses.review")}
          </Link>
        )}
      </div>
    </div>
  );
}

/* ------- Top error item (only shows when hasError is true) ------- */
function TopErrorItem({ onDeleteClick }) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full h-full ">
      {/* left rail + bullet */}
      <div className="relative w-[50px]">
        <div className="absolute top-0 left-0 w-[38px] h-[38px] bg-[#FEF2F2] rounded-full flex items-center justify-center">
          <div className="w-[32px] h-[32px] bg-[#FEF2F2] rounded-full z-20 flex justify-center items-center shadow-sm">
            {/* using FlashIcon as the alert symbol you already import */}
            <DangerIcon />
          </div>
        </div>
      </div>

      {/* red message card */}
      <div className="rounded-[26px] p-4 flex flex-col gap-3 w-full bg-red-50 ">
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-800 text-[18px] font-[500]">
            {t("add_company_steps.error.topTitle")}
          </h3>
          <p className="text-[14px] font-[500] text-gray-500">
            {t("add_company_steps.error.topMessage")}
          </p>
          <button
            onClick={onDeleteClick}
            className="text-red-600 font-semibold text-[14px] w-fit hover:underline"
          >
            {t("add_company_steps.error.deleteBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------- Page ------- */
export default function SetupPage() {
  const mockSteps = useSteps();
  const [stepsData, setStepsData] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");
  // NEW: errors state (true by default)
  const [hasError] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle actual deletion logic here
    console.log("Application deleted");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const getSteps = async () => {
      try {
        const res = await axiosInstance("/api/v1/account/onboarding/", {
          headers: { Country: "AZ" },
        });
        setStepsData(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getSteps();
  }, []);

  return (
    <div className="h-full w-full bg-white ">
      {/* Main */}
      {success ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex w-full flex-col gap-8">
            <div className="relative flex items-center justify-center h-[300px]">
              <div className="bg-gray-100 rounded-full w-full max-w-[196px] aspect-square"></div>
              <img
                src="/successCharacter.png"
                className="absolute w-[196px] "
              />
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("add_company_steps.success.title")}
              </h1>
              <p className="text-gray-500 text-sm max-w-[280px]">
                {t("add_company_steps.success.message")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 flex flex-col items-stretch gap-8 max-w-[500px] h-full">
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            {stepsData?.title}
          </h1>

          {loading ? (
            <LoadingScreen size="lg" />
          ) : (
            <section className="mt-4">
              {/* Top error (conditional) */}
              {hasError && <TopErrorItem onDeleteClick={handleDeleteClick} />}

              <div className="space-y-5 flex flex-col mt-5">
                {stepsData?.steps?.map((step, i) => (
                  <StepCard
                    key={step.id}
                    Icon={mockSteps[i].icon}
                    step={step}
                    isLast={i === stepsData?.steps?.length - 1}
                    nextStep={stepsData?.steps?.[i + 1]}
                  />
                ))}
              </div>

              {/* Final completion step */}
              <div className="flex w-full mt-7">
                {/* Timeline rail + bullet */}
                <div className="relative w-[50px]">
                  <div className="absolute top-0 left-0 w-[38px] h-[38px] bg-gray-200/20 rounded-full flex items-center justify-center">
                    <div className="w-[32px] h-[32px] bg-gray-100 rounded-full z-20 flex justify-center items-center shadow-sm">
                      <FlashIcon />
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div className="rounded-[26px] p-4 flex flex-col gap-3 w-full bg-gray-50">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-gray-800 text-[20px] font-[600]">
                      {stepsData?.bottom_title}
                    </h3>
                    <p className="text-[16px] font-[500] text-gray-500">
                      {stepsData?.bottom_description}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer note */}
          <p className="text-sm text-gray-600 border-t-2 border-gray-200 py-5">
            {t("add_company_steps.footer.text")}{" "}
            <button
              onClick={handleDeleteClick}
              className="text-emerald-500 hover:text-emerald-600 transition-colors underline"
            >
              {t("add_company_steps.footer.deleteLink")}
            </button>
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

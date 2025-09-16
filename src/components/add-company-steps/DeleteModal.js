import React from "react";
import CloseIcon from "../ui/icons/Close";
import { useTranslation } from "next-i18next";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  const { t } = useTranslation("common");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full h-full sm:w-full sm:max-w-[400px] sm:h-auto sm:mx-4 sm:rounded-[20px] shadow-2xl flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-[20px] font-[600] text-gray-900">
            {t("deleteModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full flex-shrink-0"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">
          <p className="text-[14px] text-gray-600 leading-[1.4]">
            {t("deleteModal.description")}
          </p>
        </div>

        {/* Buttons */}
        <div className="p-6 pt-0 mt-auto">
          <div className="flex gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 text-[14px] font-[500] text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[12px] transition-colors order-2 sm:order-1"
            >
              {t("deleteModal.cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-6 py-2.5 text-[14px] font-[500] text-white bg-red-500 hover:bg-red-600 rounded-[12px] transition-colors order-1 sm:order-2"
            >
              {t("deleteModal.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseIcon from "../ui/icons/Close";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "text/plain",
];

function getExtension(name = "") {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function validateFile(file) {
  if (!file) return { ok: false, error: "No file selected." };

  // size
  if (file.size > MAX_SIZE_BYTES) {
    return {
      ok: false,
      error: "Max file size is 10 MB.",
    };
  }

  // type / extension (MIME can be unreliable across browsers, so we check both)
  const ext = getExtension(file.name);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.type);

  if (!isExtAllowed && !isMimeAllowed) {
    return {
      ok: false,
      error:
        "Unsupported file type. Allowed: .doc, .docx, .pdf, .jpg, .jpeg, .txt",
    };
  }

  return { ok: true };
}

const FileUploadModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expirationDate, setExpirationDate] = useState();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const trySetFile = (file) => {
    const { ok, error } = validateFile(file);
    if (ok) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError(error);
      // reset input so the same file can be re-picked after correction
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      trySetFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      trySetFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = () => {
    if (!selectedFile) return;
    // extra guard: do not confirm if current file somehow became invalid
    const { ok } = validateFile(selectedFile);
    if (!ok) return;

    if (expirationDate) {
      const formattedDate = formatDate(expirationDate);
      onConfirm(selectedFile, formattedDate);
    } else {
      onConfirm(selectedFile);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setExpirationDate(undefined);
    setIsDragOver(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          background: white;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: none;
          border-radius: 16px 16px 0 0;
          padding: 20px 24px 16px 24px;
        }
        .react-datepicker__current-month {
          font-size: 16px;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0;
          text-align: center;
        }
        .react-datepicker__day-names {
          display: flex;
          justify-content: space-between;
          margin: 16px 0 8px 0;
          padding: 0 24px;
        }
        .react-datepicker__day-name {
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          width: 32px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }
        .react-datepicker__month {
          padding: 0 24px 20px 24px;
          margin: 0;
        }
        .react-datepicker__week {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .react-datepicker__day {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0;
          line-height: 1;
        }
        .react-datepicker__day:hover {
          background-color: #f3f4f6;
        }
        .react-datepicker__day--selected {
          background-color: #10b981;
          color: white;
        }
        .react-datepicker__day--selected:hover {
          background-color: #059669;
        }
        .react-datepicker__day--outside-month {
          color: #d1d5db;
        }
        .react-datepicker__day--outside-month:hover {
          background-color: #f9fafb;
        }
        .react-datepicker__navigation {
          top: 24px;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
        }
        .react-datepicker__navigation:hover {
          background-color: #f3f4f6;
        }
        .react-datepicker__navigation--previous {
          left: 24px;
        }
        .react-datepicker__navigation--next {
          right: 24px;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #6b7280;
          border-width: 2px 2px 0 0;
          width: 6px;
          height: 6px;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4">
        <div className="bg-white sm:rounded-3xl shadow-2xl w-full h-full sm:h-fit sm:max-w-[510px] relative">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold text-gray-900  leading-tight">
                {t("uploadModal.title")}
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full flex-shrink-0"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-[15px] text-gray-500 leading-relaxed">
              {t("uploadModal.description")}
            </p>

            {/* Validation hint */}
            {/* <p className="mt-2 text-[13px] text-gray-500">
              Allowed: .doc, .docx, .pdf, .jpg, .jpeg, .txt — up to 10 MB
            </p> */}
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
                {error}
              </div>
            )}

            {/* File Upload Area */}
            <div
              className={`relative border-2 rounded-2xl py-12 px-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-light-green bg-gray-100"
                  : "border-gray-200 bg-[#D9D9D900]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                // Accept only the requested types
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.txt"
              />

              <div className="space-y-4">
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="mx-auto w-8 h-8 text-green-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-[15px] font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[15px] font-medium text-gray-700">
                        {t("uploadModal.dropPrompt")}
                      </p>
                      <p className="text-[14px] text-gray-500">
                        {t("uploadModal.orChoose")}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBrowseClick}
                  className="px-6 py-2.5 bg-gray-100 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-200 transition-all duration-200"
                >
                  {t("uploadModal.browse")}
                </button>
              </div>
            </div>

            {/* Expiration Date */}
            <div className="space-y-3">
              <label className="block text-[15px] font-medium text-gray-900">
                {t("uploadModal.expirationDate")}
              </label>

              <div className="relative">
                <DatePicker
                  selected={expirationDate}
                  onChange={(date) => setExpirationDate(date || undefined)}
                  placeholderText="MM.dd.yy"
                  dateFormat="MM.dd.yy"
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent text-[15px]"
                  calendarClassName="shadow-xl"
                  popperClassName="z-50"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-[15px]"
              >
                {t("uploadModal.cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedFile || !!error}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-[15px]"
              >
                {t("uploadModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadModal;

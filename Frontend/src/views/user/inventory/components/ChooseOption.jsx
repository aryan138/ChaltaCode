// ChooseOption.js
import React from "react";

const ChooseOption = ({ handleManualEntry, handleExcelUpload, excelData, showManualForm }) => {
  return (
    <>
      {!showManualForm && !excelData && (
        <div className="flex gap-4">
          <button
            onClick={handleManualEntry}
            className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            Enter Manually
          </button>
          <label className="flex-1">
            <span className="flex cursor-pointer items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
              Enter with Excel
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelUpload}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default ChooseOption;

import React from 'react';

const ExcelUploadPopup = ({ excelData, handleSubmitExcel, loading, error }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Excel Data Preview</h4>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-y-auto max-h-60"> {/* Scrollable container */}
        <table className="min-w-full table-auto border-separate border-spacing-2">
          <thead>
            <tr>
              {Object.keys(excelData[0]).map((key, index) => (
                <th key={index} className="border px-2 py-1">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="border px-2 py-1">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSubmitExcel}
        disabled={loading}
        className="w-full rounded-lg bg-brand-500 py-2 text-white hover:bg-brand-600 disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Submit Data"}
      </button>
    </div>
  );
};

export default ExcelUploadPopup;

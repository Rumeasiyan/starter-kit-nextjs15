import React from 'react';

export interface UnauthorizedPopupProps {
  onClose: () => void;
}

const UnauthorizedPopup: React.FC<UnauthorizedPopupProps> = ({ onClose }) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-red-500">Unauthorized</h2>
        <p className="mb-4 text-gray-700">
          You do not have permission to access this page.
        </p>
        <button
          onClick={onClose}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPopup;

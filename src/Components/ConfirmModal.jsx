/* eslint-disable react/prop-types */

import "./Styles/ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-modal-btn yes" onClick={onConfirm}>
            YES
          </button>
          <button className="confirm-modal-btn no" onClick={onCancel}>
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

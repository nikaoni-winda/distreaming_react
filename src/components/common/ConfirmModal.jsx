import React from 'react';
import Modal from './Modal';

/**
 * Confirm Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when cancelling
 * @param {function} onConfirm - Function to call when confirming
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 * @param {boolean} isDestructive - If true, confirm button will be red
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="mb-6 text-gray-300">{message}</p>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded text-white hover:bg-gray-700 transition font-medium"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`px-4 py-2 rounded text-white font-bold transition flex items-center gap-2 ${isDestructive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-netflix-red hover:bg-red-700'
                        }`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;

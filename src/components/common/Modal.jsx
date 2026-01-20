import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

/**
 * Generic Modal Component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when closing
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {string} maxWidth - Max width class (default: max-w-md)
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div
                className={`bg-[#181818] border border-gray-700 rounded-lg shadow-2xl w-full ${maxWidth} animate-scaleIn relative`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-gray-300">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;

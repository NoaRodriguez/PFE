import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    isDangerous = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-800 scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDangerous ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                            {isDangerous ? (
                                <AlertTriangle className={`w-5 h-5 ${isDangerous ? 'text-red-500' : 'text-gray-900 dark:text-white'}`} />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-900 dark:border-white" />
                            )}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors text-sm text-white ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                                    : 'bg-gradient-to-r from-[#00F65C] to-[#C1FB00] text-[#292929]'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

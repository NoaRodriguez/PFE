import React from 'react';
import { Pencil, Check } from 'lucide-react';
import logo from '../../assets/8824ddb81cd37c9aee6379966a78e0022b549f27.png';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  editMode?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
}

export default function PageHeader({ title, subtitle, showLogo = true, editMode, onEdit, onSave }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-950">
      {/* Logo intégré de manière fluide */}
      {showLogo && (
        <div className="flex justify-center pt-4 pb-2">
          <img src={logo} alt="SOMA" className="h-9 w-auto" />
        </div>
      )}
      
      {/* Titre et sous-titre épurés */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
          {/* Edit/Save buttons for ProfilePage */}
          {onEdit && onSave && (
            <div>
              {!editMode ? (
                <button
                  onClick={onEdit}
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <Pencil className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
              ) : (
                <button
                  onClick={onSave}
                  className="p-2.5 bg-gradient-to-r from-[#00F65C] to-[#C1FB00] hover:opacity-90 rounded-xl transition-colors"
                >
                  <Check className="w-5 h-5 text-[#292929]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Bordure gradient subtile */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </div>
  );
}
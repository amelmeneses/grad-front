// src/components/ReservaInfoCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  className?: string;
}

const ReservaInfoCard: React.FC<Props> = ({ icon: Icon, title, subtitle, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl shadow bg-white ${className}`}
    >
      <div className="p-3 rounded-full bg-gradient-to-br from-[#0B91C1] to-[#EB752B] text-white">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-gray-900 font-semibold text-md leading-tight">{title}</span>
        <span className="text-sm text-gray-500 leading-tight">{subtitle}</span>
      </div>
    </div>
  );
};

export default ReservaInfoCard;

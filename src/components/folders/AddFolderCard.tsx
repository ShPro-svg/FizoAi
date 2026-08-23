import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddFolderCardProps {
  onClick: () => void;
  title?: string;
  subtitle?: string;
}

export const AddFolderCard: React.FC<AddFolderCardProps> = ({
  onClick,
  title = 'Add new',
  subtitle = 'Tap to get started or upload',
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-all duration-300 w-full"
    >
      <div className="aspect-[4/3.2] w-full min-h-[190px] rounded-2xl border-2 border-dashed border-emerald-400/80 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 p-5 flex flex-col justify-between transition-all shadow-xs hover:shadow-md">
        {/* Top Text Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500 max-w-[130px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Bottom Right Green Plus Button */}
        <div className="flex justify-end">
          <div className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-all">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

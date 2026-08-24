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
      <div className="aspect-[4/3.2] w-full min-h-[190px] rounded-2xl border-2 border-dashed border-[#91BEFF] hover:border-[#0064FA] bg-[#F0F7FF]/70 hover:bg-[#E1F5FF] p-5 flex flex-col justify-between transition-all shadow-xs hover:shadow-md">
        {/* Top Text Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-[#0064FA] group-hover:text-[#0053D6] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-[130px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Bottom Right Blue Plus Button */}
        <div className="flex justify-end">
          <div className="w-10 h-10 rounded-full bg-[#0064FA] hover:bg-[#0053D6] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-all">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};


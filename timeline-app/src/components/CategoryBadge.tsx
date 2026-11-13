import React from 'react';
import { 
  ShieldCheck, 
  Shirt, 
  HeartPulse, 
  GraduationCap, 
  Sparkles, 
  Apple, 
  Layers, 
  Heart,
  Trophy,
  Compass,
  Cake,
  Activity,
  Flame,
  type LucideIcon 
} from 'lucide-react';
import { 
  type ExpenseCategory, 
  type MomentTag, 
  CATEGORY_CONFIG, 
  MOMENT_TAG_CONFIG 
} from '../types';

interface BadgeProps {
  type?: 'category' | 'moment';
  category?: ExpenseCategory;
  momentTag?: MomentTag;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Shirt,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Apple,
  Layers,
  Heart,
  Trophy,
  Compass,
  Cake,
  Activity,
  Flame
};

export const CategoryBadge: React.FC<BadgeProps> = ({ 
  type = 'category',
  category, 
  momentTag,
  className = '' 
}) => {
  if (type === 'moment' && momentTag) {
    const config = MOMENT_TAG_CONFIG[momentTag] || MOMENT_TAG_CONFIG.afeto;
    const IconComponent = ICON_MAP[config.icon] || Heart;

    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wider backdrop-blur-md transition-all ${className}`}
        style={{
          color: config.color,
          borderColor: `${config.color}44`,
          backgroundColor: `${config.color}18`,
          boxShadow: `0 0 14px ${config.bgGlow}`
        }}
      >
        <IconComponent className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  }

  const cat = category || 'outros';
  const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.outros;
  const IconComponent = ICON_MAP[config.icon] || Layers;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wider backdrop-blur-md transition-all ${className}`}
      style={{
        color: config.color,
        borderColor: `${config.color}33`,
        backgroundColor: `${config.color}14`,
        boxShadow: `0 0 12px ${config.bgGlow}`
      }}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

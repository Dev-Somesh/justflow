
import React from 'react';
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <ShadcnAvatar className={sizeClasses[size]}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback className="bg-plane-purple-light text-white font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;

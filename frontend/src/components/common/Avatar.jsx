import { useState } from 'react';
import { mediaUrl } from '../../utils/mediaUrl';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };
  const sizeClass = sizes[size] || sizes.md;
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  const showImage = user?.avatar && !imgError;

  if (showImage) {
    return (
      <img
        src={mediaUrl(user.avatar)}
        alt={user.name || 'Profile'}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm ${className}`}
      aria-label={user?.name || 'User'}
    >
      {initials}
    </div>
  );
};

export default Avatar;

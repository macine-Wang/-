/**
 * 增强的动画卡片组件
 * 提供丰富的微交互动画效果
 */

import React, { useState, useRef, useEffect } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  glowEffect?: boolean;
  parallaxEffect?: boolean;
  clickAnimation?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverScale = 1.02,
  hoverRotate = 0,
  glowEffect = false,
  parallaxEffect = false,
  clickAnimation = true,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 鼠标移动视差效果
  useEffect(() => {
    if (!parallaxEffect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setMousePosition({ x: deltaX * 10, y: deltaY * 10 });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove);
      cardRef.current?.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, parallaxEffect]);

  // 点击动画
  const handleClick = () => {
    if (!clickAnimation) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  const cardStyle = {
    transform: `
      scale(${isHovered ? hoverScale : 1})
      rotate(${isHovered ? hoverRotate : 0}deg)
      translate3d(${parallaxEffect ? mousePosition.x : 0}px, ${parallaxEffect ? mousePosition.y : 0}px, 0)
      ${isClicked ? 'scale(0.98)' : ''}
    `,
    transition: isClicked 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animationDelay: `${delay}ms`
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden cursor-pointer
        ${glowEffect ? 'hover:shadow-2xl hover:shadow-primary-500/20' : ''}
        ${className}
      `}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* 发光效果 */}
      {glowEffect && (
        <div 
          className={`
            absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 
            opacity-0 transition-opacity duration-300 ease-out
            ${isHovered ? 'opacity-100' : ''}
          `}
        />
      )}
      
      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 悬停光晕效果 */}
      {isHovered && glowEffect && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                     animate-pulse pointer-events-none"
        />
      )}
    </div>
  );
};

// 淡入动画组件
interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up': return 'translate3d(0, 30px, 0)';
      case 'down': return 'translate3d(0, -30px, 0)';
      case 'left': return 'translate3d(30px, 0, 0)';
      case 'right': return 'translate3d(-30px, 0, 0)';
      default: return 'translate3d(0, 30px, 0)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
      }}
    >
      {children}
    </div>
  );
};

// 脉冲动画组件
interface PulseProps {
  children: React.ReactNode;
  intensity?: 'subtle' | 'normal' | 'strong';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  intensity = 'normal',
  speed = 'normal',
  className = ''
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'subtle': return 'animate-pulse opacity-75';
      case 'normal': return 'animate-pulse';
      case 'strong': return 'animate-pulse opacity-50';
      default: return 'animate-pulse';
    }
  };

  const getSpeedClass = () => {
    switch (speed) {
      case 'slow': return 'animation-duration-3000';
      case 'normal': return 'animation-duration-2000';
      case 'fast': return 'animation-duration-1000';
      default: return '';
    }
  };

  return (
    <div className={`${getIntensityClass()} ${getSpeedClass()} ${className}`}>
      {children}
    </div>
  );
};

// 弹跳加载动画组件
export const BounceLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
  size = 'md',
  color = 'bg-primary-500'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${color} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

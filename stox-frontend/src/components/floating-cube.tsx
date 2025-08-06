import React from 'react';

const FloatingCube = () => {
  return (
    <div className="relative flex items-center justify-center h-80 w-80 mx-auto">
      {/* Floating animation container */}
      <div className="animate-float">
        {/* 3D Cube container */}
        <div className="cube-container relative transform-gpu">
          <div className="cube relative w-48 h-48 transform-style-preserve-3d">
            {/* Front face */}
            <div className="cube-face cube-face-front bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-2xl">
            </div>
            
            {/* Back face */}
            <div className="cube-face cube-face-back bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
            </div>
            
            {/* Right face */}
            <div className="cube-face cube-face-right bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg">
            </div>
            
            {/* Left face */}
            <div className="cube-face cube-face-left bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 shadow-inner">
            </div>
            
            {/* Top face */}
            <div className="cube-face cube-face-top bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 shadow-sm">
              {/* First diagonal line */}
              <div className="diagonal-line diagonal-line-1"></div>
              {/* Second diagonal line */}
              <div className="diagonal-line diagonal-line-2"></div>
            </div>
            
            {/* Bottom face */}
            <div className="cube-face cube-face-bottom bg-gradient-to-br from-orange-700 via-orange-800 to-orange-900 shadow-2xl">
            </div>
          </div>
        </div>
      </div>
      
      {/* Realistic shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-32 h-8 bg-black/10 rounded-full blur-md"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-3xl blur-2xl -z-10"></div>
    </div>
  );
};

export default FloatingCube; 
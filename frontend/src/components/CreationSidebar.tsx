import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface CreationSidebarProps {
  openGuideModal: () => void;
}

const CreationSidebar: React.FC<CreationSidebarProps> = ({ openGuideModal }) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 390);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleExitClick = async () => {
    const result = await Swal.fire({
      title: 'Exit to all actions?',
      text: 'Any unsaved changes will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, exit',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'font-semibold cursor-pointer bg-[#8D51FF] hover:bg-[#7F22FE] text-white px-4 py-2 rounded duration-200 ease',
        cancelButton: 'ml-3 font-semibold cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded duration-200 ease'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      navigate('/action-dashboard');
    }
  };

  const textStyle = {
    fontSize: isSmallScreen ? '16px' : '',
  };
  
  const iconStyle = {
    width: isSmallScreen ? '18px' : '',
    height: isSmallScreen ? '18px' : '',
  };

  return (
    <>
      <div 
        className="absolute top-2 right-2 z-50 cursor-pointer flex bg-black p-4 items-center text-white font-semibold text-lg md:text-base lg:text-xl rounded-lg shadow-md hover:text-gray-300 transition-colors"
        onClick={openGuideModal}
      >
        <span className="font-semibold text-base md:text-base lg:text-xl" style={textStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="inline-block mr-1 -mt-0.5 w-5 h-5 md:w-6 md:h-6" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          How to use
        </span>
      </div>
      <div 
        className="absolute top-2 left-2 z-50 cursor-pointer flex bg-black p-4 items-center text-white font-semibold text-lg md:text-base lg:text-xl rounded-lg shadow-md hover:text-gray-300 transition-colors"
        onClick={handleExitClick}
      >
        <span className="font-semibold text-base md:text-base lg:text-xl" style={textStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="inline-block mr-1 -mt-0.5 w-5 h-5 md:w-6 md:h-6" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
          Exit to all actions
        </span>
      </div>
    </>
  );
};

export default CreationSidebar; 
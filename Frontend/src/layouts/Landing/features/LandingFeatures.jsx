// import React, { useState } from 'react';
// import GSTIN from './GSTIN';
// import CODES from './HSN-SAC CODES';
// import INVOICES from './INVOICES';
// import TAXES from './TAXES';
// import BILLS from './E-WAY BILLS';
// import DELIVERYCHALLAN from './DELIVERY CHALLAN';
// import Navbar from './navbar';

// const LandingFeatures = () => {
//   const [activeContent, setActiveContent] = useState(0);

//   const renderContent = () => {
//     switch (activeContent) {
//       case 0:
//         return <GSTIN />;
//       case 1:
//         return <CODES />;
//       case 2:
//         return <INVOICES />;
//       case 3:
//         return <TAXES />;
//       case 4:
//         return <BILLS/>
//       case 5:
//         return <DELIVERYCHALLAN />;
//       default:
//         return <GSTIN />;
//     }
//   };
//   return (
//     <>
//       <Navbar setActiveContent={setActiveContent} />
//       <div className="content-container">
//         {renderContent()}
//       </div>
//     </>
//   );
// };

// export default LandingFeatures;

import React, { useState, useEffect, useRef } from 'react';
import GSTIN from './GSTIN';
import CODES from './HSN-SAC CODES';
import INVOICES from './INVOICES';
import TAXES from './TAXES';
import BILLS from './E-WAY BILLS';
import DELIVERYCHALLAN from './DELIVERY CHALLAN';
import Navbar from './navbar';

const LandingFeatures = () => {
  const [activeContent, setActiveContent] = useState(0);
  const [isGSTINVisible, setIsGSTINVisible] = useState(false);
  const gstinRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsGSTINVisible(true);
          } else {
            setIsGSTINVisible(false);  // Optionally reset animation if div is not visible
          }
        });
      },
      {
        threshold: 0.3, // Adjust the threshold to trigger the animation when 30% of the div is visible
      }
    );

    if (gstinRef.current) {
      observer.observe(gstinRef.current);
    }

    return () => {
      if (gstinRef.current) {
        observer.unobserve(gstinRef.current);
      }
    };
  }, []);

  const handleButtonClick = (index) => {
    setActiveContent(index);
    if (index === 0) {
      setIsGSTINVisible(true);
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case 0:
        return <div ref={gstinRef}><GSTIN triggerAnimation={isGSTINVisible} /></div>;
      case 1:
        return <CODES />;
      case 2:
        return <INVOICES />;
      case 3:
        return <TAXES />;
      case 4:
        return <BILLS/>
      case 5:
        return <DELIVERYCHALLAN />;
      default:
        return <GSTIN />;
    }
  };

  return (
    <>
      <Navbar setActiveContent={handleButtonClick} />
      <div className="content-container">
        {renderContent()}
      </div>
    </>
  );
};

export default LandingFeatures;

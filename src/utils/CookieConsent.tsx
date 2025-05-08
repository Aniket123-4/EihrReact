import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './CookieConsent.css';

const CookieConsent: React.FC = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {

    const cookieConsent = sessionStorage.getItem('cookieConsent');


    if (!cookieConsent) {
      setShowCookieBanner(true);
    } else {

      setShowCookieBanner(false);
    }
  }, []);

  const handleAcceptCookies = () => {

    Cookies.set('cookieConsent', 'true', { expires: 365 });


    sessionStorage.setItem('cookieConsent', 'true');

    setShowCookieBanner(false);
  };

  const handleDeclineCookies = () => {

    Cookies.set('cookieConsent', 'false', { expires: 365 });


    sessionStorage.setItem('cookieConsent', 'false');

    setShowCookieBanner(false);
  };

  return (
    <>
      {showCookieBanner && (
        <div className={`cookie-banner ${showCookieBanner ? 'show' : ''}`}  >
          <div className="overlay" onClick={handleDeclineCookies}></div> {/* Overlay for focus */}
          <div className="cookie-content">
            <div className="cookie-header">
              <img src="https://img.icons8.com/ios-filled/50/ffffff/cookie.png" alt="Cookie Icon" />
              <span className="close-btn" onClick={() => setShowCookieBanner(false)}>×</span>
            </div>
            <p className="cookie-message">
              We use cookies to enhance your experience and analyze site usage. By accepting, you agree to our cookie policy.
            </p>
            <div className="cookie-buttons">
              <button className="accept-btn" onClick={handleAcceptCookies}>Accept</button>
              <button className="decline-btn" onClick={handleDeclineCookies}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;

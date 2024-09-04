import { useEffect, useState } from "react";

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSafariMobile, setIsSafariMobile] = useState(false);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  useEffect(() => {
    if (isUserAgentSafariMobile()) {
      setIsSafariMobile(true);
    } else {
      setIsSafariMobile(false);
    }
  }, []);

  function isUserAgentSafariMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    return isSafari && isIos;
  }

  return isOnline ? null : (
    <div
      className={`bottom-0 fixed left-2 flex gap-x-2 bg-red-600 text-white right-2 rounded-t items-center justify-center px-2 py-0.5 z-10 border border-red-800`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="#FFFFFF"
      >
        <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
      </svg>
      Network connection lost {!isSafariMobile && ". Some features are not available."}
    </div>
  );
};

export default NetworkStatus;

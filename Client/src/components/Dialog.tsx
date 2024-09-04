import { useEffect, useState } from "react";
import "../styles/styles.css";

interface DialogProps extends React.PropsWithChildren {
  close?: (...args: Array<any>) => any;
  submit?: (...args: Array<any>) => any;
  submitParams?: Array<any>;
  closeParams?: Array<any>;
  closeText?: string;
  submitText?: string;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  close,
  submit,
  submitParams,
  closeParams,
  closeText,
  submitText,
}) => {
  const [safariMobileStyles, setSafariMobileStyles] = useState<React.CSSProperties>();

  useEffect(() => {
    if (isUserAgentSafariMobile()) {
      setSafariMobileStyles({
        display: "absolute",
        width: "85%",
        maxHeight: "90%",
        overflow: "auto",
      });
    } else {
      setSafariMobileStyles(undefined);
    }
  }, []);

  function isUserAgentSafariMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    return isSafari && isIos;
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-30 h-full w-full overflow-hidden bg-black opacity-75" />
      <div
        className={`centre-fixed-dialog ios-scroll fixed z-40 w-5/6 overflow-auto rounded ${
          !close &&
          !submit &&
          !submitParams &&
          !closeParams &&
          !submitText &&
          !closeText &&
          "border border-white"
        }`}
        style={{ maxHeight: "90vh", ...safariMobileStyles }}
      >
        <div
          id="dialog"
          className={
            !close && !submit && !submitParams && !closeParams && !submitText && !closeText
              ? "h-full w-full overflow-auto ios-scroll z-50"
              : "m-auto w-max max-w-72 rounded border border-white bg-gray-950 p-4 text-center text-white shadow shadow-white md:max-w-96 ios-scroll"
          }
        >
          {children}

          {(close || submit) && (
            <div className="mt-2 flex justify-center gap-2">
              {close && (
                <button
                  type="button"
                  className="flex w-24 justify-center gap-1 rounded bg-red-700 px-3 py-1 hover:bg-red-800"
                  onClick={() => {
                    if (Array.isArray(closeParams)) close(...closeParams);
                    else close();
                  }}
                >
                  {closeText || null}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                    className="mt-0.5"
                  >
                    <path d="m339-288 141-141 141 141 51-51-141-141 141-141-51-51-141 141-141-141-51 51 141 141-141 141 51 51ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
                  </svg>
                </button>
              )}

              {submit && (
                <button
                  type="button"
                  className="flex w-24 justify-center gap-1 rounded bg-green-700 px-3 py-1 hover:bg-green-800"
                  onClick={async () => {
                    if (Array.isArray(submitParams)) await submit(...submitParams);
                    else await submit();

                    if (close && Array.isArray(closeParams)) close(...closeParams);
                    else if (close) close();
                  }}
                >
                  {submitText || "Yes"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                    className="mt-0.5"
                  >
                    <path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dialog;

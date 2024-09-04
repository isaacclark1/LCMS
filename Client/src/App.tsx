import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import amplifyconfig from "../aws-amplify/aws-amplify-config";
import { Outlet, NavLink } from "react-router-dom";
import "./styles/Authenticator.css";
import { createContext, useEffect, useState } from "react";
import logo from "./assets/DLC-logo-white-no-background.png";
import NetworkStatus from "./components/NetworkStatus";
import { getUserGroup as _getUserGroup } from "../api/api";

Amplify.configure(amplifyconfig);

export const UserContext = createContext<{ userType: "StaffMember" | "Manager" }>({
  userType: "StaffMember",
});

const App: React.FC = () => {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  const [userType, setUserType] = useState<"Manager" | "StaffMember">("StaffMember");
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  // Prevent forms from submiting when enter is pressed.
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const target = event.target as HTMLElement;
        const form = target.closest("form");

        form && event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleEnter);

    return () => document.removeEventListener("keydown", handleEnter);
  }, []);

  useEffect(() => {
    getUserGroup();

    return () => setUserType("StaffMember");
  }, [user]);

  const linkStyle = "mb-0.5 block rounded px-2 py-1 hover:bg-blue-800";
  const linkStyleActive = "mb-0.5 block rounded bg-blue-800 px-2 py-1";

  const handleIsNavigationHidden = () => {
    if (isNavigationHidden) setIsNavigationHidden(false);
    else setIsNavigationHidden(true);
  };

  const getUserGroup = () => {
    _getUserGroup().then((typeOfUser) => {
      setUserType(typeOfUser);
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto bg-slate-950 font-sans lg:flex-row">
      <UserContext.Provider value={{ userType }}>
        <NetworkStatus />
        {isNavigationHidden && (
          <div className="ml-2 lg:pb-10 mr-2 mt-2 rounded border border-slate-600 bg-slate-900 p-2 lg:my-2 lg:ml-2 lg:mr-1 lg:flex lg:flex-col lg:px-2 lg:py-4">
            <button
              type="button"
              className="mt-1 rounded p-0.5 hover:bg-blue-700 lg:mb-2 lg:w-max"
              onClick={handleIsNavigationHidden}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </button>
          </div>
        )}

        {!isNavigationHidden && (
          <nav className="mx-2 lg:pb-10 mt-2 flex flex-col rounded border border-slate-600 bg-slate-900 p-2 text-white lg:my-2 lg:ml-2 lg:mr-1 lg:w-64 lg:min-w-64 lg:px-2 lg:py-4">
            <button
              type="button"
              className="mt-1 w-max rounded p-0.5 hover:bg-blue-700 lg:mb-2"
              onClick={handleIsNavigationHidden}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </button>

            <div className="flex flex-wrap items-center justify-between">
              <p className="w-max text-sm">{user?.username || ""}</p>

              <button
                type="button"
                onClick={signOut}
                className="w-max rounded px-2 py-0.5 hover:bg-red-600"
              >
                Sign out
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#FFFFFF"
                  className="mb-0.5 ml-1 inline"
                >
                  <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h264v72H216Zm432-168-51-51 81-81H384v-72h294l-81-81 51-51 168 168-168 168Z" />
                </svg>
              </button>
            </div>

            <div className="mx-auto max-w-60">
              <img src={logo} alt="Dolphin Leisure Centre Logo" />
            </div>

            <ul className="text-center lg:text-left">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? linkStyleActive : linkStyle)}
                >
                  Cleaning Task Lists
                </NavLink>
              </li>
              {userType === "Manager" && (
                <li>
                  <NavLink
                    to="/cleaningTaskTemplateLists"
                    className={({ isActive }) => (isActive ? linkStyleActive : linkStyle)}
                  >
                    Cleaning Task Template Lists
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        )}

        <main className="my-2 ml-2 mr-2 flex-grow rounded border border-slate-600 bg-slate-800 p-4 lg:ml-1 lg:overflow-y-auto pb-10">
          <Outlet />
        </main>
      </UserContext.Provider>
    </div>
  );
};

export default App;

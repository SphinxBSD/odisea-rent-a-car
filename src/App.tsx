import { Button, Layout, Profile } from "@stellar/design-system";
import { Outlet, Route, Routes } from "react-router-dom";
import AccountManager from "./components/AccountManager";
import { NavLink } from "react-router-dom";
import { useStellarAccounts } from "./providers/StellarAccountProvider";
import { shortenAddress } from "./utils/shorten-address";
import ConnectWallet from "./pages/ConnectWallet";
import Dashboard from "./pages/Dashboard";
import RoleSelection from "./pages/RoleSelection";

const AppLayout: React.FC = () => {
  const { walletAddress, selectedRole } = useStellarAccounts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Layout.Header
        projectId="My App"
        projectTitle="Rent a car"
        contentCenter={
          <nav className="flex justify-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg overflow-hidden group ${
                  isActive
                    ? "text-white"
                    : "text-gray-700 hover:text-emerald-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 animate-gradient"></span>
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  )}
                  <span className="relative flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Connect Wallet
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/role-selection"
              className={({ isActive }) =>
                `relative px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg overflow-hidden group ${
                  isActive ? "text-white" : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-gradient"></span>
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  )}
                  <span className="relative flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Select Role
                  </span>
                </>
              )}
            </NavLink>

            {selectedRole && (
              <NavLink
                to="/cars"
                className={({ isActive }) =>
                  `relative px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg overflow-hidden group ${
                    isActive
                      ? "text-white"
                      : "text-gray-700 hover:text-emerald-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient"></span>
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    )}
                    <span className="relative flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      Car List
                    </span>
                  </>
                )}
              </NavLink>
            )}
          </nav>
        }
        contentRight={
          <nav>
            {walletAddress && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-lg opacity-25 group-hover:opacity-75 blur transition-all duration-300"></div>
                <Button variant="tertiary" size="md" className="relative">
                  <Profile
                    publicAddress={shortenAddress(walletAddress)}
                    size="md"
                  />
                </Button>
              </div>
            )}
          </nav>
        }
      />

      <div className="min-h-[65vh] relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <Outlet />
      </div>

      <Layout.Footer>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              © {new Date().getFullYear()} My App. Licensed under the{" "}
              <a
                href="http://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-emerald-600 font-medium transition-colors duration-200 underline decoration-dotted"
              >
                Apache License, Version 2.0
              </a>
              .
            </span>
          </div>
        </div>
      </Layout.Footer>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
};

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ConnectWallet />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/cars" element={<Dashboard />} />
        <Route path="/horizon-example" element={<AccountManager />} />
      </Route>
    </Routes>
  );
}

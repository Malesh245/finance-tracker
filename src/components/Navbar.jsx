"use client";

import { useContext } from "react";
import { authContext } from "@/lib/store/auth-context";
import { ImStatsBars } from "react-icons/im";

export default function Navbar() {
  const { user, loading, logout } = useContext(authContext);

  return (
    <header className="container max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between">
        {/* user info */}
        {user && !loading && (
          <div className="flex items-center gap-2">
            {/* user image */}
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img
                src={user.photoURL}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className=" w-full h-full object-fill"
              />
            </div>
            {/* user name */}
            <small>Hi, {user.displayName}!</small>
          </div>
        )}

        {/* right side of navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <div>
              <ImStatsBars className="text-2xl" />
            </div>
            <div>
              <button onClick={logout} className="btn btn-danger">
                Sign out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

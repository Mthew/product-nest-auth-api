import { useState } from "react";
import { User, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import { UserAuth } from "../../../modules/auth/domain/entities/user.entity";
import { Button } from "../../ui/button";

interface UserNavProps {
  user: UserAuth | null;
  onLogout: () => Promise<void>;
}

export function UserNav({ user, onLogout }: UserNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleIcon = () => {
    return user.role === "Admin" ? (
      <Shield className="h-3 w-3 text-red-600" />
    ) : (
      <User className="h-3 w-3 text-blue-600" />
    );
  };

  const getRoleColor = () => {
    return user.role === "Admin" ? "text-red-600" : "text-blue-600";
  };

  const getInitials = () => {
    return user.email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative h-10 w-auto px-3"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {getInitials()}
            </span>
          </div>

          {/* User Info */}
          <div className="hidden md:flex flex-col items-start">
            <p className="text-sm font-medium leading-none">
              {user.email.split("@")[0]}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              {getRoleIcon()}
              <p className={`text-xs ${getRoleColor()}`}>{user.role}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu Content */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon()}
                    <p className={`text-xs ${getRoleColor()}`}>{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
                disabled
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </button>

              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-not-allowed opacity-50"
                disabled
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

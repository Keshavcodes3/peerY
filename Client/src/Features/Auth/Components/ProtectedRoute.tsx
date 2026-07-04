import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

/**
 * Route guard. Waits for the initial session-restore to finish, then either
 * renders the nested routes or redirects to /login (preserving the target
 * location so we can bounce the user back after they authenticate).
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isInitialized) {
        return (
            <div className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-400">
                <div className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500" />
                    Loading…
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

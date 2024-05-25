import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../axios/axiosInstance";

const ProtectedRoutesWrapper = () => {
    const user = getUserRole();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {user ? (
                <>
                    <aside className="bg-white w-full md:w-1/4 lg:w-1/6 p-4 md:p-6 border-b md:border-r md:sticky md:top-0">
                        <div className="flex flex-col gap-4">
                            {user === "Seller" ? (
                                <Link
                                    to="/sellerproperty"
                                    className="px-4 py-2 font-semibold text-gray-700 hover:bg-indigo-50 rounded-md transition text-center"
                                >
                                    Seller Property
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/property/interested"
                                        className="px-4 py-2 font-semibold text-gray-700 hover:bg-indigo-50 rounded-md transition"
                                    >
                                        Interested Property
                                    </Link>
                                    <Link
                                        to="/property"
                                        className="px-4 py-2 font-semibold text-gray-700 hover:bg-indigo-50 rounded-md transition"
                                    >
                                        Property
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="mt-4 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-md transition"
                            >
                                Log Out
                            </button>
                        </div>
                    </aside>

                    <main className="flex-1 p-4 md:p-6">
                        <Outlet />
                    </main>
                </>
            ) : (
                <Navigate to="/login" replace={true} />
            )}
        </div>
    );
};

export default ProtectedRoutesWrapper;

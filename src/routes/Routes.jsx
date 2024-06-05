import { createHashRouter } from "react-router-dom";
import Property from "../pages/Property/Property";
import Login from "../pages/Login/Login";
import ProtectedRoutesWrapper from "../components/ProtectedRoutesWrapper";
import Register from "../pages/Register/Register";
import AddProperty from "../components/AddProperty";
import EditProperty from "../components/EditProperty";
import SellerProperty from "../pages/Property/SellerProperty";
import InterestedProperty from "../pages/Property/InterestedProperty";

const router = createHashRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <ProtectedRoutesWrapper />,
        children: [
            {
                path: "/property",
                element: <Property />,
            },
            {
                path: "/property/interested",
                element: <InterestedProperty />,
            },
            {
                path: "/sellerproperty",
                element: <SellerProperty />,
            },
            {
                path: "/property/add",
                element: <AddProperty />,
            },
            {
                path: "/sellerproperty/:id",
                element: <EditProperty />,
            },
        ],
    },
]);

export default router;
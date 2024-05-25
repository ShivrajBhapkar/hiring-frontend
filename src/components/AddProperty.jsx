import { getUserRole } from "../axios/axiosInstance.jsx";
import { useEffect } from "react";
import PropertyForm from "./PropertyForm.jsx";
import { useNavigate } from "react-router-dom";
const AddProperty = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const userRole = getUserRole();
        // If the user role is "Buyer", navigate to the /property page
        if (userRole === "Buyer") {
            navigate("/property");
        }
    }, []);

    return (
        <div className="w-full">
            <h1 className="my-heading">Add Property</h1>
            <PropertyForm />
        </div>
    );
};

export default AddProperty;

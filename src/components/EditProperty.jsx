import PropertyForm from "./PropertyForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axiosInstance";
const EditProperty = () => {
    const { id } = useParams();
    // Function to fetch property details by ID
    const fetchPropertyById = async () => {
        try {
            const res = await axiosInstance.get(`seller/getProperty/${id}`);
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // Use the useQuery hook to fetch data
    const { data, error, isLoading } = useQuery({
        queryFn: () => fetchPropertyById(),
        queryKey: ["propertyById", id],
    });
    // Display loading message while data is being fetched
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div className="w-full">
            <h1 className="my-heading">Edit Property</h1>
            <PropertyForm {...data?.data} isEditing={true} />{" "}
            {/* Render the PropertyForm component with fetched data and isEditing flag */}
        </div>
    );
};

export default EditProperty;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard";
import axiosInstance from "../../axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {
    getUserRole,
} from "../../axios/axiosInstance";
const SellerProperty = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === "Buyer") {
            navigate("/property");
        }
    }, [navigate]);

    const fetchProperties = async () => {
        try {
            const res = await axiosInstance.get("/seller/getProperties");
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const { data } = useQuery({
        queryKey: ["properties"],
        queryFn: () => fetchProperties(),
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-4">
                <div></div>{" "}
                <button
                    onClick={() => navigate("/property/add")}
                    className="my-btn"
                    type="button"
                >
                    Add Property
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.data &&
                    data?.data?.map((property) => (
                        <PropertyCard key={property?._id} {...property} />
                    ))}
            </div>
        </div>
    );
};

export default SellerProperty;

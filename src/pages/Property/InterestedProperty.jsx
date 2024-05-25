import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InterestedPropertyCard from "../../components/InterestedPropertyCard";
import axiosInstance from "../../axios/axiosInstance";
import { getUserRole } from "../../axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "../../axios/axiosInstance";
import Loader from "../../components/Loader";
const InterestedProperty = () => {
    const navigate = useNavigate();
    // Redirect user if they are a Seller
    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === "Seller") {
            navigate("/properties");
        }
    }, [navigate]);
    // Fetch interested properties of the user
    const fetchInterestedProperties = async () => {
        try {
            const userId = getUserId();
            const res = await axiosInstance.get(
                `/buyer/getInterestedProperties/${userId}`
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const { data, isLoading } = useQuery({
        queryFn: () => fetchInterestedProperties(),
        queryKey: ["interested-properties"],
    });

    return (
        <div>
            {isLoading ? (
                <div className="flex w-full justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data?.data &&
                        data?.data?.map((property) => (
                            <InterestedPropertyCard
                                key={property?._id}
                                {...property}
                                isBuyer={true}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default InterestedProperty;

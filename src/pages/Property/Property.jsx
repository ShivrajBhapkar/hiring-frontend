import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard";
import axiosInstance from "../../axios/axiosInstance";
import { getUserRole } from "../../axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";

const Property = () => {
    const navigate = useNavigate();
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === "Seller") {
            navigate("/sellerProperty");
        }
    }, [navigate]);

    // Function to fetch properties data
    const fetchProperties = async () => {
        try {
            const res = await axiosInstance.get("/buyer/getProperties");
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const { data, isLoading } = useQuery({
        queryFn: fetchProperties,
        queryKey: ["propertyById"],
    });

    // Extract unique filter options for country, city, and state
    const uniqueCountries = [
        ...new Set(data?.data?.map((property) => property.address.country)),
    ];
    const uniqueCities = [
        ...new Set(data?.data?.map((property) => property.address.city)),
    ];
    const uniqueStates = [
        ...new Set(data?.data?.map((property) => property.address.state)),
    ];
    // Handle changes for the filter options
    const handleCountryChange = (e) => setCountry(e.target.value);
    const handleCityChange = (e) => setCity(e.target.value);
    const handleStateChange = (e) => setState(e.target.value);

    // Filter properties based on the selected filters
    const filteredProperties = data?.data?.filter((property) => {
        return (
            (!country || property.address.country === country) &&
            (!city || property.address.city === city) &&
            (!state || property.address.state === state)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-4">
                <select
                    value={country}
                    onChange={handleCountryChange}
                    className="mr-2 p-2 border rounded"
                >
                    <option value="">All Countries</option>
                    {uniqueCountries.map((countryOption, index) => (
                        <option key={index} value={countryOption}>
                            {countryOption}
                        </option>
                    ))}
                </select>
                <select
                    value={city}
                    onChange={handleCityChange}
                    className="mr-2 p-2 border rounded"
                >
                    <option value="">All Cities</option>
                    {uniqueCities.map((cityOption, index) => (
                        <option key={index} value={cityOption}>
                            {cityOption}
                        </option>
                    ))}
                </select>
                <select
                    value={state}
                    onChange={handleStateChange}
                    className="p-2 border rounded"
                >
                    <option value="">All States</option>
                    {uniqueStates.map((stateOption, index) => (
                        <option key={index} value={stateOption}>
                            {stateOption}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? (
                <div className="flex w-full justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
                            <PropertyCard
                                key={property?._id}
                                {...property}
                                isBuyer={true}
                                className="transition transform hover:scale-105 hover:shadow-lg"
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center items-center">
                            <div className="p-6 border rounded-lg shadow-lg bg-white">
                                <h2 className="text-2xl font-semibold mb-2">
                                    No properties found
                                </h2>
                                <p className="text-gray-600">
                                    Try adjusting your filters to find
                                    properties that match your criteria.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Property;

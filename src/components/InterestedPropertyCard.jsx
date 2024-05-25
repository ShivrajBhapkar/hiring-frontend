import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole, getUserId } from "../axios/axiosInstance";
import axiosInstance from "../axios/axiosInstance";
const InterestedPropertyCard = ({
    title,
    description,
    address,
    price,
    bedrooms,
    availabilityDate,
    likes,
}) => {
    const navigate = useNavigate();

    // fetch properties
    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === "Seller") {
            navigate("/properties");
        }
    }, [navigate]);

    const [isOpen, setIsOpen] = useState(false);
    const [ownerDetails, setOwnerDetails] = useState();
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);
    // Function to fetch owner details
    const fetchOwnerDetails = async () => {
        try {
            const userId = getUserId();
            const res = await axiosInstance.get(
                `/buyer/getOwnerDetails/${userId}`
            );
            setOwnerDetails(res.data.data);
            openDialog();
            return res.data.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // Function to render the owner details dialog
    const renderDialog = () => (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="bg-gray-500 opacity-75 fixed inset-0"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-6 py-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Owner Details
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Name: {ownerDetails.user_name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Email: {ownerDetails.user_email}
                        </p>
                        <p className="text-sm text-gray-500">
                            Mobile: {ownerDetails.user_mobile}
                        </p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={closeDialog}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
    return (
        <div className="p-4 max-w-md">
            <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <img
                    className="h-48 w-full object-cover object-center"
                    src="https://dummyimage.com/720x400"
                    alt="blog"
                />
                <div className="p-6">
                    {/* title */}
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                        <span className="font-bold"> Title : </span> {title}
                    </h2>

                    {/* description */}
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                        <span className="font-bold"> Description : </span>{" "}
                        {description}
                    </h1>

                    <p>
                        <span className="font-bold"> Price : </span> ${price}
                    </p>

                    <p>
                        <span className="font-bold"> Bedrooms : </span>{" "}
                        {bedrooms}
                    </p>
                    <p className="mb-1">
                        Availability:{" "}
                        {new Date(availabilityDate).toLocaleDateString()}
                    </p>

                    {/* address */}
                    <p className="leading-relaxed my-3 mb-3">
                        <span className="font-bold"> Address : </span>{" "}
                        {address?.street +
                            " ,  " +
                            address?.city +
                            " , " +
                            address?.state +
                            " , " +
                            address?.country}
                    </p>
                    <div className="flex  items-center flex-wrap">
                        <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                            <svg
                                className="w-4 h-4 mr-1"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            {likes.length} Likes
                        </span>
                    </div>
                    <button
                        onClick={fetchOwnerDetails}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Owner Details
                    </button>
                    {isOpen && ownerDetails && renderDialog()}
                </div>
            </div>
        </div>
    );
};
export default InterestedPropertyCard;

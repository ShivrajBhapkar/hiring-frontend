import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance, { getUserId } from "../axios/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
const PropertyCard = ({
    _id,
    title,
    description,
    address,
    price,
    bedrooms,
    amenities,
    availabilityDate,
    likes,
    interested,
    isBuyer = false,
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    useEffect(() => {
        // Check if _id is in likes array
        if (likes.includes(_id)) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [likes, _id]);

    useEffect(() => {
        const userId = getUserId();
        if (interested.includes(userId)) {
            setIsInterested(true);
        } else {
            setIsInterested(false);
        }
    }, []);

    // Function to delete the property
    const deleteProperty = async () => {
        try {
            const res = await axiosInstance.delete(
                `/seller/deleteProperty/${_id}`
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // useMutation hook to handle the delete property mutation
    const { mutate: mutateDeleteProperty, isPending: isDeletingProperty } =
        useMutation({
            mutationKey: "delete-property",
            mutationFn: () => deleteProperty(),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["properties"] });
            },
        });
    // Function to like the property
    const likeProperty = async () => {
        try {
            const res = await axiosInstance.post(
                `/buyer/likeProperty/${_id}`,
                {}
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // Function to show interest in the property
    const ShowInterestProperty = async () => {
        try {
            const userId = getUserId();
            const res = await axiosInstance.post(
                `/buyer/${userId}/imInterested/${_id}`,
                {}
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // Function to unlike the property
    const unlikeProperty = async () => {
        try {
            const res = await axiosInstance.post(
                `/buyer/unlikeProperty/${_id}`,
                {}
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    // useMutation hook to handle the like/unlike property mutation
    const { mutate: mutateLikeProperty, isPending: isLikingOrUnLiking } =
        useMutation({
            mutationFn: () => (isLiked ? unlikeProperty() : likeProperty()),
            mutationKey: "like-property",
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["propertyById"] });
            },
        });

    // useMutation hook to handle the show interest mutation
    const { mutate: mutateImInterested, isPending: isInterestingPending } =
        useMutation({
            mutationFn: () => ShowInterestProperty(),
            mutationKey: "interested-property",
            onSuccess: () => {
                setIsInterested(true);
                queryClient.invalidateQueries({ queryKey: ["propertyById"] });
            },
        });
    return (
        <div className="max-w-sm w-full p-4">
            <div className="bg-white h-full border border-gray-200 rounded-lg overflow-hidden shadow-md flex flex-col">
                <img
                    className="h-48 w-full object-cover"
                    src="https://dummyimage.com/720x400"
                    alt="property"
                />
                <div className="p-6 flex-grow">
                    <h2 className="text-xs font-medium text-gray-400 mb-1">
                        Title: {title}
                    </h2>
                    <h1 className="text-lg font-medium text-gray-900 mb-3">
                        Description: {description}
                    </h1>
                    <p className="mb-1">Price: ₹{price}</p>
                    <p className="mb-1">Bedrooms: {bedrooms}</p>
                    <p className="mb-1">Amenities:{amenities} </p>
                    <p className="mb-1">
                        Availability:{" "}
                        {new Date(availabilityDate).toLocaleDateString()}
                    </p>
                    <p className="leading-relaxed mb-3">
                        Address: {address?.street}, {address?.city},{" "}
                        {address?.state}, {address?.country}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
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
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-50">
                    {isBuyer ? (
                        <>
                            <button
                                onClick={mutateImInterested}
                                className={`text-sm font-semibold py-2 px-4 rounded ${
                                    isInterested
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                                disabled={isInterested}
                            >
                                {isInterested
                                    ? "Showed Interest"
                                    : "I'm Interested"}
                                {isInterestingPending && <Spinner />}
                            </button>
                            <button
                                onClick={mutateLikeProperty}
                                className="text-sm font-semibold py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                {isLiked ? "Unlike" : "Like"}
                                {isLikingOrUnLiking && <Spinner />}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    navigate(`/sellerProperty/${_id}`)
                                }
                                className="text-sm font-semibold py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={mutateDeleteProperty}
                                className="text-sm font-semibold py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                                {isDeletingProperty && <Spinner />}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;

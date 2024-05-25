import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axiosInstance from "../axios/axiosInstance";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
// Define validation schema using Yup
const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
    price: Yup.number().required("Price is required").positive().integer(),
    bedrooms: Yup.number()
        .required("Number of bedrooms is required")
        .positive()
        .integer(),
    bathrooms: Yup.number()
        .required("Number of bathrooms is required")
        .positive()
        .integer(),
    squareFeet: Yup.number()
        .required("Square feet is required")
        .positive()
        .integer(),
    amenities: Yup.string().required("Amenities are required"),
    availabilityDate: Yup.date().required("Availability date is required"),
});
const PropertyForm = ({
    title = "",
    description = "",
    address = "",
    price = "",
    bedrooms = "",
    bathrooms = "",
    squareFeet = "",
    amenities = "",
    availabilityDate = "",
    isEditing = false,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    // for add
    const queryClient = useQueryClient();

    // Function to add a property
    const addProperty = async (values) => {
        try {
            const res = await axiosInstance.post("/seller/addProperty", {
                title: values.title,
                description: values.description,
                address: {
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    postalCode: values.postalCode,
                },
                price: values.price,
                bedrooms: values.bedrooms,
                bathrooms: values.bathrooms,
                squareFeet: values.squareFeet,
                amenities: values.amenities,
                availabilityDate: values.availabilityDate,
            });
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // Function to update a property
    const updateProperty = async (values) => {
        try {
            const res = await axiosInstance.put(
                `/seller/updateProperty/${id}`,
                {
                    title: values.title,
                    description: values.description,
                    address: {
                        street: values.street,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                        postalCode: values.postalCode,
                    },
                    price: values.price,
                    bedrooms: values.bedrooms,
                    bathrooms: values.bathrooms,
                    squareFeet: values.squareFeet,
                    amenities: values.amenities,
                    availabilityDate: values.availabilityDate,
                }
            );
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // useMutation hook to handle adding a property
    const { mutate: mutateAddProperty, isPending: isAddingProperty } =
        useMutation({
            mutationKey: ["add-property"],
            mutationFn: (values) => addProperty(values),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["properties"] });
                navigate("/sellerproperty");
            },
        });
    // useMutation hook to handle updating a property
    const { mutate: mutateUpdateProperty, isPending: isUpdatingProperty } =
        useMutation({
            mutationFn: (values) => updateProperty(values),
            mutationKey: ["update-property"],
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["properties"] });

                navigate("/sellerproperty");
            },
        });

    return (
        <div>
            <Formik
                initialValues={{
                    title: title,
                    description: description,
                    street: isEditing ? address.street : "",
                    city: isEditing ? address.city : "",
                    state: isEditing ? address.state : "",
                    postalCode: isEditing ? address.postalCode : "",
                    country: isEditing ? address.country : "",
                    price: price,
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    squareFeet: squareFeet,
                    amenities: amenities,
                    availabilityDate: availabilityDate
                        ? new Date(availabilityDate).toISOString().split("T")[0]
                        : "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    // checking if isEditing is true
                    values.availabilityDate = values.availabilityDate
                        ? new Date(values.availabilityDate).toISOString()
                        : "";
                    if (isEditing) {
                        mutateUpdateProperty(values);
                    } else {
                        mutateAddProperty(values);
                    }
                }}
            >
                {() => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        <div>
                            <label htmlFor="title">Title</label>
                            <Field
                                className="my-input"
                                type="text"
                                name="title"
                                placeholder="Enter title"
                            />
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Description</label>

                            <Field
                                className="my-input"
                                maxLength={80}
                                as="textarea"
                                name="description"
                                placeholder="Enter description"
                            />

                            <ErrorMessage
                                name="description"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="street">Street</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="street"
                                placeholder="Enter street"
                            />
                            <ErrorMessage
                                name="street"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="city">City</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="city"
                                placeholder="Enter city"
                            />
                            <ErrorMessage
                                name="city"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="state">State</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="state"
                                placeholder="Enter state"
                            />
                            <ErrorMessage
                                name="state"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode">Postal Code</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="postalCode"
                                placeholder="Enter postal code"
                            />
                            <ErrorMessage
                                name="postalCode"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="country">Country</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="country"
                                placeholder="Enter country"
                            />
                            <ErrorMessage
                                name="country"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="price">Price</label>
                            <Field
                                className="my-input"
                                type="text"
                                name="price"
                                placeholder="Enter price"
                            />{" "}
                            <ErrorMessage
                                name="price"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="bedrooms">Bedrooms</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="bedrooms"
                                placeholder="Enter number of bedrooms"
                            />
                            <ErrorMessage
                                name="bedrooms"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="bathrooms">Bathrooms</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="bathrooms"
                                placeholder="Enter number of bathrooms"
                            />
                            <ErrorMessage
                                name="bathrooms"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="squareFeet">Square Feet</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="squareFeet"
                                placeholder="Enter square feet"
                            />
                            <ErrorMessage
                                name="squareFeet"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="amenities">Amenities</label>

                            <Field
                                className="my-input"
                                type="text"
                                name="amenities"
                                placeholder="Enter amenities"
                            />
                            <ErrorMessage
                                name="amenities"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        <div>
                            <label htmlFor="availabilityDate">
                                Availability Date
                            </label>

                            <Field
                                className="my-input"
                                type="date"
                                name="availabilityDate"
                                placeholder="Enter availability date"
                            />
                            <ErrorMessage
                                name="availabilityDate"
                                component="div"
                                className="my-err"
                            />
                        </div>

                        {/* sumbiting */}

                        <button className="my-btn" type="submit">
                            {isEditing === true
                                ? "Edit Property"
                                : "Add Property"}
                            {(isUpdatingProperty || isAddingProperty) && (
                                <Spinner />
                            )}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PropertyForm;

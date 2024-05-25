import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import Spinner from "../../components/Spinner";
import { getUserRole } from "../../axios/axiosInstance";
const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{6,10}$/, "Enter a valid phone number"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    person: Yup.string().required("Please select a role"),
});

const Register = () => {
    // handle register
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === "Buyer") {
            navigate("/property");
        } else if (userRole === "Seller") {
            navigate("/sellerproperty");
        }
    }, [navigate]);
    const handleRegister = async (values) => {
        try {
            console.log(values, "values");
            const res = await axiosInstance.post("/register", {
                user_name: values.firstname + " " + values.lastname,
                user_email: values.email,
                user_password: values.password,
                user_mobile: values.phone,
                user_role: values.person,
                user_gender: "Other",
            });
            return res.data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const { data, mutate, isPending } = useMutation({
        mutationKey: ["register"],
        mutationFn: (values) => handleRegister(values),
        onSuccess: () => {
            navigate("/login");
        },
    });

    return (
        <div className="my-flex ">
            <Formik
                initialValues={{
                    firstname: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    person: "Seller",
                }}
                validationSchema={RegisterSchema}
                onSubmit={(values) => {
                    mutate(values);
                }}
            >
                {() => (
                    <Form className="my-min-max">
                        <h1 className="my-heading">Register</h1>

                        {/* First name */}
                        <ErrorMessage
                            className="my-err"
                            name="firstname"
                            component="div"
                        />

                        <Field
                            className="my-input"
                            type="text"
                            placeholder="First Name"
                            name="firstname"
                        />

                        {/* Lastname */}
                        <ErrorMessage
                            className="my-err"
                            name="lastname"
                            component="div"
                        />

                        <Field
                            className="my-input"
                            type="text"
                            placeholder="Last Name"
                            name="lastname"
                        />

                        {/* phoneno */}

                        <ErrorMessage
                            className="my-err"
                            name="phone"
                            component="div"
                        />

                        <Field
                            className="my-input"
                            type="text"
                            placeholder="Phone No"
                            name="phone"
                        />

                        {/* Person */}

                        <ErrorMessage
                            className="my-err"
                            name="person"
                            component="div"
                        />

                        <Field as="select" className="my-input" name="person">
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>
                        </Field>

                        {/* Email */}
                        <ErrorMessage
                            className="my-err"
                            name="email"
                            component="div"
                        />
                        <Field
                            className="my-input"
                            type="email"
                            placeholder="Email"
                            name="email"
                        />

                        <ErrorMessage
                            className="my-err"
                            name="password"
                            component="div"
                        />
                        <Field
                            className="my-input"
                            type="password"
                            placeholder="Password"
                            name="password"
                        />

                        <ErrorMessage
                            className="my-err"
                            name="confirmPassword"
                            component="div"
                        />
                        <Field
                            className="my-input"
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                        />

                        <button
                            disabled={isPending}
                            className="my-btn"
                            type="submit"
                        >
                            {isPending ? <Spinner /> : "Register"}
                        </button>

                        <div className="mt-6 text-center text-sm text-slate-600">
                            Have a account?
                            <Link
                                to="/login"
                                className="font-medium text-[#4285f4]"
                            >
                                {" "}
                                Login
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;

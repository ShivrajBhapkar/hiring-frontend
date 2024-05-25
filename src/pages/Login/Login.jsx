import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { getLocalAuthToken ,getUserRole} from "../../axios/axiosInstance";
import Spinner from "../../components/Spinner";
const Login = () => {
    const navigate = useNavigate();

   useEffect(() => {
       const userRole = getUserRole();
       if (userRole === "Buyer") {
           navigate("/property");
       } else if (userRole === "Seller") {
           navigate("/sellerproperty");
       }
   }, [navigate]);

    async function handleLogin(values) {
        try {
            const res = await axiosInstance.post("/login", {
                user_email: values.email,
                user_password: values.password,
            });
            return res.data;
        } catch (error) {
            throw new Error(error);
        }
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email Required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password Required"),
    });
    const { mutate, data, isPending } = useMutation({
        mutationFn: (values, setSubmitting) =>
            handleLogin(values, setSubmitting),
        mutationKey: "login",
        onSuccess: (data) => {
            localStorage.setItem("x-auth-token", data?.token);
            localStorage.setItem("user_role", data?.user?.user_role);
            localStorage.setItem("user_id", data?.user?._id);
            if (data?.user?.user_role === "Buyer") {
                navigate("/property");
            } else {
                navigate("/sellerproperty");
            }
        },
    });

    return (
        <div className="my-flex min-h-screen">
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    mutate(values);
                }}
            >
                {() => (
                    <Form className="my-min-max">
                        <h1 className="my-heading"> Login</h1>

                        <Field
                            className={"my-input"}
                            type="email"
                            placeholder="@gmail"
                            name="email"
                        />
                        <ErrorMessage
                            className="my-err"
                            name="email"
                            component="div"
                        />

                        <Field
                            className={"my-input"}
                            type="password"
                            placeholder="@password"
                            name="password"
                        />
                        <ErrorMessage
                            className="my-err"
                            name="password"
                            component="div"
                        />
                        <button
                            className="my-btn"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? <Spinner /> : "Login"}
                        </button>

                        <div className="mt-6 text-center text-sm text-slate-600">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="font-medium text-[#4285f4]"
                            >
                                Register
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;

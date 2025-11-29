"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Swal from "sweetalert2";
import FormWrapper from "@/components/forms/FormWrapper";
import InputField from "@/components/forms/InputField";

import { login } from "@/services/auth/authService";
import { useUserRegisterMutation } from "@/redux/api/authApi";

const LoginForm = () => {
  const [isLoggedin, setIsLoggedin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [passError, setPassError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [register, { isLoading: registerLoading, isSuccess }] = useUserRegisterMutation();
  const router = useRouter();

  const handleLogin = async (data: any) => {
 
    
    try {
      setIsLoading(true);
      
      let res;
      
      if (!isLoggedin) {
        res = await register(data);
      }
      
      res = await login(data);

      setIsLoading(false);
      // setLoginError(res?.error);

      if (res?.accessToken) { 
        res
        router.push(res?.redirect || "/super-admin/telemedicine");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged in successful",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error: any) {
      console.log("got adn errorrrrr", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `got an error ${error?.message}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="relative flex justify-center items-center rounded-2xl w-full max-w-6xl overflow-hidden">
        <div className="w-full lg:w-1/2 bg-white p-8 space-y-3">
          {loginError && (
            <div>
              <p className="text-red-400 font-semibold text-xl">
                {typeof loginError === "string" &&
                loginError.includes("ENOTFOUND ")
                  ? "Network loginError"
                  : loginError}
              </p>
            </div>
          )}
          <FormWrapper onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              {!isLoggedin && (
                <InputField
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
              )}

              {!isLoggedin && (
                <InputField
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
              )}
              <InputField name="email" type="email" placeholder="Email" />
              <InputField
                name="password"
                type="password"
                placeholder="Password"
              />

              {isLoggedin ? (
                <div className="text-sm text-red-500">
                  <Link href="/" className="underline text-blue-600">
                    Forgot Password?
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-red-500">{passError}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Processing..." : isLoggedin ? "Login" : "Sign Up"}
              </Button>
            </div>
          </FormWrapper>

          <div className="text-center">
            {isLoggedin ? (
              <p
                className="text-sm underline! hover:underline cursor-pointer"
                onClick={() => setIsLoggedin(false)}
              >
                Create a new account
              </p>
            ) : (
              <p
                className=" text-sm underline cursor-pointer"
                onClick={() => setIsLoggedin(true)}
              >
                Already have an account?
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

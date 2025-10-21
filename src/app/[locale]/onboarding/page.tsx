"use client";
import { updateUserInfo } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SmartCitySelector from "./_components/LocationDetictor";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Home,
  LayoutDashboard,
} from "lucide-react";

const page = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [firstStepLoading, setFirstStepLoading] = useState<boolean>(false);
  const [secondStepLoading, setSecondStepLoading] = useState<boolean>(false);
  const [firstError, setFirstError] = useState<string>("");
  const [secondError, setSecondError] = useState<string>("");
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    city: "",
    phoneNumber: "",
    age: 0,
  });
  useEffect(() => {
    setCountdown(30);
    setIsDisabled(true);
  }, []);
  useEffect(() => {
    if (countdown > 0) {
      setIsDisabled(true);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);
  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity) {
      setData({ ...data, city: savedCity });
    }
  }, []);
  const formatIsraeliPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("972")) return `+${cleaned}`;
    if (cleaned.startsWith("0")) return `+972${cleaned.slice(1)}`;
    return `+972${cleaned}`;
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const phoneRegex = /^(05[0-58]|9725[0-58])\d{7}$/;
    return phoneRegex.test(cleaned);
  };
  const handleUpdate = async () => {
    try {
      const res = await updateUserInfo({
        ...data,
        phoneNumber: formatIsraeliPhone(data.phoneNumber),
      });
      if (!res?.success) {
        console.log("Failed to update user");
        return false;
      }
      return true;
      //TODO: navigate to the home page or profile page
      // router.push("/");
    } catch (error) {}
  };
  const handleFirstStep = async () => {
    if (!data.city || !data.phoneNumber || !data.age) {
      toast.error("Please fill out all the fields");
      setFirstError("Please fill out all the fields");
      return;
    }
    if (!validatePhone(data.phoneNumber)) {
      toast.error("Please enter a valid phone number");
      setFirstError("Please enter a valid phone number");

      return;
    }
    if (data.age < 18) {
      toast.error("You must be at least 18 years old to use this service");
      setFirstError("You must be at least 18 years old to use this service");

      return;
    }
    try {
      setFirstStepLoading(true);
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatIsraeliPhone(data.phoneNumber),
        }),
      });

      const resData = await res.json();

      if (!resData.success) {
        toast.error(resData.error);
        setFirstError(resData.error || "Failed to send verification code");
        return;
      }
      toast.success("Verification code sent successfully");
      setStep(2);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setFirstError(error.message);
      } else {
        toast.error("Failed to send verification code");
        setFirstError("Failed to send verification code");
      }
    } finally {
      setFirstStepLoading(false);
    }
    setStep(2);
  };
  const handleResetCode = async () => {
    try {
      if (!data.phoneNumber) {
        toast.error("Please enter a valid phone number");
        setSecondError("Please enter a valid phone number");
        return;
      }
      if (!validatePhone(data.phoneNumber)) {
        toast.error("Please enter a valid phone number");
        setSecondError("Please enter a valid phone number");
        return;
      }
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatIsraeliPhone(data.phoneNumber),
        }),
      });
      const resData = await res.json();

      if (!resData.success) {
        toast.error(resData.error);
        setSecondError(resData.error || "Failed to send verification code");
        return;
      }
      toast.success("Verification code sent successfully");
      setCountdown(30);
      setIsDisabled(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setSecondError(error.message);
      } else {
        toast.error("Failed to send verification code");
        setSecondError("Failed to send verification code");
      }
    }
  };
  const handleSecondStep = async () => {
    try {
      setSecondStepLoading(true);
      if (value.length !== 6) {
        toast.error("Please enter a valid code");
        setSecondError("Please enter a valid code");
        return;
      }
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatIsraeliPhone(data.phoneNumber),
          code: value,
          age: data.age,
          city: data.city,
        }),
      });
      const resData = await res.json();
      if (!resData.success) {
        toast.error(resData.error);
        setSecondError(resData.error || "Failed to verify code");
        return;
      }
      if (resData.success) {
        toast.success("User verified successfully");
        setStep(3);
      } else {
        setSecondError(resData.error || "Failed to verify code");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setSecondError(error.message);
      } else {
        toast.error("Failed to verify code");
        setSecondError("Failed to verify code");
      }
    } finally {
      setSecondStepLoading(false);
    }
    setCountdown(30);
    setIsDisabled(true);
  };

  return (
    <section className="h-screen flex items-center justify-center">
      {step !== 3 ? (
        <Card className={`max-w-2xl w-full ${step === 3 ? "hidden" : "block"}`}>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Basic Personal Information</CardTitle>
                <CardDescription>
                  Fill out the form to start using
                  <span className="text-primary"> Khidma </span>
                  As these information will be used to identify you
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <FieldGroup>
                  <SmartCitySelector
                    wantedCityDispatcher={setData}
                    phoneNumber={data.phoneNumber}
                    age={data.age}
                  />
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input
                      name="phoneNumber"
                      type="text"
                      value={data.phoneNumber}
                      autoComplete="off"
                      onChange={({ target }) => {
                        setData({ ...data, phoneNumber: target.value });
                        setFirstError("");
                      }}
                    />
                    <FieldError />
                  </Field>
                  <Field>
                    <FieldLabel>Age</FieldLabel>
                    <Input
                      name="age"
                      type="number"
                      value={data.age}
                      onChange={({ target }) => {
                        setData({ ...data, age: +target.value });
                        setFirstError("");
                      }}
                    />
                    <FieldError />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="mt-5 flex flex-col items-start ">
                <p className="text-destructive my-2">{firstError}</p>
                <Button variant={"action"} onClick={handleFirstStep}>
                  {firstStepLoading ? (
                    <Spinner />
                  ) : (
                    <div className="flex items-center justify-center gap-2 ">
                      <ArrowRight className="ml-2" />
                      <p>Next</p>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </>
          )}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>One Last Step</CardTitle>
                <CardDescription>
                  Please confirm your phone number with the code that we send to{" "}
                  {data.phoneNumber}
                </CardDescription>
                <CardContent className="flex items-center justify-center w-full h-full">
                  <div className="space-y-5 mt-10 flex flex-col items-center justify-center">
                    <InputOTP
                      maxLength={6}
                      value={value}
                      onChange={(value) => setValue(value)}
                    >
                      <InputOTPGroup dir="ltr">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    <div>
                      Didn't receive the code? {}
                      <Button
                        variant={"link"}
                        className="text-primary"
                        onClick={handleResetCode}
                        disabled={isDisabled}
                      >
                        {countdown > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {countdown}s
                          </span>
                        )}
                        Resend
                      </Button>
                    </div>
                    <div
                      className={`${
                        secondError
                          ? "flex items-center justify-start"
                          : "hidden"
                      }`}
                    >
                      <p className="text-destructive text-start ">
                        {secondError}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      variant={"action"}
                      onClick={handleSecondStep}
                    >
                      {secondStepLoading ? <Spinner /> : "Submit"}
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </>
          )}
        </Card>
      ) : (
        <div className="flex items-center justify-center p-4">
          <div className="max-w-md w-full dark:border-1  rounded-2xl shadow-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold  mb-3">Congratulations!</h1>

            {/* Message */}
            <p className=" mb-8">
              Your account has been verified successfully. You now have full
              access to all features.
            </p>

            {/* Buttons */}
            <div className="space-y-3 flex flex-col gap-2">
              {/* Home Button */}
              <Link href={"/"}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Home className="w-5 h-5" />
                  Go to Home Page
                </Button>
              </Link>

              {/* Dashboard Button */}
              <Link href={"/dashboard"}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <p className="text-sm text-gray-500 mt-6">
              Welcome aboard! We're excited to have you.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default page;

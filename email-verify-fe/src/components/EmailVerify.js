import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const EmailVerify = () => {
  const [data, setData] = useState();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  console.log("🚀 ~ file: EmailVerify.js:25 ~ isEmailValid:", isEmailValid);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const TEST_DATA = data?.data
    ? Object.entries(data?.data).map(([key, value]) => ({
        key,
        value,
      }))
    : [];
  const getDomainInfo = async () => {
    // if (isEmailValid) {
    //   return;
    // }
    // else {
    //   setIsEmailValid(false);
    // }
    // if (email === "") {
    //   setIsEmailValid(true);
    //   setShowInfo(false);
    //   return;
    // }
    if (email === "") {
      setIsEmailValid(true);
      setShowInfo(false);
      return;
    }

    const emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = emailPattern.test(email);

    if (!isValid) {
      setIsEmailValid(true);
      setShowInfo(false);
      return;
    } else {
      setIsEmailValid(false);
    }

    try {
      setIsLoading(true);
      const resp = await axios.get(`${BASE_URL}/email/verify?email=${email}`);
      const responseData = resp.data;
      setData(responseData);
      if (responseData) {
        setShowInfo(false);
      } else {
        setShowInfo(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterkeyPress = (event) => {
    if (event.key === "Enter") {
      getDomainInfo();
    }
  };

  return (
    <>
      <div className="border-b-[1px] flex justify-center ">
        <div className="p-[20px] ">
          <div className="p-[10px]  w-full border-[1px] items-center">
            <p>
              Insert the email address of the contact you want verified to get
              an instant score.
            </p>
            <div className=" flex">
              <div className="mt-[20px] w-[70%]">
                <TextField
                  label=""
                  autoComplete="off"
                  className="text-field"
                  sx={{ width: "90%" }}
                  variant="outlined"
                  name=""
                  placeholder="Name"
                  onKeyDown={handleEnterkeyPress}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // const enteredEmail = e.target.value;
                    // setEmail(enteredEmail);

                    // const emailPattern =
                    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    // const isValid = emailPattern.test(enteredEmail);
                    // setIsEmailValid(!isValid);
                  }}
                  error={isEmailValid}
                  helperText={isEmailValid ? "Please Enter valid email" : ""}
                />
              </div>
              <div className="w-[20%]">
                <Button
                  className="bg-[#D38336] border-[1px] mt-[30px] w-[30%] h-[34px] text-[#FFFFFF] ml-[20px]"
                  onClick={() => {
                    if (email === "") {
                      setIsEmailValid(true);
                      setShowInfo(true);
                    }
                    getDomainInfo();
                  }}
                >
                  verify
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center ">
          <CircularProgress />
        </div>
      )}

      {data ? (
        <div className="p-[40px] flex flex-col justify-center items-center">
          <>
            <h1 className="font-lato text-[20px] border-b-[3px] border-[#dcdcdc]">
              Email Information
            </h1>
            <div className="p-[40px] shadow-lg border-[1px] w-[60%] mt-[30px] ">
              <div className="p-[20px] flex justify-center border-b-[1px] border-opacity-0">
                <div className="mt-[10px]">
                  {data?.isSafeEmail?.isSafeEmail === true ? (
                    <CheckCircleOutlineIcon
                      fontSize="large"
                      style={{ color: "green" }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      fontSize="large"
                      style={{ color: "ff0000" }}
                    />
                  )}
                </div>
                <div className="ml-[10px]">
                  <p className="font-semibold text-[24px]">
                    {data?.email}{" "}
                    <span>
                      {data?.isSafeEmail.isSafeEmail === true ? "is valid" : ""}
                    </span>
                  </p>
                  <p className="mt-[8px]">{data?.isSafeEmail?.message}</p>
                </div>
              </div>
              <div className="w-[90%] p-[20px] flex justify-between">
                <div className="w-[40%]">
                  <h1 className="text-[20px] font-bold">
                    Format{" "}
                    <span
                      className={` text-[16px] text-[#198754] p-[2px] ml-[10px] + ${
                        data?.isEmailHasGibbrish?.response === true
                          ? "bg-[#D1FFBD] "
                          : "bg-[#ff2c2c] text-[#FFFFFF]"
                      }`}
                    >
                      {data?.isEmailHasGibbrish?.response === true
                        ? "Valid"
                        : "Invalid"}
                    </span>
                  </h1>{" "}
                  <p>{data?.isEmailHasGibbrish?.message}</p>
                </div>
                <div className="w-[40%]">
                  <h1 className="text-[20px] font-bold">
                    {" "}
                    Disposable{" "}
                    <span
                      className={`text-[16px] text-[#198754] p-[2px] ml-[10px] + ${
                        data?.isDisposableEmail?.response === true
                          ? "bg-[#D1FFBD] "
                          : "bg-[#ff2c2c] text-[#FFFFFF]"
                      }`}
                    >
                      {" "}
                      {data?.isDisposableEmail?.response === true
                        ? "Valid"
                        : "Invalid"}{" "}
                    </span>{" "}
                  </h1>{" "}
                  <p>{data?.isDisposableEmail?.message}</p>{" "}
                </div>
                {/* <h1 className="text-[20px] font-bold">
                    Type{" "}
                    <span
                      className={`text-[16px] text-[#198754] p-[2px] ml-[10px] + ${
                        data?.isProfessionalDomain?.response === true
                          ? "bg-[#D1FFBD] "
                          : "bg-[#ff2c2c] text-[#FFFFFF]"
                      }`}
                    >
                      {data?.isProfessionalDomain?.response === true
                        ? "Professional"
                        : "false"}
                    </span>
                  </h1>
                  <p>{data?.isProfessionalDomain?.message}</p>
                </div> */}
              </div>
              <div className="w-[90%] p-[20px] flex justify-between">
                <div className="mt-[30px] w-[40%]">
                  <h1 className="text-[20px] font-bold">
                    Server status{" "}
                    <span
                      className={`text-[16px] text-[#198754] p-[2px] ml-[10px] + ${
                        data?.isValidServerStatus?.response === true
                          ? "bg-[#D1FFBD] "
                          : "bg-[#ff2c2c] text-[#FFFFFF]"
                      }`}
                    >
                      {data?.isValidServerStatus?.response === true
                        ? "Valid"
                        : "Invalid"}
                    </span>
                  </h1>
                  <p>{data?.isValidServerStatus?.message}</p>
                </div>
                <div className="mt-[30px] w-[40%]">
                  <h1 className="text-[20px] font-bold">
                    Email Status{" "}
                    <span
                      className={`text-[16px] text-[#198754] p-[2px] ml-[10px] + ${
                        data?.isEmailStatusValid?.response === true
                          ? "bg-[#D1FFBD] "
                          : "bg-[#ff2c2c] text-[#FFFFFF]"
                      }`}
                    >
                      {data?.isEmailStatusValid?.response === true
                        ? "Valid"
                        : "Invalid"}
                    </span>
                  </h1>
                  <p>{data?.isEmailStatusValid?.message}</p>
                </div>
              </div>
            </div>
          </>
        </div>
      ) : null}
    </>
  );
};
export default EmailVerify;

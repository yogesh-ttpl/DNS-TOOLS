import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ipVersion } from "is-ip";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const SPFSearch = () => {
  const [data, setData] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [ipAddress, setIPAddress] = useState("");
  const [isDomainNameValid, setIsDomainNameValid] = useState(false);
  const [isIpAddressValid, setIsIPAddressValid] = useState(false);
  const [isDomianNameEmpty, setIsDomainNameEmpty] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const handleDomainNameChange = (event) => {
    const inputValue = event.target.value.trim();
    setDomainName(inputValue);
    setIsDomainNameValid(false);
  };

  const handleIPAddress = (event) => {
    const ipAddress = event.target.value.trim();
    setIPAddress(ipAddress);
    const isIPValid = ipVersion(ipAddress);
    setIsIPAddressValid(!isIPValid);
  };

  const getDomainInfo = async () => {
    if (domainName && ipAddress === "") {
      setIsIPAddressValid(false);
    }
    if (domainName === "" && ipAddress) {
      // setIsDomainNameValid(false);
      setIsDomainNameEmpty(false);
    }

    try {
      setIsLoading(true);

      const resp = await axios.get(
        `${BASE_URL}/spf/check?domain=${domainName}&ip=${
          ipAddress ? ipAddress : undefined
        }`
      );
      const responseData = resp.data;
      setIsLoading(false);
      setData([responseData, ...data]);
      if (responseData.status === "FAILED") {
        setData([responseData, ...data]);
      }
    } catch (error) {
      console.log("🚀 ~ file: SPFSearch.js:41 ~ getDomainInfo ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterkeyPress = (event) => {
    if (event.key === "Enter") {
      if (domainName) {
        if (domainName === "") {
          setIsDomainNameEmpty(true);
        } else {
          setIsDomainNameEmpty(false);
        }
        const regex =
          /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co\.in)(\/.*)?$/;
        const isValid = regex.test(domainName);

        if (!isValid) {
          setIsDomainNameValid(true);
        } else {
          setIsDomainNameValid(false);
          setShowInfo(true);
          setIsIPAddressValid(false);
          getDomainInfo(domainName, ipAddress);
        }
      }
      if (ipAddress) {
        setShowInfo(true);
        getDomainInfo(domainName, ipAddress);
      }
    }
  };

  const TEST_DATA = data?.testResultData
    ? Object.entries(data?.testResultData).map(([test, result]) => ({
        test,
        result,
      }))
    : [];

  return (
    <div className="border-b-[1px]">
      <div className="p-[20px]">
        <div className="p-[10px] mb-[20px] flex w-full">
          <div className="w-[20%]">
            <p className="text-[16px] font-lato">Domain name</p>
            <TextField
              label=""
              autoComplete="off"
              className="w-[100%] h-[20px]"
              variant="outlined"
              name=""
              placeholder="google.com"
              value={domainName}
              onKeyDown={handleEnterkeyPress}
              onChange={(event) => {
                handleDomainNameChange(event);
              }}
              error={isDomainNameValid || isDomianNameEmpty}
              helperText={
                (isDomainNameValid && "Please enter valid domain name") ||
                (isDomianNameEmpty && "Please enter domain name")
              }
              InputProps={{
                style: { height: "34px" },
              }}
            />
          </div>
          <span className="text-[40px] ml-[10px] font-lato mt-[10px]">:</span>
          <div className="w-[20%]">
            <p className="ml-[10px]">IP (Optional) </p>
            <TextField
              className="w-full ml-[10px] "
              label=""
              autoComplete="off"
              variant="outlined"
              name=""
              placeholder="1.1.1.1"
              onKeyDown={handleEnterkeyPress}
              value={ipAddress}
              onChange={(event) => handleIPAddress(event)}
              error={isIpAddressValid}
              helperText={isIpAddressValid && "Please Enter IP address"}
              InputProps={{
                style: { height: "34px" },
              }}
            />
          </div>
          <div className="mt-[22px]">
            <Button
              className="bg-[#D38336] border-[1px] h-[34px] text-[#FFFFFF] ml-[20px]"
              onClick={() => {
                if (domainName === "") {
                  setIsDomainNameEmpty(true);
                } else {
                  setIsDomainNameEmpty(false);
                }
                // if (ipAddress === "") {
                //   setIsIPAddressValid(true);
                // }
                if (domainName) {
                  const regex =
                    /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co\.in)(\/.*)?$/;
                  const isValid = regex.test(domainName);

                  if (!isValid) {
                    setIsDomainNameValid(true);
                  } else {
                    setIsDomainNameValid(false);
                    setShowInfo(true);
                    setIsIPAddressValid(false);
                    getDomainInfo(domainName, ipAddress);
                  }
                }
                if (ipAddress) {
                  setShowInfo(true);
                  getDomainInfo(domainName, ipAddress);
                }
              }}
            >
              SPF Record Lookup
            </Button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center ">
          <CircularProgress />
        </div>
      )}
      {!showInfo ? (
        <div className="p-[20px]">
          <h1 className="font-lato text-[20px] border-b-[3px] border-[#dcdcdc]">
            ABOUT SPF RECORD CHECK{" "}
          </h1>

          <p className="text-[16px] font-lato mt-[20px]">
            The SPF Record Check is a diagnostic tool that acts as a Sender
            Policy Framework (SPF) record lookup and SPF validator. This test
            will lookup an SPF record for the queried domain name, display the
            SPF Record (if found), and run a series of diagnostic tests (SPF
            Validation) against the record, highlighting any errors found with
            the record that could impact email delivery.
          </p>
          <p>
            Sender Policy Framework (SPF) records allow domain owners to publish
            a list of IP addresses or subnets that are authorized to send email
            on their behalf. The goal is to reduce the amount of spam and fraud
            by making it much harder for malicious senders to disguise their
            identity.
          </p>
        </div>
      ) : (
        <div>
          {/* {isLoading && <CircularProgress />} */}
          {data?.map((data, index) => (
            <div className="border-[1px] p-[20px]">
              {data.status === "SUCCESS" ? (
                <div className="p-[10px] border-[1px]">
                  <span>spf:{data?.result?.domain}</span>
                </div>
              ) : (
                <div className="p-[10px] border-[1px]">
                  <span className="text-[#FF0000]">{data?.message}</span>
                </div>
              )}

              {data?.result?.spfRecord && (
                <div className="p-[10px] bg-[#dff0d8] border-[1px] border-[#d6e9c6] text-[#3c763d] mt-[20px]">
                  <span className="ml-[10px]">{data?.result?.spfRecord}</span>
                </div>
              )}
              <div className="mt-[20px]">
                {data?.spfRecordResultData &&
                  data.spfRecordResultData.length > 0 && (
                    <div className="mt-[20px]">
                      <TableContainer component={Paper}>
                        <Table
                          sx={{
                            border: 1,
                            borderColor: "#ddd",
                            padding: 0,
                            paddingLeft: 1,
                          }}
                          aria-label="simple table"
                        >
                          <TableHead sx={{ background: "#EEEEEE" }}>
                            <TableRow
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                              }}
                            >
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                Prefix
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                Type
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                  width: 200,
                                }}
                              >
                                Value
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                PrefixDesc
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                Description
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.spfRecordResultData?.map((i, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                  component="th"
                                  scope="row"
                                >
                                  {i?.prefix}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {i?.type || "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {i.value && i.value.includes(".com") ? (
                                    <a
                                      href={`http://${i.value}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {i.value}
                                    </a>
                                  ) : (
                                    i.value || "-"
                                  )}
                                  {/* {i?.value || "-"} */}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {i?.prefixdesc || "-"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {i?.description || "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
              </div>
              <div className="mt-[20px]">
                {data.testResultData && (
                  <TableContainer component={Paper}>
                    <Table
                      sx={{
                        border: 1,
                        borderColor: "#ddd",
                        padding: 0,
                        paddingLeft: 1,
                      }}
                      aria-label="simple table"
                    >
                      <TableHead sx={{ background: "#EEEEEE" }}>
                        <TableRow
                          sx={{
                            border: 1,
                            borderColor: "#ddd",
                            padding: 0,
                            paddingLeft: 1,
                          }}
                        >
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "#ddd",
                              padding: 0,
                              paddingLeft: 1,
                            }}
                            className="w-[58px]"
                          ></TableCell>
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "#ddd",
                              padding: 0,
                              width: 500,
                              paddingLeft: 1,
                            }}
                          >
                            Test
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "#ddd",
                              padding: 0,
                              paddingLeft: 1,
                            }}
                          >
                            Result
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data &&
                          data?.testResultData?.map((row, index) =>
                            row.test ? (
                              <TableRow
                                key={index}
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                  component="th"
                                  scope="row"
                                >
                                  {/* {index + 1} */}{" "}
                                  {row?.result === true ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <CloseIcon color="error" />
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {row?.test}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {row?.description}
                                </TableCell>
                              </TableRow>
                            ) : (
                              ""
                            )
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SPFSearch;

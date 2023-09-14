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
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
const BASE_URL = process.env.REACT_APP_BASE_URL;
const nameData = {
  v: "Version",
  p: "Policy",
  fo: "Forensic Reporting",
  pct: "Percentage",
  ri: "Reporting Interval",
  rua: "Receivers",
  ruf: "Forensic Receivers",
  r: "Alignment Mode SPF",
  sp: "Sub-domain Policy",
};

const DmarcSearch = () => {
  const [data, setData] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [isDomainNameValid, setIsDomainNameValid] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isEmptyError, setIsEmptyError] = useState(false);
  const [isInvalidError, setIsInvalidError] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const handleDomainNameChange = (event) => {
    const inputValue = event.target.value.trim();
    setDomainName(inputValue);
    setIsEmptyError(false);
    setIsInvalidError(false);
  };

  const getDomainInfo = async (inputValue) => {
    const regex =
      /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co|co\.in)(\/.*)?$/;
    const isValid = regex.test(inputValue);
    setIsDomainNameValid(isValid);
    if (!isValid) {
      setIsDomainNameValid(true);
      return;
    }
    if (domainName === "") {
      setShowInfo(false);
      setIsDomainNameValid(true);
    } else {
      setIsDomainNameValid(false);
      setShowInfo(true);
      try {
        setIsLoading(true);

        const resp = await axios.get(
          `${BASE_URL}/dmarc/domain?domain=${domainName}`
        );
        const responseData = resp?.data;

        setData([responseData, ...data]);
      } catch (error) {
        toast.error(error?.response?.data?.testResults?.DMARC_Record_Published);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleButtonClick = async () => {
    const regex =
      /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co|co\.in)(\/.*)?$/;
    const isValid = regex.test(domainName);

    if (!domainName) {
      setIsEmptyError(true);
      setIsInvalidError(false);
      // setShowInfo(false);
    } else if (!isValid) {
      setIsEmptyError(false);
      setIsInvalidError(true);
      // setShowInfo(false);
    } else {
      setIsEmptyError(false);
      setIsInvalidError(false);
      await getDomainInfo(domainName);
    }
  };

  const handleEnterKeyPress = async (event) => {
    if (event.key === "Enter") {
      await handleButtonClick();
    }
  };
  const TEST_DATA = data[0]?.testResults
    ? Object.entries(data[0].testResults).map(([test, result]) => ({
        test,
        result,
      }))
    : [];

  return (
    <div className="border-b-[1px]">
      <div className="p-[20px]">
        <div className="p-[10px] mb-[20px]">
          <p className="text-[16px] font-lato">Domain name</p>
          <TextField
            label=""
            autoComplete="off"
            className="w-[25%]  customTextField"
            variant="outlined"
            name=""
            onKeyDown={handleEnterKeyPress}
            placeholder="google.com"
            value={domainName}
            onChange={(event) => {
              handleDomainNameChange(event);
            }}
            error={isEmptyError || isInvalidError}
            helperText={
              isEmptyError
                ? "Please enter a domain name"
                : isInvalidError
                ? "Please enter a valid domain name"
                : ""
            }
            InputProps={{
              style: { height: "34px" },
            }}
          />

          <Button
            className="bg-[#D38336] border-[1px] h-[34px] text-[#FFFFFF] ml-[20px]"
            onClick={handleButtonClick}
          >
            DMARC Lookup
          </Button>
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
            ABOUT DMARC RECORD CHECK{" "}
          </h1>

          <p className="text-[16px] font-lato mt-[20px]">
            The DMARC Record Lookup / DMARC Check is a diagnostic tool that will
            parse the DMARC Record for the queried domain name, display the
            DMARC Record, and run a series of diagnostic checks against the
            record. Domain-based Message Authentication, Reporting, and
            Conformance (DMARC) is a mechanism for policy distribution by which
            an organization that is the originator of an email can communicate
            domain-level policies and preferences for message validation,
            disposition, and reporting.
          </p>
          <p>
            {" "}
            DMARC Records standardize how mail originators associate and
            authenticate domain identifiers with messages, handle message
            policies using those identifiers, and report about mail using those
            identifiers. According to RFC 7489, the DMARC mechanism for policy
            distribution enables the strict handling of email messages that fail
            authentication checks, such as SPF and/or DKIM. If neither of those
            authentication methods passes, DMARC tells the receiver how to
            handle the message, such as junk it (quarantine) or reject the
            message entirely.
          </p>
        </div>
      ) : (
        <>
          {data?.map((data, index) => (
            <div className="border-[1px] p-[20px]" key={index}>
              <div className="p-[10px] border-[1px]">
                <span>dmarc:{data?.domain}</span>
              </div>

              {data?.record && (
                <div className="bg-[#d6e9c6] p-[10px] border-[1px] text-[#3c763d] mt-[20px]">
                  <span className="ml-[10px]">{data?.record?.record}</span>
                </div>
              )}
              <div className="mt-[20px]">
                {data?.record && (
                  <div className="mt-[20px]">
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          border: 1,
                          borderColor: "#ddd",
                          padding: 0,
                          paddingLeft: 1,
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
                              paddingLeft: 1,
                            }}
                          >
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                                width: 100,
                              }}
                            >
                              Tag
                            </TableCell>
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                                width: 300,
                              }}
                            >
                              TagValue
                            </TableCell>
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                                width: 150,
                              }}
                            >
                              Name
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
                          {Object.keys(data?.record?.tags || {}).map(
                            (tagName) => (
                              <TableRow key={tagName} sx={{ border: 1 }}>
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
                                  {tagName}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {data.record.tags[tagName].value}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {nameData[tagName]}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: 1,
                                    borderColor: "#ddd",
                                    padding: 0,
                                    paddingLeft: 1,
                                  }}
                                >
                                  {data.record.tags[tagName].description}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
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
                          className="w-[58px]"
                        ></TableCell>
                        <TableCell
                          sx={{
                            border: 1,
                            borderColor: "#ddd",
                            padding: 0,
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
                        <TableCell
                          sx={{
                            border: 1,
                            borderColor: "#ddd",
                            padding: 0,
                            paddingLeft: 1,
                          }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data &&
                        data?.testResults?.map((row, index) => (
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
                              {row?.key.split("_").join(" ")}
                            </TableCell>
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                              }}
                            >
                              {row.description}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default DmarcSearch;

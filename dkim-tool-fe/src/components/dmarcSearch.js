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
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const VALIDATATION_DATA = {
  domainName: {
    name: "",
    emptyError: false,
    emptyErrorMessae: "Please enter domain name",
    isValidError: false,
    isValidErrorMsg: "Please enter valid domain name",
  },
};

const DmarcSearch = () => {
  const [data, setData] = useState([]);

  let history = useHistory();
  const [domainName, setDomainName] = useState("");
  const [selector, setSelector] = useState("");
  const [isSelectorValid, setIsSelectorValid] = useState(false);

  const [isDomainNameValid, setIsDomainNameValid] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const [validationData, setValidationData] = useState(VALIDATATION_DATA);
  const handleDomainNameChange = (event) => {
    const inputValue = event.target.value.trim();
    setDomainName(inputValue);
    setIsDomainNameValid(false);
  };

  const handleSelectorChange = (event) => {
    const inputValue = event.target.value.trim();
    setSelector(inputValue);
  };

  const getDomainInfo = async (inputValue) => {
    if (domainName === "") {
      validationData.domainName.emptyError = true;
      // setIsDomainNameValid(true);
    } else {
      validationData.domainName.emptyError = false;
    }
    if (selector === "") {
      setIsSelectorValid(true);
    } else {
      setIsSelectorValid(false);
    }
    const regex =
      // /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co|co\.in)(\/.*)?$/;
      // /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
      /^(?!:\/\/)(?!www\.)([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+\.[a-zA-Z]{2,6}$/;
    const isValid = regex.test(domainName);

    if (!isValid) {
      validationData.domainName.isValidError = true;
      setShowInfo(true);
      setIsDomainNameValid(false);
      return;
    } else {
      setIsDomainNameValid(false);
      validationData.domainName.isValidError = false;
    }

    if (selector !== "") {
      try {
        setIsLoading(true);

        const resp = await axios.get(
          `${BASE_URL}/dkim?domain=${domainName}&selector=${selector}`
        );
        const responseData = resp.data;
        setData([responseData, ...data]);
        if (responseData.status === "FAILED") {
        } else {
          setShowInfo(true);
        }
      } catch (error) {
        toast.error(error?.data?.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSelectorValid(true);
      setShowInfo(false);
    }
  };

  const TEST_DATA = data[0]?.testResults
    ? Object.entries(data[0]?.testResults).map(([test, result]) => ({
        test,
        result,
      }))
    : [];

  const handleEnterkeyPress = (event) => {
    if (event.key === "Enter") {
      getDomainInfo(event);
    }
  };

  return (
    <div className="border-b-[1px]">
      <div className="p-[20px]">
        <div className="p-[10px] mb-[20px] flex">
          <div className="w-[25%]">
            <span className="text-[16px] font-lato">Domain name</span>
            <TextField
              label=""
              autoComplete="off"
              className="w-[100%]"
              variant="outlined"
              onKeyDown={handleEnterkeyPress}
              name=""
              placeholder="google.com"
              value={domainName}
              onChange={(event) => {
                handleDomainNameChange(event);
              }}
              error={
                validationData.domainName.emptyError ||
                validationData.domainName.isValidError
              }
              helperText={
                (validationData.domainName.emptyError &&
                  validationData.domainName.emptyErrorMessae) ||
                (validationData.domainName.isValidError &&
                  validationData.domainName.isValidErrorMsg)
              }
              InputProps={{
                style: { height: "34px" },
              }}
            />
          </div>
          <p className="mt-[10px] text-[40px]">:</p>
          <div className="w-[25%]">
            <span className="text-[16px] font-lato">Selector</span>
            <TextField
              label=""
              autoComplete="off"
              className="w-[100%]"
              variant="outlined"
              name=""
              placeholder="e.g google"
              onKeyDown={handleEnterkeyPress}
              value={selector}
              onChange={(event) => {
                handleSelectorChange(event);
              }}
              error={isSelectorValid}
              helperText={isSelectorValid && "Please Enter valid Selector"}
              InputProps={{
                style: { height: "34px" },
              }}
            />
          </div>
          <div className="w-[40%] flex mt-[22px]">
            <Button
              className="bg-[#D38336] border-[1px] h-[34px] text-[#FFFFFF] ml-[20px]"
              onClick={() => {
                setShowInfo(true);
                getDomainInfo();
              }}
            >
              DKIM Lookup
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
            ABOUT DKIM RECORD CHECK
          </h1>

          <p className="text-[16px] font-lato mt-[20px]">
            The DKIM Check tool will perform a DKIM record test against a domain
            name and selector for a valid published DKIM key record. DomainKeys
            Identified Mail (DKIM) defines a domain-level digital signature
            authentication framework for email by permitting a signing domain to
            assert responsibility for a message in transit. DKIM authenticates
            the reputation and identity of the email sender and their email
            signing practices for additional handling (i.e. does email get
            delivered, quarantined, or rejected). DKIM authentication of a
            message is validated via a cryptographic signature and querying the
            signer’s domain to retrieve a public key. This tool tests the
            ability to retrieve the DKIM public key using a domain and a
            selector.
          </p>
          <p>
            {" "}
            How to Use the DKIM Check Tool: There are two (2) ways to test a
            DKIM record with the DKIM Record Checker. The first is just using a
            domain and selector separated by a colon and the second option is
            using the host/name format of the record.
          </p>

          <ul>
            <li>
              Option 1: (domain):(selector) i.e. mxtoolbox.com:email - where
              mxtoolbox.com is the domain part and email is the selector,
              separated by a colon
            </li>
            <li>
              Option 2: (selector).(_domainkey).(domain) i.e.
              email._domainkey.mxtoolbox.com - where email is the selector
              followed by ._domainkey. and then mxtoolbox.com as the domain.
              Note: If you use this method, you will input all of this into the
              Domain Name input field and leave the Selector field empty.
            </li>
          </ul>
          <p>
            What is a DKIM Selector? A DKIM selector is text that is added with
            the domain to create a unique DNS record used during DKIM. This
            allows multiple keys to exist under one domain which allows for
            different signatures to be created by different systems, date
            ranges, or third party services.
          </p>
        </div>
      ) : (
        data?.map((data, index) => {
          return (
            <div className="border-[1px] p-[20px]" key={index}>
              <div className="p-[10px] border-[1px]">
                <span>
                  dkim:{data?.domain}:{data?.selector}
                </span>
              </div>

              {data?.record && (
                <div className="p-[10px] bg-[#dff0d8] border-[1px] border-[#d6e9c6] text-[#3c763d] mt-[20px] overflow-scroll">
                  <span className="ml-[10px]">{data?.record}</span>
                </div>
              )}
              <div className="mt-[20px]">
                <div className="mt-[20px]">
                  {data?.dkimRecordResultData && (
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
                              className="w-4/4"
                            >
                              Tag
                            </TableCell>
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                              }}
                              className="w-1/2"
                            >
                              TagValue
                            </TableCell>
                            <TableCell
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                padding: 0,
                                paddingLeft: 1,
                              }}
                              className=""
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
                              className=""
                            >
                              Description
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data?.dkimRecordResultData.map((i) => (
                            <TableRow key={i} sx={{ border: 1 }}>
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
                                {i?.key}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                                className="tag-value-cell"
                              >
                                {i?.tagValue.split(";")}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                {i?.tagName}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                {i?.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              </div>
              <div className="mt-[20px]">
                {data?.testResultData && (
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
                            className=""
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
                        {data?.testResultData?.map((row, index) => (
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
                            >
                              {" "}
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
                                width: 350,
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
                              {row?.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
export default DmarcSearch;

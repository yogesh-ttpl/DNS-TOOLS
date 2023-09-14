import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
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
const DNS = [
  "google",
  "cloudflare",
  "opendns",
  "quad9",
  "yandex",
  "authoritativedns",
];
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
  const [validationData, setValidationData] = useState(VALIDATATION_DATA);

  const [domainName, setDomainName] = useState("");

  const [isDomainNameValid, setIsDomainNameValid] = useState(null);

  const [showInfo, setShowInfo] = useState(false);
  const [dnsServer, setDnsServer] = useState(DNS);
  const [selectedDnsServer, setSelectedDnsServer] = useState("google");
  const [loading, setIsLoading] = useState(false);

  const handleDomainNameChange = (event) => {
    const inputValue = event.target.value.trim();
    setDomainName(inputValue);
  };

  const getDomainInfo = async () => {
    if (domainName !== "" && selectedDnsServer !== "") {
      try {
        setIsLoading(true);
        let modifiedDomainName = domainName.replace(
          /^(https?:\/\/)?(www\.)?/i,
          ""
        );

        modifiedDomainName = `www.${modifiedDomainName}`;

        const resp = await axios.get(
          `${BASE_URL}/cname?domain=${modifiedDomainName}&dns=${selectedDnsServer}`
        );
        const responseData = resp.data;

        setData([responseData, ...data]);
        setShowInfo(true);
      } catch (error) {
        // toast.error(error?.response?.data?.Response);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please provide both fields");
      setShowInfo(false);
    }
  };
  const handleEnterkeyPress = async (event) => {
    if (event.key === "Enter") {
      const domainRegex =
        /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co|co\.in)(\/.*)?$/;
      const isValidDomain = domainRegex.test(domainName);

      if (!domainName) {
        setValidationData((prevValidationData) => ({
          ...prevValidationData,
          domainName: {
            ...prevValidationData.domainName,
            emptyError: true,
            isValidError: false,
          },
        }));
      } else if (!isValidDomain) {
        setValidationData((prevValidationData) => ({
          ...prevValidationData,
          domainName: {
            ...prevValidationData.domainName,
            emptyError: false,
            isValidError: true,
          },
        }));
      } else {
        setValidationData((prevValidationData) => ({
          ...prevValidationData,
          domainName: {
            ...prevValidationData.domainName,
            emptyError: false,
            isValidError: false,
          },
        }));
        await getDomainInfo();
      }
    }
  };
  const handleButtonClick = async () => {
    const domainRegex =
      /^(https?:\/\/)?(www\.)?[A-Za-z]+\.(com|in|co|co\.in)(\/.*)?$/;
    const isValidDomain = domainRegex.test(domainName);

    if (!domainName) {
      setValidationData((prevValidationData) => ({
        ...prevValidationData,
        domainName: {
          ...prevValidationData.domainName,
          emptyError: true,
          isValidError: false,
        },
      }));
    } else if (!isValidDomain) {
      setValidationData((prevValidationData) => ({
        ...prevValidationData,
        domainName: {
          ...prevValidationData.domainName,
          emptyError: false,
          isValidError: true,
        },
      }));
    } else {
      setValidationData((prevValidationData) => ({
        ...prevValidationData,
        domainName: {
          ...prevValidationData.domainName,
          emptyError: false,
          isValidError: false,
        },
      }));
      await getDomainInfo();
    }
  };

  const TEST_DATA = data[0]?.testResults
    ? Object.entries(data[0]?.testResults).map(([test, result]) => ({
        test,
        result,
      }))
    : [];
  return (
    <>
      <div className="border-b-[1px]">
        <div className="p-[20px]">
          <div className="p-[10px] mb-[20px] flex">
            <div className="w-[25%]">
              <span className="text-[16px] font-lato">Domain name</span>
              <TextField
                label=""
                className="w-[100%]"
                variant="outlined"
                name=""
                placeholder="www.google.com"
                value={domainName}
                onKeyDown={handleEnterkeyPress}
                onChange={(event) => {
                  handleDomainNameChange(event);
                }}
                // error={isDomainNameValid === false}
                // helperText={
                //   isDomainNameValid === false &&
                //   "please enter valid domain name"
                // }
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
                  style: { height: "34px", marginTop: "10px" },
                }}
              />
            </div>
            <div className="w-[25%] ml-[20px]">
              <span className="text-[16px] font-lato">DNS Server</span>
              <Box sx={{ marginTop: 1 }}>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selectedDnsServer}
                    onChange={(event) => {
                      let dnsServer = event.target.value.trim().toLowerCase();
                      setSelectedDnsServer(dnsServer);
                    }}
                    style={{
                      height: "34px",
                    }}
                  >
                    {dnsServer.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item ?? "N/A"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>

            <div className="w-[40%] flex mt-[30px]">
              <Button
                className="bg-[#D38336] border-[1px] h-[34px] text-[#FFFFFF] ml-[20px]"
                onClick={handleButtonClick}
              >
                CNAME Lookup
              </Button>
            </div>
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center ">
            <CircularProgress />
          </div>
        )}
        <div>
          {data?.map((data, index) => (
            <div className="border-[1px] p-[20px]">
              {/* {data?.domain && ( */}
              <div className="p-[10px] border-[1px]">
                <span>mx:{data?.domain}</span>
              </div>
              {/* )} */}
              <div className="mt-[20px]">
                <div className="mt-[20px]">
                  {data &&
                    data?.type &&
                    data?.domain &&
                    data?.canonicalName && (
                      <TableContainer component={Paper}>
                        <Table sx={{ border: 1 }} aria-label="simple table">
                          <TableHead sx={{ background: "#EEEEEE" }}>
                            <TableRow
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
                                paddingLeft: 1,
                              }}
                            >
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  width: 10,
                                  paddingLeft: 1,
                                }}
                                className=""
                              >
                                Type
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  width: 70,
                                  paddingLeft: 1,
                                }}
                                className=""
                              >
                                Domain Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  width: 70,
                                  paddingLeft: 1,
                                }}
                                className=""
                              >
                                Canonical Name
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  width: 150,
                                  paddingLeft: 1,
                                }}
                                className=""
                              >
                                TTL
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              sx={{
                                border: 1,
                                borderColor: "#ddd",
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
                                {data?.type}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                {data?.domain}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                {data?.canonicalName}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: 1,
                                  borderColor: "#ddd",
                                  padding: 0,
                                  paddingLeft: 1,
                                }}
                              >
                                {data?.TTL}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                </div>
              </div>
              <div className="mt-[50px]">
                {data?.testResults?.length > 0 && (
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ border: 1, borderColor: "#ddd", padding: 0 }}
                      aria-label="simple table"
                      className="table"
                    >
                      <TableHead sx={{ background: "#EEEEEE" }}>
                        <TableRow sx={{ border: 1, borderColor: "#ddd" }}>
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "#ddd",
                              padding: 0,
                              width: 50,
                              paddingLeft: 1,
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              border: 1,
                              borderColor: "#ddd",
                              padding: 0,
                              width: 350,
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
                                {row.key}
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default DmarcSearch;

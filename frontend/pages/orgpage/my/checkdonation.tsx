import OrgMypageSidebar from "@/components/OrgMypageSidebar";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Container,
  Stack,
  Typography,
  CssBaseline,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Table,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { FC, useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { getOrgDonationList, getPostCompany } from "../../../function/axios";
const mdTheme = createTheme();

const CustomButton = styled(Button)({
  backgroundColor: "#5B321E",
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#CDAD78",
    color: "white",
  },
});

const CustomButton2 = styled(Button)({
  color: "#5B321E",
  border: "2px solid #5B321E",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#FCE2A6",
    color: "#5B321E",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CDAD78",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
    backgroundColor: "#FCF8F0",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: 62,
}));

const orgpageMyCheckDonation: FC = () => {
  const [donationList, setDonationList] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [wait, setWait] = useState<boolean>(false);

  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNumber) => setCurPage(pageNumber);

  // 택배사 리스트 api
  const [companyList, setCompanyList] = useState<any[]>([]);

  // 택배사 코드 -> 이름
  const findCompanyName = (id) => {
    var result = "";
    if (loading) {
      for (let i = 0; i < companyList.length; i++) {
        if (companyList[i].Code.toString() == id.toString()) {
          result = companyList[i].Name;
          return result;
        }
      }
    }
  };

  useEffect(() => {
    getPostCompany().then((res) => {
      setCompanyList(res.data.Company);
      setLoading(true);
    });
  }, []);

  // console.log(companyList);
  const params = {
    page: curPage,
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    getOrgDonationList(id, params).then((res) => {
      if (res.data.apply) {
        setDonationList(res.data.apply);
        // console.log(res.data);
        setTotalPages(res.data.totalPage);
      }
    });
  }, [curPage]);

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <OrgMypageSidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              mt: 0,
            }}
          >
            <Container maxWidth="lg" sx={{}}>
              <Typography variant="h4">물품 기부 현황</Typography>
              <TableContainer component={Paper} sx={{ mt: 5 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        제목
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        물품 상세
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        발송인
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        송장번호
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        택배사
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontSize: 17 }}>
                        기부 신청일
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donationList.length > 0 &&
                      donationList.map((data) => (
                        <StyledTableRow key={data.donationApplyId}>
                          <StyledTableCell align="center" sx={{ width: 400 }}>
                            <Link
                              href={`/detail/donationorg/${data.donationId}`}
                            >
                              {data.title}
                            </Link>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {data.productName}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Link href={`/userpage/${data.memberId}`}>
                              {data.name}
                            </Link>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {data.invoice}
                          </StyledTableCell>
                          {data.parcel ? (
                            <StyledTableCell align="center">
                              {/* {data.parcel} */}
                              {findCompanyName(data.parcel)}
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell align="center">
                              {data.parcel}
                            </StyledTableCell>
                          )}
                          <StyledTableCell align="center">
                            {data.donationDate}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {donationList && donationList.length > 0 ? (
                <Stack alignItems="center" sx={{ mb: 2, mt: 2 }}>
                  <Pagination
                    curPage={curPage}
                    paginate={paginate}
                    totalPage={totalPages}
                  />
                </Stack>
              ) : (
                <Typography
                  variant="h5"
                  sx={{ mt: 10, display: "flex", justifyContent: "center" }}
                >
                  진행 중인 기부가 없습니다.
                </Typography>
              )}
            </Container>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default orgpageMyCheckDonation;

import axios from "axios";

export const coinmarketcap = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com",
  headers: {
    Accept: "application/json",
    "X-CMC_PRO_API_KEY": "02c64e28-aec1-4be8-9d72-860e7aa4e1ed",
  },
});

export const coinstats = axios.create({
  baseURL: "https://openapiv1.coinstats.app",
  headers: {
    "X-API-KEY": "aho2yFAQMpdIq0Wznc8DWo2Rcb5LY8BsD8ps68bxlCE=",
    Accept: "application/json",
  },
});

const Authorization =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjB4MDVmOGY2ODQwZmI3MzZjZmMxODU0MWRiMGI1ZWJhMTc0OTg3MDI2ZCIsIm1ldGFkYXRhIjp7fSwiaWF0IjoxNzAxNjU3NzI2LCJleHAiOjE3MDI4NjczMjZ9.uAVmDB_OgxWu-4CZoPjacH_b3ciRq_Gbk_zqQ_gYc7M";

export const nimbus = axios.create({
  baseURL: "https://api-staging.getnimbus.io",
  headers: {
    Authorization: Authorization,
  },
});

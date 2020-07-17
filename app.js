var express = require("express");
require('dotenv').config()
const axios = require("axios");
const tikers = require("./tikers");
const keys = require("./keys.json");
const {Client_Email,Private_Key,Token } = process.env
const { google } = require("googleapis");
const app = express();
var Data = {};
let arr =  []

const client = new google.auth.JWT(keys.client_email, null,keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);





// the api data is coming frong Tingo 
setTimeout(()=>{
  tikers.map((item) => {
    async function fetchData(ticker) {
      // const ticker = ticker
      const today = new Date();
      var pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      // console.log(pastDate.toISOString().slice(0, 10));
      // const token = "c8cd892e1719aead2651ad41acd43ee33e1c41c8";
      const { data } = await axios.get(
        `https://corsanywhere.herokuapp.com/https://api.tiingo.com/tiingo/daily/${ticker}/prices?token=${Token}&startDate=${pastDate
          .toISOString()
          .slice(0, 10)}&endDate=${today
          .toISOString()
          .slice(0, 10)}&resampleFreq=daily`
      );
      //    console.log(data)
      let High = Math.max.apply(
        Math,
        data.map(function (o) {
          return o.high;
        })
      );
      let Low = Math.min.apply(
        Math,
        data.map(function (o) {
          return o.low;
        })
      );
  
      console.log(High);
      console.log(Low);
  
      var TotalVol = data.reduce(function (previousValue, currentValue) {
        return {
          volume: previousValue.volume + currentValue.volume,
        };
      });
      console.log(TotalVol);
  
      var TotalPriceVol = data.reduce(function (previousValue, currentValue) {
        return (
          previousValue +
          currentValue.volume *
            ((currentValue.high + currentValue.low + currentValue.close) / 3)
        );
      }, 0);
      console.log(TotalPriceVol);
  
      let VWAP = TotalPriceVol / TotalVol.volume;
  
      console.log(`VWAP ${VWAP}`);
      const MainData = { ...Data, VWAP: VWAP, High: High, Low: Low };
      Data= MainData
      // console.log(MainData);
      // Data.push([High,  Low ,VWAP])
      arr.push([Data.VWAP,Data.High,Data.Low])
      console.log(`High data from object ${Data}`)
    }
  
    //
  
    fetchData(item);
  });
},1000)



// google sheet updation process
setTimeout(()=>{
  client.authorize((err, token) => {
    if (err) {
      console.log(err);
    } else {
      console.log("sucess");
      gsrun(client);
    }
  });
  
async function gsrun(cl) {
  const gsApi = google.sheets({ version: "v4", auth: cl });
  const opt = {
    spreadsheetId: "1gwrcuNz89jyRUIIv1rIs4HKGPBKLjcAjJ_T18SSHXCA",
    range: "data!A7:A27",
  };

  var data = await gsApi.spreadsheets.values.get(opt);

  const dataArray = data.data.values;
  let newDataarray = dataArray.map((r) => {
    r.push(r[0] + "_" + r[1]);
    return r;
  });
  console.log(newDataarray)
  const updateSheet = {
    spreadsheetId: "1zpPQeDYBFdZL_MoVj2o-qCWW27wpU2bpKRYWxq7Bpic",
    range: "data!B3",
    valueInputOption: "USER_ENTERED",
    resource:{
      values:arr
    }
  };
  var update = await gsApi.spreadsheets.values.update(updateSheet);
  console.log(update)
}
},1000)
 
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});




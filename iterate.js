const fs = require("fs");
const axios = require("axios").default;
const vehicleBuffer = fs.readFileSync("./reports.json");
const vehicleArray = JSON.parse(vehicleBuffer);
vehicleArray.forEach(async (vehicle) => {
  try {
    const response = await axios.post(
      "https://t6x0zinjta.execute-api.us-east-1.amazonaws.com/api",
      vehicle
    );
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
});
//send vehicle id in post request, have lambda process and save the log with the vehicle id
//check if Etag is populated, otherwise throw error

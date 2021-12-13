const aws = require("aws-sdk");
const s3 = new aws.S3();
const DynamoDB = new aws.DynamoDB.DocumentClient({
  region: "us-east-1",
});
exports.handler = async (event) => {
  const vehicleReports = await Promise.all(
    event.Records.map(async (record) => {
      const params = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      };
      const getObjectPromise = s3.getObject(params).promise();
      try {
        const data = await getObjectPromise;
        return data;
      } catch (error) {
        return error;
      }
    })
  );
  console.log(vehicleReports);
  const result = await Promise.all(
    vehicleReports.map(async (vehicleReport) => {
      const parsedVehicleReport = JSON.parse(vehicleReport.Body);
      return await DynamoDB.put({
        TableName: "ids-table",
        Item: parsedVehicleReport,
      }).promise();
    })
  );
  console.log(result);
};

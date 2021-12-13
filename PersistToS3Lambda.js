const aws = require("aws-sdk");
const s3 = new aws.S3();

exports.handler = async (event) => {
  const document = JSON.stringify(event);
  const params = {
    Bucket: "cymotiveproj",
    Body: document,
    ContentType: "application/json",
    Key: event.vehicleId + "||" + Date.now(),
  };
  const putObjectPromise = s3.putObject(params).promise();
  try {
    const data = await putObjectPromise;
    return data;
  } catch (e) {
    return e;
  }
};

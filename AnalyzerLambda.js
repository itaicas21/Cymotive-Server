function ArrNoDupe(a, field) {
  const temp = {};
  for (let i = 0; i < a.length; i++) temp[a[i][field]] = true;
  const r = [];
  for (let k in temp) r.push(k);
  return r;
}
const aws = require("aws-sdk");
const DynamoDB = new aws.DynamoDB.DocumentClient({
  region: "us-east-1",
});
exports.handler = async (event, context, callback) => {
  let result = null;
  switch (event.httpMethod) {
    case "GET":
      switch (event.path) {
        case "/numberofanomalies":
          const scanResult = await DynamoDB.scan({
            TableName: "ids-table",
          }).promise();
          result = 0;
          scanResult.Items.forEach((report) => {
            for (let parameter in report.signalsPerMinute) {
              if (
                report.signalsPerMinute[parameter]["sum"] <
                  report.signalsPerMinute[parameter][
                    "acceptableMinValue"
                  ] ||
                report.signalsPerMinute[parameter]["sum"] >
                  report.signalsPerMinute[parameter][
                    "acceptableMaxValue"
                  ]
              ) {
                result++;
              }
            }
          });
          break;
        case "/numberofreports": {
          const reportArray = await DynamoDB.scan({
            TableName: "ids-table",
          }).promise();
          result = reportArray.ScannedCount;
          break;
        }
        case "/numberofvehicles":
          break;
        case "/numberofmanufacturers": {
          const reportArray = await DynamoDB.scan({
            TableName: "ids-table",
            ProjectionExpression: "manufacturerType",
          }).promise();
          result = ArrNoDupe(
            reportArray.Items,
            "manufacturerType"
          ).length;
          break;
        }
      }
      break;
  }
  return { statusCode: 200, body: result };
};

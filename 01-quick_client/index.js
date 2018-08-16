const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const request = require("./request");
const { log } = console;

const PROTO_PATH = path.resolve(__dirname, "../proto/index.proto");
const API_URI = process.env.API_URI || "localhost:8763";
// const PEM_PATH = path.resolve(__dirname, "./assets/server.pem");
// const cred = grpc.credentials.createSsl(fs.readFileSync(PEM_PATH));
const cred = grpc.credentials.createInsecure();

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};
const def = protoLoader.loadSync(PROTO_PATH, options);
const protoMap = grpc.loadPackageDefinition(def);
const packageName = Object.keys(protoMap)[0];
const proto = grpc.loadPackageDefinition(def)[packageName];
const serviceName = Object.keys(proto)[0];
const client = new proto[serviceName](API_URI, cred);

log(chalk.magenta.bold(`API: ${API_URI}`));
log(chalk.blue(`Start making request to ${serviceName} - ${request.name}...`));

client[request.name](request.body, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  log(chalk.yellow(`Get the response:`));
  log(response);
  log(chalk.yellow("done!"));
  return;
});

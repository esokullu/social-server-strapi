const http = require("https");

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};



module.exports = {
  fetch
}
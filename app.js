const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { parse } = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "80af60c4588378392d0282779532f33a";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;
  https.get(url, (response) => {
    //console.log(res);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(`<p>The temperature of ${city} is ${temp} degree celcius</p>`);
      res.write(`<img src='${imageURL}'>`);
      res.send();
    });
  });
});

//Port is used to get the port for desirable port when deploying the app in the web
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

var requestPromise = require("request-promise");
var queryString = require("querystring");
var cors = require("cors");

require("dotenv").config();
let details = {
  type: "",
  placeName: "",
  numberPeople: 0,
  datetime: "",
};

const getResponse = (props) => {
  const { response } = props;

  let type;
  if (details.type != "") {
    if (
      response.prediction.topIntent === "Cancel" ||
      response.prediction.topIntent === "StartOver" ||
      response.prediction.topIntent === "Stop"
    ) {
      type = response.prediction.topIntent;
    } else {
      type = details.type;
    }
  } else {
    type = response.prediction.topIntent;
  }
  switch (type) {
    case "Greeting":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Hi! How can I help you today?" };
    case "Goodbye":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Goodbye! Glad I could help!" };
    case "RestaurantReservation":
      details.type = "RestaurantReservation";

      if (
        response.prediction.entities &&
        Object.keys(response.prediction.entities).length != 0
      ) {
        if (
          details.placeName === "" &&
          response.prediction.entities["RestaurantReservation.PlaceName"]
        ) {
          details.placeName =
            response.prediction.entities["RestaurantReservation.PlaceName"];
        } else {
          if (details.placeName === "") {
            return {
              text: "Please give me the name of the restaurant",
            };
          }
        }
        if (
          details.numberPeople === 0 &&
          response.prediction.entities["RestaurantReservation.NumberPeople"]
        ) {
          details.numberPeople =
            response.prediction.entities["RestaurantReservation.NumberPeople"];
        } else {
          if (details.numberPeople === 0) {
            return {
              text: "How many people is the reservation for?",
            };
          }
        }
        if (
          details.datetime === "" &&
          response.prediction.entities.datetimeV2
        ) {
          details.datetime =
            response.prediction.entities.datetimeV2[0].values[0].resolution[0].value;
        } else {
          if (details.datetime === "") {
            return {
              text: "When would you like for me to make the reservation?",
            };
          }
        }
        if (
          details.placeName != "" &&
          details.numberPeople != 0 &&
          details.datetime != ""
        ) {
          details.type = "";
          return {
            text: `I'll make a reservation for ${details.numberPeople} people at ${details.placeName} on ${details.datetime}. Are the details correct?`,
          };
        }
      } else {
        return {
          text: "Please give me more details, such as the restaurant name, date, time and number of people",
        };
      }
    case "RestaurantReservationConfirmation":
      return {
        text: "Ok! I've made the reservation for you! Anything else I can help you with?",
      };
    case "RestaurantReservationRejection":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Sure! I'll cancel that for you!" };
    case "Confirm":
      return {
        text: "Ok! I've made the reservation for you! Anything else I can help you with?",
      };
    case "Cancel":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Sure! I'll cancel that for you!" };
    case "StartOver":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Sure! How can I help you?" };
    case "Stop":
      details = {
        type: "",
        placeName: "",
        numberPeople: 0,
        datetime: "",
      };
      return { text: "Ok! Let me know if there's anything else you need!" };
    default:
      return { text: "I'm not sure what you mean by that..." };
  }
};

// Analyze a string utterance.
getPrediction = async (props) => {
  // Values to modify.
  const LUIS_appId = process.env.APP_ID;
  const LUIS_predictionKey = process.env.PREDICTION_KEY;
  const LUIS_endpoint = process.env.PREDICTION_ENDPOINT;

  // The utterance you want to use.
  const utterance = props.query;

  // Create query string
  const queryParams = {
    "show-all-intents": true,
    verbose: true,
    query: utterance,
    "subscription-key": LUIS_predictionKey,
  };

  // Create the URI for the REST call.
  const URI = `${LUIS_endpoint}luis/prediction/v3.0/apps/${LUIS_appId}/slots/production/predict?${queryString.stringify(
    queryParams
  )}`;

  // Send the REST call.
  const response = await requestPromise(URI);

  // Display the response from the REST call.
  return getResponse({ response: JSON.parse(response) });
};

const app = require("express")();
const PORT = 8080;

app.use(cors());

app.get("/:query", async (req, res) => {
  const { query } = req.params;
  res
    .status(200)
    .send(
      await getPrediction({ query: query.replace(/_/g, " ").replace(/"/g, "") })
    );
});

app.listen(PORT, () => console.log(`It's alive on http://localhost:${PORT}`));

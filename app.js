const app = new Vue({
  el: "#app",

  data: {
    carTypes: [
      {value: "carA", name: "Auto A (kulutus 3.0l / 100km)", consumption: 3.0},
      {value: "carB", name: "Auto B (kulutus 3.5l / 100km)", consumption: 3.5},
      {value: "carC", name: "Auto C (kulutus 4.0l / 100km)", consumption: 4.0},
    ],

    carType: "carA",  // Default value
    travelDistance: 0.0,
    travelDistanceErrMsg: "",
    speedA: 0.0,
    speedAErrMsg: "",
    speedB: 0.0,
    speedBErrMsg: "",
    results: [],  // Results are stored in array
    resultsVisible: false,
  },

  methods: {

    // Set values back to defaults
    clear: function() {
      this.carType = "carA";
      this.travelDistance = 0.0;
      this.travelDistanceErrMsg = "";
      this.speedA = 0.0;
      this.speedAErrMsg = "";
      this.speedB = 0.0;
      this.speedBErrMsg = "";
      this.results = [];
      this.resultsVisible = false;
    },

    // Calculate travel times and gas consumptions and store them into results-array
    calculate: function() {
      this.travelDistance = parseInt(this.travelDistance);
      this.speedA = parseInt(this.speedA);
      this.speedB = parseInt(this.speedB);

      const validateNumber = (variable) => {
        return typeof variable === "number" && !isNaN(variable) && variable > 0;
      }

      // Validation
      {
        let valid = true;
        const genericErrMsg = "Virheellinen syöte! Tämän tulee olla numero ja suurempi kuin 0";

        if (!validateNumber(this.travelDistance)) {
          this.travelDistanceErrMsg = genericErrMsg;
          this.travelDistance = 0;
          valid = false;
        } else {
          this.travelDistanceErrMsg = "";
        }

        if (!validateNumber(this.speedA)) {
          this.speedAErrMsg = genericErrMsg;
          this.speedA = 0;
          valid = false;
        } else {
          this.speedAErrMsg = "";
        }

        if (!validateNumber(this.speedB)) {
          this.speedBErrMsg = genericErrMsg;
          this.speedB = 0;
          valid = false;
        } else {
          this.speedBErrMsg = "";
        }

        if (!valid)
          return;
      }

      // Set results area visible
      this.resultsVisible = true;
      this.results = [];

      // Calculate travel times and gas consumptions
      const travelTimeA = this.travelDistance / this.speedA;
      const travelTimeB = this.travelDistance / this.speedB;

      const gasConsumptionA = gasConsumption(
        this.carTypes.find(element => element.value === this.carType).consumption, this.speedA, this.travelDistance);

      const gasConsumptionB = gasConsumption(
        this.carTypes.find(element => element.value === this.carType).consumption, this.speedB, this.travelDistance);


      this.results.push("Matka-aika matkanopeudella A (" + this.speedA + " km/h) on " + convertNumToTime(travelTimeA) + ".");
      this.results.push("Matka-aika matkanopeudella B (" + this.speedB + " km/h) on " + convertNumToTime(travelTimeB) + ".");

      // Compare travel times
      if (travelTimeA == travelTimeB)
        this.results.push(
          "Matkanopeudet A (" + this.speedA + " km/h) ja B (" + this.speedB +
          " km/h) ovat yhtä nopeat (" + convertNumToTime(travelTimeA) + ")."
        );

      else if (travelTimeA < travelTimeB)
        this.results.push(
          "Matkanopeus A (" + this.speedA + " km/h) on " + convertNumToTime(travelTimeB - travelTimeA, "minuutin", "tunnin") +
          " nopeampi kuin matkanopeus B (" + this.speedB + " km/h)."
        );

      else
        this.results.push(
          "Matkanopeus B (" + this.speedB + " km/h) on " + convertNumToTime(travelTimeA - travelTimeB, "minuutin", "tunnin") +
          " nopeampi kuin matkanopeus A (" + this.speedA + " km/h)."
        );

      this.results.push("Kulutus matkanopeudella A (" + this.speedA + " km/h) on " + gasConsumptionA.toFixed(2) + " litraa.");
      this.results.push("Kulutus matkanopeudella B (" + this.speedB + " km/h) on " + gasConsumptionB.toFixed(2) + " litraa.");

      // Compare gas consumptions
      if (gasConsumptionA == gasConsumptionB)
        this.results.push(
          "Kulutus matkanopeuksilla A (" + this.speedA + " km/h) ja B (" + this.speedB +
          " km/h) on yhtä paljon (" + (gasConsumptionA).toFixed(2) + " litraa)."
        );

      else if (gasConsumptionA < gasConsumptionB)
        this.results.push(
          "Kulutus matkanopeudella A (" + this.speedA + " km/h) on " + (gasConsumptionB - gasConsumptionA).toFixed(2) +
          " litraa vähemmän kuin matkanopeudella B (" + this.speedB + " km/h)."
        );

      else
        this.results.push(
          "Kulutus matkanopeudella B (" + this.speedB + " km/h) on " + (gasConsumptionA - gasConsumptionB).toFixed(2) +
          " litraa vähemmän kuin matkanopeudella A (" + this.speedA + " km/h)."
        );
    }
  }
})


// Calculate gas consumption based on speed and travel distance
const gasConsumption = (consumptionPer100km, speed, distance) => {
  const slope = 1.009;
  let result = consumptionPer100km;

  // TODO: better ways to calculate it?
  for (i = 1; i < speed; ++i)
    result *= slope;

  return result * (distance / 100);
}


// Based on this example: https://speedysense.com/convert-float-to-time-in-javascript/
// Converts float to hours and minutes with appropriate spelling
const convertNumToTime = (number, minutesSpellingSpecialCase = "minuutti", hoursSpellingSpecialCase = "tunti") => {

  // Separate the int from the decimal part
  let hour = Math.floor(number);
  let decpart = number - hour;

  let min = 1 / 60;

  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  let minute = Math.floor(decpart * 60) + '';

  let hoursSpelling = "tuntia", minutesSpelling = "minuuttia";
  if (hour == 1)
    hoursSpelling = hoursSpellingSpecialCase;
  if (minute == 1)
    minutesSpelling = minutesSpellingSpecialCase;

  // Concate hours and minutes
  let time = "";
  if (hour > 0)
    time += hour + " " + hoursSpelling
  if (hour > 0 && minute > 0)
    time += " ja ";
  if (minute > 0)
    time += minute + " " + minutesSpelling;

  return time;
}
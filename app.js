

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
    results: "",
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
      this.results = "";
    },

    // Calculate travel times and gas consumptions
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

      const travelTimeA = this.travelDistance / this.speedA;
      const travelTimeB = this.travelDistance / this.speedB;
      const gasConsumptionA = gasConsumption(this.carTypes.find(element => element.value === this.carType).consumption, this.speedA, this.travelDistance);
      const gasConsumptionB = gasConsumption(this.carTypes.find(element => element.value === this.carType).consumption, this.speedB, this.travelDistance);

      this.results  = "Matka-aika matkanopeudella A on " + convertNumToTime(travelTimeA) + ".<br />";
      this.results += "Matka-aika matkanopeudella B on " + convertNumToTime(travelTimeB) + ".<br />";

      if (travelTimeA <= travelTimeB)
        this.results += "Matkanopeus A on " + convertNumToTime(travelTimeB - travelTimeA, "minuutin") + " nopeampi.<br />";
      else
        this.results += "Matkanopeus B on " + convertNumToTime(travelTimeA - travelTimeB, "minuutin") + " nopeampi.<br />";

      this.results += "Kulutus matkanopeudella A on " + gasConsumptionA.toFixed(2) + " litraa.<br />";
      this.results += "Kulutus matkanopeudella B on " + gasConsumptionB.toFixed(2) + " litraa.<br />";

      if (gasConsumptionA <= gasConsumptionB)
        this.results += "Kulutus matkanopeudella A on " + (gasConsumptionB - gasConsumptionA).toFixed(2) + " litraa vähemmän.<br />";
      else
        this.results += "Kulutus matkanopeudella B on " + (gasConsumptionA - gasConsumptionB).toFixed(2) + " litraa vähemmän.<br />";

    }
  }
})


// Calculate gas consumption based on speed and travel distance
const gasConsumption = (consumptionPer100km, speed, distance) => {
  const slope = 1.009;
  let result = consumptionPer100km;

  // TODO:
  for (i = 1; i < speed; ++i)
    result *= slope;

  return result * (distance / 100);
}


// Based on this example: https://speedysense.com/convert-float-to-time-in-javascript/
// Converts float to hours and minutes with appropriate spelling
const convertNumToTime = (number, minutesSpellingSpecialCase = "minuutti") => {

  // Separate the int from the decimal part
  let hour = Math.floor(number);
  let decpart = number - hour;

  let min = 1 / 60;

  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  let minute = Math.floor(decpart * 60) + '';

  let hoursSpelling = "tuntia", minutesSpelling = "minuuttia";
  if (hour == 1)
    hoursSpelling = "tunti";
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
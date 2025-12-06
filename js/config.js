// js/config.js
const EMISSION_FACTORS = {
  bicycle: 0, // grams of CO2 per km
  bus: 89, // grams of CO2 per km (per passenger)
  car: 192, // grams of CO2 per km (average with 1 passenger)
  truck: 158 // grams of CO2 per km
};

const COMPARISON_REFERENCES = {
  tree_co2_absorption: 21000, // grams per year
  car_yearly_emissions: 4600000, // grams per year (average car)
  person_yearly_emissions: 4000000, // grams per year (average person)
  flight_hour: 285000 // grams per hour
};

const TREES_OFFSET_PER_GRAM = 1 / COMPARISON_REFERENCES.tree_co2_absorption;
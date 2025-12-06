// js/calculator.js
class CO2Calculator {
  constructor(origin, destination, distance, transportMode) {
    this.origin = origin;
    this.destination = destination;
    this.distance = distance;
    this.transportMode = transportMode;
  }

  calculateEmission() {
    if (!this.distance || this.distance <= 0) {
      throw new Error('Invalid distance');
    }

    const emissionFactor = EMISSION_FACTORS[this.transportMode];
    if (emissionFactor === undefined) {
      throw new Error('Invalid transport mode');
    }

    const emission = (this.distance * emissionFactor) / 1000; // Convert to kg
    return Math.round(emission * 100) / 100;
  }

  getComparison(emissionKg) {
    const emissionGrams = emissionKg * 1000;

    return {
      treesNeeded: Math.ceil(emissionGrams * TREES_OFFSET_PER_GRAM),
      carYearlyPercentage: ((emissionGrams / COMPARISON_REFERENCES.car_yearly_emissions) * 100).toFixed(2),
      flightEquivalent: (emissionGrams / COMPARISON_REFERENCES.flight_hour).toFixed(2),
      personYearlyPercentage: ((emissionGrams / COMPARISON_REFERENCES.person_yearly_emissions) * 100).toFixed(2)
    };
  }

  getCarbonCredits(emissionKg) {
    const emissionGrams = emissionKg * 1000;
    
    return {
      credits: Math.round(emissionGrams / 1000),
      offset: Math.ceil(emissionGrams * TREES_OFFSET_PER_GRAM),
      compensationCost: (emissionGrams * 0.02).toFixed(2) // $0.02 per gram
    };
  }
}
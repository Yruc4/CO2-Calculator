// js/app.js - Update handleCalculation function
const uiManager = new UIManager();

function initializeApp() {
  uiManager.initializeAutocomplete();
  uiManager.setupEventListeners(handleCalculation);
}

function handleCalculation(data) {
  try {
    const calculator = new CO2Calculator(
      data.origin,
      data.destination,
      data.distance,
      data.transportMode
    );

    const emission = calculator.calculateEmission();
    const comparison = calculator.getComparison(emission);
    const credits = calculator.getCarbonCredits(emission);

    uiManager.displayResults(
      emission,
      data.origin,
      data.destination,
      data.distance,
      data.transportMode
    );
    uiManager.displayComparison(comparison);
    uiManager.displayCarbonCredits(credits);
    
    // Calculate all transport methods
    const transportComparisons = calculateAllTransportMethods(data.distance);
    uiManager.displayTransportComparison(data.distance, transportComparisons);
    
    // Display chosen method comparison
    uiManager.displayChosenMethodComparison(data.transportMode, emission, transportComparisons);
    
    uiManager.scrollToResults();
  } catch (error) {
    alert('Error calculating emissions: ' + error.message);
  }
}

function calculateAllTransportMethods(distance) {
  const transports = ['bicycle', 'bus', 'car', 'truck'];
  const comparisons = {};
  const colors = {
    bicycle: '#10b981',
    bus: '#059669',
    car: '#f59e0b',
    truck: '#ef4444'
  };

  let maxEmission = 0;

  transports.forEach(transport => {
    const calculator = new CO2Calculator('', '', distance, transport);
    const emission = calculator.calculateEmission();
    if (emission > maxEmission) maxEmission = emission;
  });

  transports.forEach(transport => {
    const calculator = new CO2Calculator('', '', distance, transport);
    const emission = calculator.calculateEmission();
    const credits = calculator.getCarbonCredits(emission);
    const comparison = calculator.getComparison(emission);

    comparisons[transport] = {
      emission: emission,
      trees: credits.offset,
      cost: credits.compensationCost,
      personPercentage: comparison.personYearlyPercentage,
      barPercentage: (emission / maxEmission) * 100,
      color: colors[transport]
    };
  });

  return comparisons;
}

document.addEventListener('DOMContentLoaded', initializeApp);
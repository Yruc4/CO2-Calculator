// js/ui.js
class UIManager {
    constructor() {
      this.originInput = document.getElementById('origin');
      this.destinationInput = document.getElementById('destination');
      this.distanceInput = document.getElementById('distance');
      this.manualDistanceCheckbox = document.getElementById('manual-distance');
      this.transportRadios = document.querySelectorAll('input[name="transport"]');
      this.form = document.getElementById('calculator-form');
      this.resultsSection = document.getElementById('results');
      this.comparisonSection = document.getElementById('comparison');
      this.carbonCreditsSection = document.getElementById('carbon-credits');
      this.transportComparisonSection = document.getElementById('transport-comparison');
      this.chosenMethodComparisonSection = document.getElementById('chosen-method-comparison');
      this.resultsContent = document.getElementById('results-content');
      this.comparisonContent = document.getElementById('comparison-content');
      this.carbonCreditsContent = document.getElementById('carbon-credits-content');
      this.transportComparisonContent = document.getElementById('transport-comparison-content');
      this.chosenMethodComparisonContent = document.getElementById('chosen-method-comparison-content');
    }
  
    initializeAutocomplete() {
      const datalist = document.getElementById('clients-list');
      datalist.innerHTML = '';
      BRAZIL_CAPITALS.forEach(capital => {
        const option = document.createElement('option');
        option.value = capital;
        datalist.appendChild(option);
      });
    }
  
    setupEventListeners(onCalculate) {
      this.manualDistanceCheckbox.addEventListener('change', () => {
        this.toggleManualDistance();
      });
  
      this.originInput.addEventListener('change', () => {
        this.updateDistance();
      });
  
      this.destinationInput.addEventListener('change', () => {
        this.updateDistance();
      });
  
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCalculate(onCalculate);
      });
    }
  
    toggleManualDistance() {
      const isManual = this.manualDistanceCheckbox.checked;
      this.distanceInput.readOnly = !isManual;
      if (!isManual) {
        this.distanceInput.value = '';
        this.updateDistance();
      }
    }
  
    updateDistance() {
      if (this.manualDistanceCheckbox.checked) return;
  
      const origin = this.originInput.value;
      const destination = this.destinationInput.value;
  
      if (origin && destination && origin !== destination) {
        const distance = getDistance(origin, destination);
        if (distance) {
          this.distanceInput.value = distance;
        } else {
          this.distanceInput.value = '';
          alert('Route not found. Please enter distance manually.');
        }
      }
    }
  
    handleCalculate(onCalculate) {
      const origin = this.originInput.value.trim();
      const destination = this.destinationInput.value.trim();
      const distance = parseFloat(this.distanceInput.value);
      const transportMode = document.querySelector('input[name="transport"]:checked').value;
  
      if (!origin || !destination || !distance || distance <= 0) {
        alert('Please fill all fields with valid data');
        return;
      }
  
      if (origin === destination) {
        alert('Origin and destination must be different');
        return;
      }
  
      onCalculate({ origin, destination, distance, transportMode });
    }
  
    displayResults(emission, origin, destination, distance, transportMode) {
      const originState = CAPITAL_STATES[origin];
      const destinationState = CAPITAL_STATES[destination];
  
      const html = `
        <h2 class="section-title">Emission Results</h2>
        <div class="result-card">
          <div class="result-card__title">Route</div>
          <div style="display: flex; gap: var(--spacing-md); align-items: center; margin-bottom: var(--spacing-md); flex-wrap: wrap;">
            <div>
              <p style="font-weight: 500; margin-bottom: 0.25rem;">${origin}</p>
              <p style="font-size: 0.85rem; color: var(--text-light);">${originState}</p>
            </div>
            <span style="font-size: 1.5rem;">→</span>
            <div>
              <p style="font-weight: 500; margin-bottom: 0.25rem;">${destination}</p>
              <p style="font-size: 0.85rem; color: var(--text-light);">${destinationState}</p>
            </div>
          </div>
          <div class="result-card__title">Distance</div>
          <p style="margin-bottom: var(--spacing-md);">${distance} km</p>
          <div class="result-card__title">Transport Mode</div>
          <p style="margin-bottom: 0; text-transform: capitalize;">${transportMode}</p>
        </div>
        <div class="result-card">
          <div class="result-card__title">CO2 Emissions</div>
          <div class="result-card__value">${emission} <span class="result-card__unit">kg</span></div>
        </div>
      `;
      this.resultsContent.innerHTML = html;
      this.resultsSection.classList.remove('hidden');
    }
  
    displayComparison(comparison) {
      const html = `
        <h2 class="section-title">Comparison & Impact</h2>
        <div class="comparison-card">
          <div class="comparison-card__label">Trees Needed to Offset</div>
          <div class="comparison-card__value">${comparison.treesNeeded}</div>
        </div>
        <div class="comparison-card">
          <div class="comparison-card__label">% of Yearly Car Emissions</div>
          <div class="comparison-card__value">${comparison.carYearlyPercentage}%</div>
        </div>
        <div class="comparison-card">
          <div class="comparison-card__label">Flight Hour Equivalent</div>
          <div class="comparison-card__value">${comparison.flightEquivalent}h</div>
        </div>
        <div class="comparison-card">
          <div class="comparison-card__label">% of Yearly Person Emissions</div>
          <div class="comparison-card__value">${comparison.personYearlyPercentage}%</div>
        </div>
      `;
      this.comparisonContent.innerHTML = html;
      this.comparisonSection.classList.remove('hidden');
    }
  
    displayCarbonCredits(credits) {
      const html = `
        <h2 class="section-title">Carbon Credits & Offset</h2>
        <div class="credits-grid">
          <div class="credit-item">
            <div class="credit-item__value">${credits.credits}</div>
            <div class="credit-item__label">Carbon Credits</div>
          </div>
          <div class="credit-item">
            <div class="credit-item__value">${credits.offset}</div>
            <div class="credit-item__label">Trees to Plant</div>
          </div>
          <div class="credit-item">
            <div class="credit-item__value">$${credits.compensationCost}</div>
            <div class="credit-item__label">Offset Cost</div>
          </div>
        </div>
      `;
      this.carbonCreditsContent.innerHTML = html;
      this.carbonCreditsSection.classList.remove('hidden');
    }
  
    displayTransportComparison(distance, comparisons) {
      let html = `
        <h2 class="section-title">All Transport Methods Comparison</h2>
        <div class="transport-comparison-grid">
      `;
  
      Object.entries(comparisons).forEach(([transport, data]) => {
        const icon = {
          bicycle: '🚴',
          bus: '🚌',
          car: '🚗',
          truck: '🚚'
        }[transport];
  
        html += `
          <div class="transport-comparison-card">
            <div class="transport-comparison-card__header">
              <span class="transport-comparison-card__icon">${icon}</span>
              <h3 class="transport-comparison-card__title">${transport.charAt(0).toUpperCase() + transport.slice(1)}</h3>
            </div>
            <div class="transport-comparison-card__content">
              <div class="transport-comparison-stat">
                <span class="transport-comparison-stat__label">CO2 Emission</span>
                <span class="transport-comparison-stat__value">${data.emission} kg</span>
              </div>
              <div class="transport-comparison-stat">
                <span class="transport-comparison-stat__label">Trees Needed</span>
                <span class="transport-comparison-stat__value">${data.trees}</span>
              </div>
              <div class="transport-comparison-stat">
                <span class="transport-comparison-stat__label">Offset Cost</span>
                <span class="transport-comparison-stat__value">$${data.cost}</span>
              </div>
              <div class="transport-comparison-stat">
                <span class="transport-comparison-stat__label">% Yearly Person</span>
                <span class="transport-comparison-stat__value">${data.personPercentage}%</span>
              </div>
            </div>
            <div class="transport-comparison-card__bar">
              <div class="transport-comparison-card__bar-fill" style="width: ${data.barPercentage}%; background-color: ${data.color};"></div>
            </div>
          </div>
        `;
      });
  
      html += `</div>`;
      this.transportComparisonContent.innerHTML = html;
      this.transportComparisonSection.classList.remove('hidden');
    }
  
    displayChosenMethodComparison(chosenTransport, chosenEmission, allComparisons) {
      const transports = ['bicycle', 'bus', 'car', 'truck'];
      const icons = { bicycle: '🚴', bus: '🚌', car: '🚗', truck: '🚚' };
      const colors = { bicycle: '#10b981', bus: '#059669', car: '#f59e0b', truck: '#ef4444' };
  
      // Find max emission for comparison
      const maxEmission = Math.max(...transports.map(t => allComparisons[t].emission));
  
      let html = `
        <h2 class="section-title">Your Choice vs. Other Methods</h2>
        <div class="chosen-method-section">
          <div class="chosen-method-header">
            <div class="chosen-method-badge">
              <span class="chosen-method-badge__icon">${icons[chosenTransport]}</span>
              <div class="chosen-method-badge__info">
                <h3 class="chosen-method-badge__title">${chosenTransport.charAt(0).toUpperCase() + chosenTransport.slice(1)}</h3>
                <p class="chosen-method-badge__emission">${chosenEmission} kg CO2</p>
              </div>
            </div>
          </div>
          
          <div class="comparison-matrix">
      `;
  
      transports.forEach(transport => {
        const data = allComparisons[transport];
        const difference = data.emission - chosenEmission;
        const percentDifference = ((difference / chosenEmission) * 100).toFixed(1);
        const isBetter = difference > 0;
        const isChosen = transport === chosenTransport;
  
        html += `
          <div class="comparison-row ${isChosen ? 'comparison-row--chosen' : ''}">
            <div class="comparison-row__header">
              <span class="comparison-row__icon">${icons[transport]}</span>
              <div class="comparison-row__info">
                <h4 class="comparison-row__title">${transport.charAt(0).toUpperCase() + transport.slice(1)}</h4>
                ${isChosen ? '<span class="comparison-row__badge">Your Choice</span>' : ''}
              </div>
            </div>
            
            <div class="comparison-row__bars">
              <div class="comparison-row__bar-wrapper">
                <div class="comparison-row__bar" style="width: ${(data.emission / maxEmission) * 100}%; background-color: ${colors[transport]};"></div>
              </div>
              <span class="comparison-row__value">${data.emission} kg</span>
            </div>
            
            <div class="comparison-row__difference">
              ${isChosen ? 
                '<span class="comparison-row__diff-text">Your choice</span>' :
                `<span class="comparison-row__diff-text ${isBetter ? 'better' : 'worse'}">
                  ${isBetter ? '↑' : '↓'} ${Math.abs(percentDifference)}%
                </span>`
              }
            </div>
          </div>
        `;
      });
  
      html += `
          </div>
        </div>
      `;
  
      this.chosenMethodComparisonContent.innerHTML = html;
      this.chosenMethodComparisonSection.classList.remove('hidden');
    }
  
    scrollToResults() {
      setTimeout(() => {
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
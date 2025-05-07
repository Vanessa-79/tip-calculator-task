import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="calculator"

export default class extends Controller {
  // Define the HTML elements that will be used in the controller
  static targets = [
    "bill",
    "tipBtn",
    "people",
    "customTip",
    "tipAmount",
    "total",
    "resetBtn",
    "errorMessage",
  ];

  connect() {
    this.reset();
    console.log("Calculator controller connected");
  }

// Event listeners for user interactions
  calculate() {


    // Get the values from the HTML elements
    const bill = parseFloat(this.billTarget.value) || 0;
    const tipPercent = this.getSelectedTipPercentage();
    const numberOfPeople = parseInt(this.peopleTarget.value) || 0;

    // Enable reset button if any values are entered
    this.resetBtnTarget.disabled = !(
      bill > 0 ||
      tipPercent > 0 ||
      numberOfPeople > 0
    );

    // Only proceed with calculation if we have valid inputs
    if (bill > 0 && numberOfPeople > 0) {
      try {


        // Client-side calculation for immediate feedback
        const tipRate = tipPercent / 100;
        const totalTip = bill * tipRate;
        const tipPerPerson = totalTip / numberOfPeople;
        const totalPerPerson = bill / numberOfPeople + tipPerPerson;

        // Update the UI immediately
        this.tipAmountTarget.textContent = `$${tipPerPerson.toFixed(2)}`;
        this.totalTarget.textContent = `$${totalPerPerson.toFixed(2)}`;
        this.hideError();

        // Send to server for logging and saving to the database
        this.sendToServer(bill, tipPercent, numberOfPeople);
      } catch (error) {
        console.error("Calculation error:", error);
        this.showError(error.message || "Error calculating values");
      }
    } else {
      // Reset display if inputs are invalid
      this.tipAmountTarget.textContent = "$0.00";
      this.totalTarget.textContent = "$0.00";
    }
  }

  // Send calculation to server (for logging/admin purposes)
  async sendToServer(bill, tipPercent, numberOfPeople) {
    try {
      const response = await fetch("/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            ?.content,
        },
        body: JSON.stringify({
          calculation: {
            bill_amount: bill,
            tip_percentage: tipPercent,
            number_of_people: numberOfPeople,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server validation error:", errorData.errors);
        if (errorData.errors && errorData.errors.length > 0) {
          this.showError(errorData.errors.join(", "));
        }
      }
    } catch (error) {
      console.error("Server communication error:", error);

    }
  }

  // Gets the currently selected tip percentage (from buttons or custom input)
  getSelectedTipPercentage() {


    // Check if any tip button is active
    const activeButton = this.tipBtnTargets.find((btn) =>
      btn.classList.contains("active")
    );

    if (activeButton) {

      // If a button is active, return its percentage
      return parseFloat(activeButton.textContent);
    } else if (this.customTipTarget.value) {

      // Use custom tip input if provided
      return parseFloat(this.customTipTarget.value);
    }

    return 0;
  }

  // Handles tip button selection
  selectTip(event) {

    // Remove active class from all buttons
    this.tipBtnTargets.forEach((btn) => btn.classList.remove("active"));

    // Make clicked button active
    event.currentTarget.classList.add("active");

    // Clear custom tip input
    this.customTipTarget.value = "";

    // Trigger calculation immediately
    this.calculate();
  }

  // Handle custom tip input
  customTipInput() {
    
    // When typing in custom tip, deselect any active buttons
    this.tipBtnTargets.forEach((btn) => btn.classList.remove("active"));

    // Trigger calculation immediately
    this.calculate();
  }

  // Resets the calculator to initial state
  reset() {
    this.billTarget.value = "";
    this.peopleTarget.value = "";
    this.customTipTarget.value = "";
    this.tipBtnTargets.forEach((btn) => btn.classList.remove("active"));
    this.tipAmountTarget.textContent = "$0.00";
    this.totalTarget.textContent = "$0.00";
    this.resetBtnTarget.disabled = true;
    this.hideError();
  }

  // Shows error message
  showError(message) {
    if (this.hasErrorMessageTarget) {
      this.errorMessageTarget.textContent = message;
      this.errorMessageTarget.classList.remove("hidden");
    } else {
      console.error("Error:", message);
    }
  }

  // Hides error message
  hideError() {
    if (this.hasErrorMessageTarget) {
      this.errorMessageTarget.classList.add("hidden");
    }
  }
}
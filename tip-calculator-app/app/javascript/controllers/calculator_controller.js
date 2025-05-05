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
  ];
 
  connect() {
    this.reset();
  }
  
  // Calculation method
  async calculate() {
    // Get the values from the HTML elements
    const bill = parseFloat(this.billTarget.value) || 0; 
    const tipPercent = this.getSelectedTipBtn();
    const numberOfPeople = parseInt(this.peopleTarget.value) || 0;

    // Validate the inputs
    if (bill > 0 && numberOfPeople > 0) {
      try {
        const response = await fetch("/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
          },
          body: JSON.stringify({
            calculation: {
              bill_amount: bill,
              tip_percentage: tipPercent,
              number_of_people: numberOfPeople,
            },
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Update the UI with the calculated values
          this.tipAmountTarget.textContent = `$${data.tip_amount}`;
          this.totalTarget.textContent = `$${data.total_amount}`;
          this.resetTarget.disabled = false;
          this.hideError();
        } else {
          // Show validation errors if any
          this.showError(data.errors.join(", "));
        }
      } catch (error) {
        this.showError("An error occurred while calculating.");
      }

  }
}

// Gets the currently selected tip percentage from buttons or custom input
getSelectedTipBtn() {
  // check if any tip button is active
  const activeButton = this.tipBtnTargets.find((btn) => 
    btn.classList.contains("active"));

  if (activeButton) {
    return parseFloat(activeButton.textContent);
  } else {
    // If no button is active, use the custom tip input
    return parseFloat(this.customTipTarget.value) || 0;
  }
}

// handles tip button selection
selectTip(event) {
  // Remove active class from all buttons
  this.tipBtnTargets.forEach((btn) => btn.classList.remove("active"));
  // Make clicked button active
  event.currentTarget.classList.add("active");
  // Clear custom tip input
  this.customTipTarget.value = "";
  // Trigger calculation
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
  this.resetTarget.disabled = true;
  this.hideError();

}


// Shows error message

showError(message) {
  if (this.hasErrorMessageTarget){
    this.errorMessageTarget.textContent = message;
    this.errorMessageTarget.classList.remove("hidden");
  }
}

// Hides error message
hideError() {
  if (this.hasErrorMessageTarget){
    this.errorMessageTarget.classList.add("hidden");
  }
}
}
  
        
      








      



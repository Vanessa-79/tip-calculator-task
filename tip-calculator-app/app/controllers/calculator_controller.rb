class CalculatorController < ApplicationController
  
  def index
    @calculation = TipCalculation.new 
  end

  def calculate
  @calculation = TipCalculation.new(calculation_params)
  
  if @calculation.save
    # If the calculation is successful, return the calculated amounts
    render json: {
      tip_amount: format_amount(@calculation.tip_amount),
      total_amount: format_amount(@calculation.total_amount),
      success: true
    }
  else

    # If validation fails, return the error messages
    render json: { 
      errors: @calculation.errors.full_messages,
      success: false 
    }, status: :unprocessable_entity
  end
end

private


 # Only allow these specific parameters to be passed
def calculation_params
  params.require(:calculation).permit(:bill_amount, :tip_percentage, :number_of_people)
end

# Formats a number as a string with exactly 2 decimal places
def format_amount(amount)
  sprintf('%.2f', amount)
end

end

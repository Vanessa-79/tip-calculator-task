class CalculatorController < ApplicationController
  # Initialize new calculator instance
  def index
    @tip_calculate = TipCalculate.new
  end
  
  # Handle AJAX calculation request
  def calculate
    @tip_calculate = TipCalculate.new(calculation_params)
    
    # Calculate derived values before saving
    calculate_amounts
    
    # Save calculation for admin dashboard and return result
    if @tip_calculate.save
      render json: {
        success: true,
        tip_amount: format_amount(@tip_calculate.tip_amount),
        total_amount: format_amount(@tip_calculate.total_amount)
      }
    else
      render json: {
        success: false,
        errors: @tip_calculate.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue StandardError => e
    render json: {
      success: false,
      errors: [e.message]
    }, status: :internal_server_error
  end

  private
  
  # Strong parameters for security
  def calculation_params
    params.require(:calculation).permit(:bill_amount, :tip_percentage, :number_of_people)
  end
  
  # Calculate tip and total amounts
  def calculate_amounts
    # Convert inputs to float for accurate calculations
    bill = @tip_calculate.bill_amount.to_f
    tip_rate = @tip_calculate.tip_percentage.to_f / 100
    people = @tip_calculate.number_of_people.to_f
    
    # Calculate total tip
    total_tip = bill * tip_rate
    
    # Calculate tip per person
    @tip_calculate.tip_amount = total_tip / people
    
    # Calculate total per person (bill share + tip share)
    @tip_calculate.total_amount = (bill / people) + @tip_calculate.tip_amount
    
    # Round to 2 decimal places
    @tip_calculate.tip_amount = @tip_calculate.tip_amount.round(2)
    @tip_calculate.total_amount = @tip_calculate.total_amount.round(2)
  end
  
  # Format amount to 2 decimal places as string
  def format_amount(amount)
    "%.2f" % amount
  end
end
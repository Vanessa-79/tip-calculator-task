class TipCalculate < ApplicationRecord
  validates :bill_amount, presence: true, numericality: { greater_than: 0 }
  validates :tip_percentage, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :number_of_people, presence: true, numericality: { greater_than: 0 }
  validates :tip_amount, presence: true
  validates :total_amount, presence: true

# Callbacks
    before_validation :calculate_amounts
    before_save :round_amounts


# private methods
    private

    # Calculate the tip and total amounts based on the input values
    def calculate_amounts
        return if bill_amount.blank? || tip_percentage.blank? || number_of_people.blank?
        # Calculate the tip amount
        self.tip_amount = (bill_amount * tip_percentage / 100.0) / number_of_people

        # Calculate the total amount per person
        self.total_amount = (bill_amount + (bill_amount * tip_percentage / 100.0)) / number_of_people
    end

    # Round the amounts to 2 decimal places
    def round_amounts
        self.tip_amount = tip_amount.round(2) 
        self.total_amount = total_amount.round(2)
    end





end

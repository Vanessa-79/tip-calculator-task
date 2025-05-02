class TipCalculate < ApplicationRecord
    bill_amount: presence, greater_than: 0
    tip_percentage: presence, between: 0, 100
    number_of_people: presence, greater_than: 0
    tip_amount: presence
    total_amount: presence 

# Callbacks
    beforre_validation: calculate_amounts
    before_save: round_amounts


# private methods
    calculate_amounts: computes tip and total per person
    round_amounts: rounds monetary values to 2 decimals




end

class TipCalculate < ApplicationRecord
  validates :bill_amount, presence: true, numericality: { greater_than: 0 }
  validates :tip_percentage, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :number_of_people, presence: true, numericality: { greater_than: 0 }
  validates :tip_amount, :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
end
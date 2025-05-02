class CreateTipCalculates < ActiveRecord::Migration[8.0]
  def change
    create_table :tip_calculates do |t|
      t.decimal :bill_amount
      t.decimal :tip_percentage
      t.integer :number_of_people
      t.decimal :tip_amount
      t.decimal :total_amount

      t.timestamps
    end
  end
end

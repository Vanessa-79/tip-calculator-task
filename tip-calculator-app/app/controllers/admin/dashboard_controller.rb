class Admin::DashboardController < ApplicationController
  before_action :authenticate_admin_user!
  before_action :set_date_range, only: [:index]

  def index
    @calculations = TipCalculate
      .where(created_at: @start_date..@end_date)
      .order(created_at: :desc)
      .page(params[:page])
      .per(10)  
      
    # Calculate statistics
    @total_tips = TipCalculate.where(created_at: @start_date..@end_date).sum(:tip_amount)
    @average_tip_percentage = TipCalculate.where(created_at: @start_date..@end_date).average(:tip_percentage)
    @total_bills = TipCalculate.where(created_at: @start_date..@end_date).sum('total_amount * number_of_people')
  end

  private

  def set_date_range
    @end_date = Time.current
    @start_date = params[:start_date].present? ? 
      Time.parse(params[:start_date]) : 
      30.days.ago
  end
end
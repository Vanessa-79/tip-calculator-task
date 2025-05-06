Rails.application.routes.draw do
  devise_for :admin_users
  namespace :admin do
    get "dashboard", to: "dashboard#index"
    get "dashboard/index"
  end

# Defines the route for the index action of the calculator controller
  get "calculator/index" 



  # Defines the root path route ("/")
  root "calculator#index"

end

Rails.application.routes.draw do

# Defines the route for the index action of the calculator controller
  get "calculator/index" 



  # Defines the root path route ("/")
  root "calculator#index"
end

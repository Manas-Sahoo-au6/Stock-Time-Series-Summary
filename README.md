# Stock Time Series Summary
___
## How I approach to solve this project
> The aproach to solve this problem take me some time to think but , finally did it.
>the main tricky thing was the tingo api that make me some confusion for scrapping the appropriate data 
> The Other VWAP formulae and the api data should need some calculations to got required data fit for f0rmulae.

___

## step2: How to run the code 
  ### requirement 1: authentication token for tingoapi by signup
  ### requirement 2:  Google credentials for googlesheetapi
  ### requirement 3: node install in computer 


## step 2:
> Install all npm packages to run code properly by writing command `npm install --save`
> Then set the `token key` and Googleapi sheet credentials like clientemail and private key 
> then run the command `npm start `
> the console log sucess data after check the sheet the data has been updated sucessfully 
>if the data is there in sheet before than delete and try to run code it again gave last 30days data from api .



# Note the api give only 5 to 8 requests for free trial so if api token got expires get new token by creating new account in tingoapi
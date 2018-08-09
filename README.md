# Hotels Hack

- This project is intended to work with this [Spreadsheet](https://docs.google.com/spreadsheets/d/1pVSpzLSew_goTTsa1eukKsWxETe2d_cHT5jpZSx0iCk/edit?usp=sharing)
  
- The idea is to make it easier to keep track and choose the best cost-benefit place to stay during a trip. It will personally help a lot for a upcoming trip in February 2019.

- The current endpoint of the application is: `https://wt-3457dd39a9a5d1e9c3bd001681315c5c-0.sandbox.auth0-extend.com/auth0`

- For Airbnb you can choose the following variables: 
  - Location: e.g. -> `Salt Lake City`
  - Guests: Number of guests
  - Check In: It has to be in the format -> `MM-DD-YYYY`
  - Check Out: It has to be in the format -> `MM-DD-YYYY`

- I had to fork a library called [airbnbapi](https://github.com/zxol/airbnbapi) because it didn't have the checkin and checkout search feature
- Also I had to publish this forked library into npm because webtask.io do not let us get a node_module from a public github repo.

- The other dependency that I've chosen is [await-to-js](https://github.com/scopsy/await-to-js) because it makes async/await much more enjoyable.
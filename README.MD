# Iván Pérez's Carto Job Application

Made with ❤️ by [Iván Pérez][myself]

## Tech

This project uses the following open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [axios] - promise based HTTP client for node.js
- [mocha] & [chai] - testing framework

The project itself on [github][public-repo].

## Installation

This project requires [Node.js][node.js] v10+ to run.

Download or clone the [repository][git-repo-url].

Create a new application at [Your Carto's Developers Workspace][carto-dev]
After creating the application, create an .env file at the project root with the following contents:

```sh
CARTO_CLIENT_ID = "<your_cartoapp_client_id>"
CARTO_CLIENT_SECRET = "<your_cartoapp_client_secret>"
```

Install the dependencies and devDependencies and start the server.

```sh
cd ivanperezcartoapi
npm install
npm start
```

To run tests (be sure that api is running!)

```sh
npm test
```

## Usage

The api will run at http://localhost:3003, and provides one endpoint for each use case.

### Use Case 1: Statistical measurement for stations

Endpoint for the request is available at:

```sh
GET /measurements/{pollutant}
```

To work properly, the endpoint needs other parameters sent through the request's querystring, as follows:

```sh
/measurements/{pollutant}?aggregate={aggregate}&datetime_start={datetime_start}&datetime_end={datetime_end}
```

Full sample request:

```sh
/measurements/so2?aggregate=avg&datetime_start=2016-11-14T01:00:00.000Z&datetime_end=2016-11-30T22:30:00.000Z
```

#### Summary of endpoint parameters

| PARAMETER      | FROM        | TYPE   | VALUE                         | REQUIRED |
| -------------- | ----------- | ------ | ----------------------------- | -------- |
| pollutant      | route       | string | so2, no2, pm10, pm2_5, co, o3 | yes      |
| aggregate      | querystring | string | count, sum, min, max, avg     | yes      |
| datetime_start | querystring | string | ISO-8601 date                 | yes      |
| datetime_end   | querystring | string | ISO-8601 date                 | yes      |

#### Returns

An array of stations with measurement data aggregated by the provided aggregator function, filtered by the provided date range and population data of the geographical grid the station is located in.

| NAME                 | TYPE   | DESCRIPTION                        |
| -------------------- | ------ | ---------------------------------- |
| station_id           | string | Station Code                       |
| pollutant_aggregated | number | Aggregated value of the pollutant  |
| population           | number | Population affected by the Station |

### Use Case 2: Statistical measurement for stations as a time series

Endpoint for the request is available at:

```sh
GET /timeserie/{pollutant}
```

To work properly, the endpoint needs other parameters sent through the request's querystring, as follows:

```sh
/timeserie/{pollutant}?aggregate={aggregate}&datetime_start={datetime_start}&datetime_end={datetime_end}&step=step
```

Full sample request:

```sh
/timeserie/so2?aggregate=avg&datetime_start=2016-11-14T01:00:00.000Z&datetime_end=2016-11-30T22:30:00.000Z&step=day
```

#### Summary of endpoint parameters

| PARAMETER      | FROM        | TYPE   | VALUE                         | REQUIRED |
| -------------- | ----------- | ------ | ----------------------------- | -------- |
| pollutant      | route       | string | so2, no2, pm10, pm2_5, co, o3 | yes      |
| aggregate      | querystring | string | count, sum, min, max, avg     | yes      |
| datetime_start | querystring | string | ISO-8601 date                 | yes      |
| datetime_end   | querystring | string | ISO-8601 date                 | yes      |
| step           | querystring | string | year, month, week, day, hour  | yes      |

#### Returns

An array of stations with measurement data aggregated by the provided aggregator function, filtered by the provided date range and grouped by the provided step. A post-processing on the data is performed to group measurements by station inside the measurements field.

| NAME         | TYPE   | DESCRIPTION           |
| ------------ | ------ | --------------------- |
| station_id   | string | Station Code          |
| measurements | Array  | Array of measurements |

Each element on the measurements array always has the **pollutant_aggregated** field as in Use Case 1, and then a number of datetime components based on the requested step grouping strategy.

| STEP  | YEAR | MONTH | WEEK | DAY | HOUR |
| ----- | ---- | ----- | ---- | --- | ---- |
| year  | ☑    |       |      |     |
| month | ☑    | ☑     |      |     |
| week  | ☑    |       | ☑    |     |
| day   | ☑    | ☑     |      | ☑   |
| hour  | ☑    | ☑     |      | ☑   | ☑    |

## How did I work on this project

First, I figured out the Authentication mechanism to be able to perform queries on Carto's GCP. Basically I built an application inside my Carto's Workspace and tested the auth endpoint to check if I got a proper token.

Once I got the token and was able to perform queries, I built a query requester, that is in charge of sending queries to Carto's Query endpoint and getting a new token if the current one has expired.

Then, for each of the proposed Use Cases, my workflow iteration was as follows:

- Build the query inside POSTMAN until I came with the expected results.
- Write Typescript types, interfaces or classes needed to model both receive the parameters needed for the query and the results of running the query. If a new domain of data was needed, I'd create a new enum.
- Code the service part of the solution. Retrieve data using the query requester, and transform data if needed.
- Add a custom endpoint to the api to expose the service part.
- (optional) Put tests in place to test for both breaking and non-breaking use cases of the current endpoint.
- Provide, at least, minimum documentation on the main parts of the code.
- Refactor and clean-up code.

As time was constrained, I purposely left tests out of the workflow iterations to be implemented afterwards. In my day-to-day, building tests are always inside the workflow iteration.

After having both Use Cases up and running, I spent some time thoroughly documenting all the code and the queries. Also, now having the whole picture of the project in place, it was time to perform the last big refactor taking into account all the parts of the solution, mostly rearranging constants, domains and models and sorting common code together.

Finally, I delved onto Carto's Builder and built a [map][builder] representing Use Case 1; in particular I'm showing the stations and the maximum measured value of o3 in the year 2016 on one layer, and the filtered geographical grid with population in which the stations are on another layer.

> That's all.
> Feel free to contact me on any clarification needed on the provided solution and code. It's been a pleasure working with the Carto platform.
>
> Iván Pérez

[public-repo]: https://github.com/lukegothic/ivanperezcartoapi
[git-repo-url]: https://github.com/lukegothic/ivanperezcartoapi.git
[myself]: https://github.com/lukegothic
[node.js]: http://nodejs.org
[express]: http://expressjs.com
[axios]: https://axios-http.com
[mocha]: https://mochajs.org
[chai]: https://www.chaijs.com
[carto-dev]: https://pinea.app.carto.com/developers
[builder]: https://pinea.app.carto.com/map/e2e92ea7-d2be-4db1-a04a-f26fe3c5155e

# Martian robots

Express node.js api solution for Martian robots technical assessment.

## The problem
> The surface of Mars can be modelled by a rectangular grid around which robots are able to move according to instructions provided from Earth. You are to write a program that determines each sequence of robot positions and reports the final position of the robot.
> A robot position consists of a grid coordinate (a pair of integers: x-coordinate followed by y-coordinate) and an orientation (N, S, E, W for north, south, east, and west). A robot instruction is a string of the letters "L", "R", and "F" which represent, respectively, the instructions:
>
> - Left: the robot turns left 90 degrees and remains on the current grid point.
> - Right: the robot turns right 90 degrees and remains on the current grid point.
> - Forward: the robot moves forward one grid point in the direction of the current orientation and maintains the same orientation.
>
> The direction North corresponds to the direction from grid point (x, y) to grid point (x,y+1).
> There is also a possibility that additional command types may be required in the future and provision should be made for this.
> Since the grid is rectangular and bounded (...yes Mars is a strange planet), a robot that moves "off" an edge of the grid is lost forever. However, lost robots leave a robot "scent" that prohibits future robots from dropping off the world at the same grid point. The scent is left at the last grid position the robot occupied before disappearing over the edge. An instruction to move "off" the world from a grid point from which a robot has been previously lost is simply ignored by the current robot.

## Usage

>The first line of input is the upper-right coordinates of the rectangular world, the lower-left coordinates are assumed to be 0, 0.
>
>The remaining input consists of a sequence of robot positions and instructions (two lines per robot). A position consists of two integers specifying the initial coordinates of the robot and an orientation (N, S, E, W), all separated by whitespace on one line. A robot instruction is a string of the letters "L", "R", and "F" on one line.
>
>Each robot is processed sequentially, i.e., finishes executing the robot instructions before the next robot begins execution. The maximum value for any coordinate is 50. All instruction strings will be less than 100 characters in length.

## Pre-requeriments

You need to have either Node or [Docker](https://docs.docker.com/engine/install/) & [Docker-compose](https://docs.docker.com/compose/install/) previously installed in your system.

## Technical explanation
The project is build using the following tools
- Node JS
- Express JS framework
- Swagger for REST API documentation
- Postgresql
- Sequelize ORM for database (tables and relation defined at `/models`. It has auto sync function for altering tables from models definition)
- Docker and Docker compose for deployment of API and Postgresql services
- Mocha, chai, chaihttp for the rest api endpoints

## Usage
#### Docker
Docker and docker-compose is the preferred way to deploy this project. Not only because it is one command launch, also becuase the project will build and launch a postgresql service for persistence layer.

`docker-compose up` will launch API and Postgresql database.

The configuration is at `docker-compose-yml` file. *You may change postgres service volume directory if that path does not exist in your system. This is used for the persistence of the database once the docker is stopped.

#### Node

First install all project necessary dependencies.

`npm install`

Then you can launch the express application by executing.

`npm run dev` (for deployment and webpack) or `npm start`

### Swagger

There is a swagger documentation for the current endpoints. Once the project is launched you can check the docs and test the endpoints here:

`http://localhost:3000/api-docs/#/`

### Persistence layer DB
Persistence is only obtained if you deployed using docker-compose. Otherwise, it will not have persistence layer.

Take note that scents are saved and persisted, so once a scent is saved it will alter followings robots.

*Using standalone node deploy, there is a simple persistence for grid scents. Data will be stored in a js object. It will persist as long as the lifecycle of the express app. It will be reset on every app start up.
### Tests
There are some already defined tests at `/tests`.
There are unit tests against project endpoints via http. So the project should be already running (docker or node).

With the project already running execute tests by:

`npm run test`

It will test the endpoints against the expected performance defined at test files.

### Extra, insights, stats
The project stores some of the metada done by the robots.

Besides the scent data there are 2 extra tables resuming stats from each robot and grids.

`Robot_stats` and `Grid_stats`

- Grid_stats example:
```json
    {
        "id": 1,
        "totalForwardMovements": 400,
        "totalRightMovements": 266,
        "totalLeftMovements": 295,
        "totalLostRobots": 1,
        "createdAt": "2021-02-07T10:52:37.559Z",
        "updatedAt": "2021-02-07T23:21:24.928Z",
        "idGrid": 1
    }
```
- Robot_stats example:
```json
    {
        "id": 96,
        "idRobot": 96,
        "r": 4,
        "l": 4,
        "f": 4,
        "updatedAt": "2021-02-07T21:16:47.474Z",
        "createdAt": "2021-02-07T21:16:47.474Z"
    }
```

If you use docker this data is also returned in the post /robot endpoint, on the fly data.
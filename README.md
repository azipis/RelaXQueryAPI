# RelaXQueryAPI
Small web api running on nodeJS to query RelaX to compare a submitted answer vs. a correct answer.

## How to run
1. Clone respository.
2. Navigate into project directory
3. Run docker-compose up

## How to create docker networks
1. Create the Docker network called pl_network  
`docker network create pl_network`
2. Add the container 'pl' to pl_network  
`docker network connect pl_network pl`
3. Add the container 'relaxAPI' to pl_network  
`docker network connect pl_network relaxAPI`

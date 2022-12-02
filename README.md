# Bloody Nose API

> API for the Bloody Nose app.
> Live demo [_here_](https://xavier-sans-back-final-project-202209-bcn.onrender.com/).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Endpoints](#endpoints)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

API rest that manages all user and sessions information for the Bloody Nose application.

## Technologies Used

- Node
- Express
- Typescript
- Bcrypt
- Chalk
- Cors
- Debug
- Dotenv
- Express-validation
- Fishery
- Joi
- JSONwebtoken
- Mongoose
- Morgan
- Multer
- Nodemon

## Setup

You will find all the dependencies at the _package.json_ file. Run the command _npm install_ in your CLI to install them.

The command _npm run start_ starts the server in the development mode.
You will need to specify a port to open it in a http://localhost address.

The command _npm run start:dev_ starts the server in watch mode.

## Endpoints

- (POST) /users/register -> Must create a new user with an encrypted password. Body -> Its body must have an user object with the following properties: id, username and email.
- (POST) /users/login -> Log the user into the application. Body -> Its body must return an object with a valid token.

### Protected endpoints

- (GET) /sessions/list -> Retrieves a list of available sessions when te request contains a valid token. Body -> Its body must return a list of sessions.
- (GET) /sessions/session/:id -> Retrieves a session when te request contains a valid token. Body -> Its body must return a session.
- (POST) /sessions/add -> Allows the user to create a new session. Body -> Its body must return an object with a valid session.
- (DELETE) /sessions/delete -> Allows the user to delete a session. Body -> Its body must return an object with a delete confirmation message.
- (PATCH) /sessions/edit/:id -> Allows the user to edit a session. Body -> Its body must return an object with the edited session.

## Project Status

Project is: _in progress_

## Room for Improvement

Room for improvement:

To do:

## Acknowledgements

- Many thanks to everyone who supported me along the road that took me here. What a hell of a ride.

## Contact

Created by [Xavi](https://www.linkedin.com/in/xaviersansb/) - feel free to contact me!

# Technical Document <!-- omit in toc -->

## API Keys
* If you want to test this code for yourself, you will need to create an account with Firebase for the API keys, as well as apply for a Merriam-Webster dictionary API key. 
* You can create an account for a Firebase key [here](https://firebase.google.com/), and apply for a Merriam-Webster key [here](https://dictionaryapi.com/). 
* The Firebase API key can be changed in `it-3-vibing-cats\client\src\environments\environment.ts` and `client\src\environments\environment.prod.ts`.
* The Merriam-Webster API key can be changed in `it-3-vibing-cats\client\src\app\services\dictionary-service\dictionary.service.ts`.
* ⚠️ This must be done before the step-by-step deployment, otherwise some features will not work!


## Step-by-step deployment:
1. In order to run WordRiver on your system, you will need to have the following software installed on your system: the latest version of Java, MongoDB, and Angular CLI.
2. Once you have cloned the repository to your system, open the `it-3-vibing-cats` folder.
3. Open your terminal/command line in your directory, and type `cd .\client\`.
4. Now that you are in the client folder, run `npm install`. This process may take a few minutes to complete, so please be patient.
5. Once `npm install` has finished running, type in `cd ..\database\`.
6. If you are on Windows, type in `.\mongoseed.bat`. If you are on MacOS or Linux, type in `.\mongoseed.sh`.
7. Once that process has completed, type in `cd ..\server\`.
8. Type in `.\gradlew run`. This will run the server.
9. Open a new terminal and type `cd .\client\`.
10. Finally, type `ng serve -o`. This will build the project and open it in your default browser.

## Signing up.
1. In order to use the service, you will need to sign up for WordRiver.
2. You must provide a name, email, and password. You also have the option of providing a profile picture.
3. Once you have signed up, you can now create learners, context packs, and wordlists!

## Running Tests
1. If you’d like to run our tests, click in the terminal window running `ng serve`, then hit `CTRL+C`. This will stop the current build of the project.
2. Type in `ng test` if you’d like to run the Karma tests.
3. Type in `ng e2e` if you’d like to run the Cypress tests.
4. To run the server tests, click in the terminal window running `.\gradlew run`, then hit `CTRL+C`. 
5. You will be asked to `Terminate Batch Job`, type in `y`.
6. Type in `.\gradlew test` to run the server tests.

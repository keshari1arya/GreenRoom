# GreenRoom

The project was generated using the [Clean.Architecture.Solution.Template](https://github.com/jasontaylordev/GreenRoom) version 8.0.5.

## Prerequisite

node 20 or higher (install using nvm, recommended)
dotnet sdk 8 or higher
docker (latest)
docker compose


## Build

Run `dotnet build -tl` to build the solution.

## Run
On the root folder to run database and localstack (for mocking aws in local machine):
```bash
docker-compose up -d
```



### API:

```bash
cd .\src\Web\
dotnet watch run
```

Navigate to https://localhost:5001. The application will automatically reload if you change any of the source files.

### UI:
```bash
cd .\src\UI\
yarn dev
```

For more options go to package.json 

## Code Styles & Formatting

The template includes [EditorConfig](https://editorconfig.org/) support to help maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The **.editorconfig** file defines the coding styles applicable to this solution.

## Code Scaffolding

The template includes support to scaffold new commands and queries.

Start in the `.\src\Application\` folder.

Create a new command:

```
dotnet new ca-usecase --name CreateTodoList --feature-name TodoLists --usecase-type command --return-type int
```

Create a new query:

```
dotnet new ca-usecase -n GetTodos -fn TodoLists -ut query -rt TodosVm
```

If you encounter the error *"No templates or subcommands found matching: 'ca-usecase'."*, install the template and try again:

```bash
dotnet new install Clean.Architecture.Solution.Template::8.0.5
```

## Test

### API

The solution contains unit, integration, and functional tests.

To run the tests:
```bash
dotnet test
```

### UI

Goto up app and run ng test

## Help
To learn more about the template go to the [project website](https://github.com/jasontaylordev/CleanArchitecture). Here you can find additional guidance, request new features, report a bug, and discuss the template with other users.
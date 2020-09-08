# Pull down an image from Docker Hub that includes the .NET core SDK: 
# https://hub.docker.com/_/microsoft-dotnet-core-sdk
# This is so we have all the tools necessary to compile the app.
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env

# Fetch and install Node 10. Make sure to include the --yes parameter 
# to automatically accept prompts during install, or it'll fail.
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs

WORKDIR /src

# Copy everything else and build
COPY . ./
RUN dotnet publish DragAndDropSignalR -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /src
COPY --from=build-env /src/out .

# Expose port 80 to your local machine so you can access the app.
EXPOSE 80

ENTRYPOINT ["dotnet", "DragAndDropSignalR.dll"]
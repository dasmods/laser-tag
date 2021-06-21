# Setup Guide
* Create a [Roblox account](https://www.roblox.com/) and request to join the [dasmods group](https://www.roblox.com/groups/11091721/Dasmods?nl=true#!/about).

* Download [Roblox Studio](https://www.roblox.com/create), and register for a Roblox Studio account.

* In order to clone the repository you'll need to create an SSH for your machine and import it into your GitHub account. [Configuring SSH pairs](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

* In the folder that you want to import the project into, execute:
```
git clone git@github.com:dasmods/laser-tag.git
```

* Install [node.js](https://nodejs.org/en/) if you haven't already done so. Use version v14.17.0. Run the following command to install the dependencies:
```
npm install -g roblox-ts
```

* Download and open [VS Code](https://code.visualstudio.com/) and install the following extensions:
  * roblox-ts.vscode-roblox-ts
  * evaera.vscode-rojo

* Compile the project in watch mode:
```
rbxtsc -w
```

# Troubleshooting
### When running `rbxtsc -w` and getting the error `___ cannot be loaded because running scripts is disabled on this system.`
Run the following command in Windows Powershell to give your current user complete access to run all scripts (including unsigned and potentially malicious ones):
`Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`
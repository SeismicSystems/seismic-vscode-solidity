# Seismic VSCode Extension (Beta Release)

The Seismic VSCode Extension is a beta release designed for the Seismic core team and developers building on the Seismic ecosystem. It provides early access to development tools and workflows, allowing contributors to test features and provide feedback during the development process.

## ⚠️ Important Warnings
- **Beta Release**: This is an early version of the extension, and features may be incomplete or unstable. Expect potential breaking changes in future updates.
- **Not for Production**: This extension is not intended for production use. Use it at your own risk.
- **For Developers Only**: This release is targeted at developers collaborating with the Seismic core team or building on top of the Seismic ecosystem.


### Features
- Intuitive tools like syntax highlighting and code completion to improve the coding experience.
- Streamlined workflows for project setup and efficient development.
- Early integrations with core tools to support seamless Seismic ecosystem development.

## Installation Instructions

The extension can either be downloaded from the Visual Studio Code Extensions Marketplace or by installing manually. 
### Manual installation
Follow these steps to generate and install the Seismic VSCode Extension `.vsix` file using the command line:

#### Prerequisites

Ensure the **VSCode CLI (`code`)** is installed and available in your system's `PATH`. You can check this by running:
  ```sh
  code --version
  ```

If the command is not recognized, enable it in VSCode:
- Open the Command Palette
- Type `Shell Command: Install 'code' command in PATH` and select it.
- Restart your terminal for the changes to take effect.


#### 1. Produce the `.vsix` File
To generate the `.vsix` file from the extension source code:

1. Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

2. Clone the repository for the Seismic extension:
   ```sh
   git clone https://github.com/SeismicSystems/seismic-vscode-extension.git
   cd seismic-vscode-extension
   ```
   or if you have access via SSH:
   ```sh
   git clone git@github.com/SeismicSystems/seismic-vscode-extension.git
   cd seismic-vscode-extension

3. Install dependencies:
   ```sh
   npm install
   ```
4. Package the extension into a .vsix file:
   ```sh
   npm run package
   ```
   This will create a file named something like `seismic-vscode-extension-0.1.0.vsix` in the current directory.
#### 2. Install the `.vsix` file
1. Install the `.vsix` File in VSCode:
   ```sh
   code --install-extension seismic-vscode-extension-0.1.0.vsix
   ```
Replace `seismic-vscode-extension-0.1.0.vsix` with the actual filename of the .vsix file generated.

2. Verify installation
  ```sh
  code --list-extensions
  ```

## Usage Instructions
This extension is designed for developers actively working with Seismic-based tools or contributing to the Seismic ecosystem. To get started after installation,

1. **Open Your Project**:  
   Open your Seismic development project in Visual Studio Code.

2. **Explore Features**:  
   Experiment with the available features and workflows to provide valuable feedback to the team.

## Contributing and Support
Since this is a highly experimental extension, code contributions are currently limited to core Seismic team members. However, we are constantly looking for high-quality feedback from developers via the following channels:
- Telegram: [@lyronctk](https://t.me/lyronctk)
- Email: [l@seismic.systems](mailto:l@seismic.systems)

## Credits
This extension is a fork of [Juan Blanco's](https://github.com/juanfranblanco) [widely-used extension](https://github.com/juanfranblanco/vscode-solidity). We would like to thank him and other contributors to the extension for enabling us to build on top of it.
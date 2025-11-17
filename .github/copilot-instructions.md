<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Angular 20 Expense Splitter Project

This project is an Angular 20 web application for splitting expenses among participants.

## Features
- **Authentication**: Azure AD authentication with MSAL Angular
- Add participants using Material Chips
- Add expenses using Material Form Fields
- Signal-based state management for participants and expenses
- Computed signals for settlement calculations
- Settle Up view for payment management
- Expense History with Material Expansion Panels
- Local storage persistence
- GitHub MCP service integration
- Protected routes with authentication guard

## Project Setup Progress

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project  
- [x] Customize the Project
- [x] Install Required Extensions (Not needed for this project)
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete

## Development Guidelines
- Use Angular 20 with TypeScript
- Implement signal-based reactive state management
- Use Angular Material components for UI
- Store data in local storage
- Follow Angular best practices and style guide

## Project Structure Completed
- **Authentication**: MSAL Angular integration with Azure AD
  - Login component with fullscreen UI
  - Auth guard for route protection
  - MSAL configuration with OAuth flow
  - User profile display (name and email)
- Core models and interfaces for Participant, Expense, Settlement
- ExpenseService with Angular signals for reactive state management
- Components: Login, MainLayout, Participants, ExpenseForm, SettleUp, ExpenseHistory, GitHubIntegration
- GitHub MCP service for repository operations
- Material Design UI with responsive layout
- Local storage persistence with SSR compatibility

## Authentication Setup
- Azure AD Client ID: `9f31697a-b36a-4e2c-85b5-607d9c4283f4`
- Azure AD Tenant ID: `b210c743-80a7-4519-985b-d870f711a83e`
- Login page: `/login` (fullscreen with gradient background)
- All routes protected by auth guard except login
- Displays user name and email after successful login
- Sign out functionality included

## Usage
The application is now running on http://localhost:4200 and includes:
1. Login page - Azure AD authentication with MSAL
2. Setup tab - Add participants and expenses
3. Settle Up tab - View payment recommendations
4. History tab - Browse expense history with expansion panels
5. GitHub tab - Integrate with MCP server for repository operations

The project is fully functional and ready for development!
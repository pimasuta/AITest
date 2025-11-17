# Expense Splitter

An Angular 20 web application for splitting expenses among participants with real-time calculations and GitHub integration.

## Features

### Core Functionality
- **Participant Management**: Add/remove participants using Material Chips
- **Expense Tracking**: Create expenses with Material Form Fields
- **Smart Splitting**: Automatically calculate who owes money to whom
- **Settlement Calculations**: Compute optimal payment settlements
- **Local Storage**: Persist data across browser sessions

### User Interface
- **Material Design**: Clean, modern UI with Angular Material components
- **Responsive Layout**: Works on desktop and mobile devices
- **Tabbed Navigation**: Organized interface with Setup, Settle Up, History, and GitHub tabs
- **Real-time Updates**: Signal-based reactive state management

### Advanced Features
- **Expense History**: View all expenses with Material Expansion Panels
- **Settlement Optimization**: Calculate minimum number of transactions needed
- **GitHub Integration**: Push project code to GitHub repositories via MCP Server
- **Export/Import**: Local storage persistence with error handling

## Technology Stack

- **Angular 20** - Latest Angular framework with zoneless change detection
- **TypeScript** - Type-safe development
- **Angular Material** - Material Design components
- **SCSS** - Styled with Sass
- **Signals** - Reactive state management
- **SSR/Prerendering** - Server-side rendering support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Angular CLI 20

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-splitter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage Guide

### 1. Adding Participants
- Go to the "Setup" tab
- Enter participant names in the input field
- Press Enter or click the add button
- Remove participants by clicking the X on their chip

### 2. Adding Expenses
- In the "Setup" tab, scroll to the "Add Expense" section
- Fill in the expense description and amount
- Select who paid for the expense
- Choose which participants to split the expense among
- Click "Add Expense"

### 3. Viewing Settlements
- Switch to the "Settle Up" tab
- View recommended payments to settle all debts
- See current balances for each participant
- Green amounts indicate money owed to you
- Red amounts indicate money you owe

### 4. Expense History
- Go to the "History" tab to view all recorded expenses
- Expand expense panels to see detailed information
- Delete expenses if needed
- View total expenses and per-person splits

### 5. GitHub Integration
- Navigate to the "GitHub" tab
- Ensure MCP Server is running on localhost:3000
- Create new repositories or select existing ones
- Push your project code directly to GitHub

## GitHub MCP Integration

This application includes integration with a Model Context Protocol (MCP) Server for GitHub operations.

### Setup MCP Server
1. Ensure you have a GitHub MCP Server running on `http://localhost:3000`
2. The server should support endpoints for:
   - `/mcp/connect` - Establish GitHub connection
   - `/mcp/repositories` - List/create repositories  
   - `/mcp/repositories/:name/push` - Push code to repository
   - `/mcp/health` - Server health check

### Available Operations
- **Connect to GitHub**: Authenticate with GitHub API
- **Create Repository**: Create new public/private repositories
- **Push Project**: Upload project files to selected repository
- **List Repositories**: View your existing GitHub repositories

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

Built with ❤️ using Angular 20 and Material Design


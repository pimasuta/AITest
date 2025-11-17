import { Injectable } from '@angular/core';

export interface GitHubRepository {
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  htmlUrl: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubMcpService {
  private mcpEndpoint = 'http://localhost:3000/mcp'; // MCP server endpoint
  
  constructor() {}

  /**
   * Connect to GitHub MCP Server
   */
  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to connect to GitHub MCP server:', error);
      return false;
    }
  }

  /**
   * List user's GitHub repositories
   */
  async listRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/repositories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error listing repositories:', error);
      return [];
    }
  }

  /**
   * Create a new GitHub repository
   */
  async createRepository(name: string, description?: string, isPrivate: boolean = false): Promise<GitHubRepository | null> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/repositories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create repository');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating repository:', error);
      return null;
    }
  }

  /**
   * Push project files to GitHub repository
   */
  async pushProject(repoName: string, files: { path: string; content: string }[], commitMessage: string = 'Initial commit from Expense Splitter'): Promise<boolean> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/repositories/${repoName}/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files,
          message: commitMessage
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error pushing project:', error);
      return false;
    }
  }

  /**
   * Get project files to push to GitHub
   */
  async getProjectFiles(): Promise<{ path: string; content: string }[]> {
    const files: { path: string; content: string }[] = [];
    
    try {
      // Add package.json
      const packageJsonResponse = await fetch('/package.json');
      if (packageJsonResponse.ok) {
        files.push({
          path: 'package.json',
          content: await packageJsonResponse.text()
        });
      }

      // Add README.md
      const readmeResponse = await fetch('/README.md');
      if (readmeResponse.ok) {
        files.push({
          path: 'README.md',
          content: await readmeResponse.text()
        });
      }

      // Add angular.json
      const angularJsonResponse = await fetch('/angular.json');
      if (angularJsonResponse.ok) {
        files.push({
          path: 'angular.json',
          content: await angularJsonResponse.text()
        });
      }

      // Note: In a real application, you'd need to collect all source files
      // This is a simplified version for demonstration
      
    } catch (error) {
      console.error('Error collecting project files:', error);
    }
    
    return files;
  }

  /**
   * Get commit history for a repository
   */
  async getCommitHistory(repoName: string): Promise<GitHubCommit[]> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/repositories/${repoName}/commits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch commit history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching commit history:', error);
      return [];
    }
  }

  /**
   * Check if MCP server is available
   */
  async isServerAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.mcpEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GitHubMcpService, GitHubRepository } from '../../services/github-mcp.service';

@Component({
  selector: 'app-github-integration',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './github-integration.html',
  styleUrl: './github-integration.scss',
})
export class GitHubIntegration implements OnInit {
  githubService = inject(GitHubMcpService);
  snackBar = inject(MatSnackBar);

  serverAvailable = signal(false);
  connected = signal(false);
  loading = signal(false);
  repositories = signal<GitHubRepository[]>([]);
  
  newRepoName = signal('');
  newRepoDescription = signal('');
  newRepoPrivate = signal(false);
  selectedRepo = signal('');

  async ngOnInit() {
    await this.checkServerStatus();
  }

  async checkServerStatus() {
    this.loading.set(true);
    const available = await this.githubService.isServerAvailable();
    this.serverAvailable.set(available);
    
    if (available) {
      const connectionResult = await this.githubService.connect();
      this.connected.set(connectionResult);
      if (connectionResult) {
        await this.loadRepositories();
      }
    }
    this.loading.set(false);
  }

  async connectToGitHub() {
    this.loading.set(true);
    const success = await this.githubService.connect();
    this.connected.set(success);
    
    if (success) {
      this.snackBar.open('Connected to GitHub successfully!', 'Close', { duration: 3000 });
      await this.loadRepositories();
    } else {
      this.snackBar.open('Failed to connect to GitHub', 'Close', { duration: 3000 });
    }
    this.loading.set(false);
  }

  async loadRepositories() {
    this.loading.set(true);
    const repos = await this.githubService.listRepositories();
    this.repositories.set(repos);
    this.loading.set(false);
  }

  async createRepository() {
    if (!this.newRepoName().trim()) {
      this.snackBar.open('Repository name is required', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const repo = await this.githubService.createRepository(
      this.newRepoName(),
      this.newRepoDescription() || undefined,
      this.newRepoPrivate()
    );

    if (repo) {
      this.snackBar.open(`Repository "${repo.name}" created successfully!`, 'Close', { duration: 3000 });
      this.newRepoName.set('');
      this.newRepoDescription.set('');
      this.newRepoPrivate.set(false);
      await this.loadRepositories();
    } else {
      this.snackBar.open('Failed to create repository', 'Close', { duration: 3000 });
    }
    this.loading.set(false);
  }

  async pushProject() {
    if (!this.selectedRepo()) {
      this.snackBar.open('Please select a repository', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    const files = await this.githubService.getProjectFiles();
    const success = await this.githubService.pushProject(
      this.selectedRepo(),
      files,
      'Update Expense Splitter project'
    );

    if (success) {
      this.snackBar.open('Project pushed to GitHub successfully!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Failed to push project to GitHub', 'Close', { duration: 3000 });
    }
    this.loading.set(false);
  }

  openRepository(htmlUrl: string) {
    window.open(htmlUrl, '_blank');
  }
}

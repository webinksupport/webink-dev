/**
 * Push webink-dev to GitHub
 * Usage: GITHUB_TOKEN=ghp_xxxx node github-push.js
 */
const { Client } = require('ssh2');
const fs = require('fs');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = 'webinksupport';
const REPO_NAME = 'webink-dev';

async function createGitHubRepo(token) {
  const response = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: REPO_NAME,
      description: 'Webink Solutions - Next.js dev site with 4 homepage variants',
      private: false,
      auto_init: false,
    }),
  });
  
  if (response.status === 422) {
    console.log('Repo already exists, continuing...');
    return `https://github.com/${GITHUB_ORG}/${REPO_NAME}`;
  }
  
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${body}`);
  }
  
  const data = await response.json();
  return data.html_url;
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error('ERROR: Set GITHUB_TOKEN env var');
    console.error('Usage: GITHUB_TOKEN=ghp_xxxx node github-push.js');
    process.exit(1);
  }

  console.log('Creating/checking GitHub repo...');
  const repoUrl = await createGitHubRepo(GITHUB_TOKEN);
  console.log('Repo URL:', repoUrl);

  // Push from local git
  const { execSync } = require('child_process');
  const remoteUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${REPO_NAME}.git`;
  
  try {
    execSync(`git remote add github ${remoteUrl}`, { cwd: __dirname });
  } catch {
    execSync(`git remote set-url github ${remoteUrl}`, { cwd: __dirname });
  }
  
  execSync('git push github master', { cwd: __dirname, stdio: 'inherit' });
  console.log('\n✅ Pushed to GitHub:', repoUrl);
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });

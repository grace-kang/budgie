# 🪶 Budgie

A budgeting app that doesn’t make you feel bad about your life choices.

Budgie keeps things clean, minimal, and judgment-free.  
Track your money, set goals, and pretend you’re totally in control of your finances — all in one tidy little app.

## ✨ Features

- Create budgets without crying.
- Track spending with fewer clicks (and fewer regrets).
- Connect bank accounts via Plaid for automatic transaction syncing.
- A UI so minimal it might actually calm your anxiety.
- No ads. No upsells. No "premium" tier. Just your data.

## 🛠 Tech

Rails • PostgreSQL • React • TypeScript • Vite

## 🚀 Setup

### Environment Variables

Add these to your `.env` file:

```bash
# Plaid Integration (for bank account connections)
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_key_here
PLAID_ENV=sandbox  # Options: sandbox, development, production
```

Get your Plaid credentials from https://dashboard.plaid.com

### Installation

```bash
# Copy .env.example and fill in
cp .env.example .env

# Install Ruby gems
bundle install

# Install JS dependencies
yarn install  # or npm install if that’s what the project uses

# Set up database
bin/rails db:setup
# (This runs db:create, db:schema:load, and db:seed in one go)

# Start the dev server
bin/rails server

# Start the frontend server
vite dev
```

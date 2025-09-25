# CashTrackr

CashTrackr is a full-stack web application for personal budget and expense management. Users can create budgets, track expenses, and monitor their financial health with an intuitive dashboard.

This repository contains the **backend** API. The frontend application is available at: https://github.com/abraham1229/cashtrackr-page

## 📋 Features

- User authentication and account management
- Budget creation and management
- Expense tracking and categorization
- Financial dashboard and analytics
- Responsive design for all devices

## 🔧 Tech Overview

### Backend
- Built with **Express.js** and **TypeScript**
- **PostgreSQL** with **Sequelize** ORM for database
- **JWT** authentication and **bcrypt** password hashing
- **Express-validator** for input validation
- **Jest** for testing
- **Nodemailer** and **SendGrid** for email services
- **Express Rate Limit** for API protection


## 🚀 Getting Started

> Node.js version used: **18.18.0**

### Backend Setup
```bash
cd backend  
npm install  
npm run dev
```

## 🚧 Build & Deploy

### Backend
```bash
cd backend
npm run build
```

### Testing
```bash
cd backend
npm test
```

# 🤖 AI-Powered RFP Management System

A intelligent web application that revolutionizes the procurement process by leveraging AI to streamline RFP (Request for Proposal) creation, vendor management, proposal evaluation, and automated decision-making. Say goodbye to manual data entry, messy email threads, and time-consuming proposal comparisons.

![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-brightgreen)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange)

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [AI Integration](#ai-integration)
- [Project Structure](#project-structure)
- [Email Configuration](#email-configuration)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About The Project

Procurement teams waste countless hours manually creating RFPs, emailing vendors, parsing unstructured responses, and comparing proposals in spreadsheets. This AI-powered system automates the entire RFP lifecycle from creation to vendor selection.

### The Problem We Solve

Traditional RFP management is:
- **Slow**: Manual data entry and email management consume days of work
- **Error-Prone**: Copy-paste mistakes and missed details lead to poor decisions
- **Unstructured**: Vendor responses arrive in various formats (emails, PDFs, tables)
- **Repetitive**: Similar RFPs require starting from scratch each time

### Our Solution

An intelligent system that:
- ✨ Converts natural language descriptions into structured RFPs
- 🤖 Automatically parses vendor responses using AI
- 📊 Provides AI-powered proposal comparison and recommendations
- 📧 Handles email communication seamlessly
- 💾 Maintains a searchable database of RFPs, vendors, and proposals

## ✨ Key Features

### 1. Intelligent RFP Creation
- **Natural Language Input**: Describe your procurement needs conversationally
- **AI Structuring**: GPT-4 converts your description into a structured RFP with all necessary fields
- **Template Reuse**: Learn from past RFPs to speed up creation
- **Multi-Item Support**: Handle complex RFPs with multiple line items

**Example**: 
> "I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."

**Generated RFP Structure**:
```json
{
  "title": "Office Equipment Procurement - Laptops & Monitors",
  "budget": 50000,
  "deadline": "2025-01-10",
  "items": [
    {"type": "Laptop", "quantity": 20, "specs": "16GB RAM"},
    {"type": "Monitor", "quantity": 15, "specs": "27-inch"}
  ],
  "terms": {
    "payment": "Net 30",
    "warranty": "Minimum 1 year"
  }
}
```

### 2. Vendor Management
- **Vendor Database**: Maintain comprehensive vendor profiles
- **Contact Management**: Store multiple contacts per vendor
- **Selection Interface**: Choose relevant vendors for each RFP
- **Email Templates**: Automatically generate professional RFP emails

### 3. Automated Email Communication
- **Send RFPs**: Distribute RFPs to selected vendors via email
- **Receive Responses**: Monitor inbox for vendor replies
- **Smart Parsing**: AI extracts structured data from free-form emails
- **Attachment Handling**: Process PDFs, Excel sheets, and documents

### 4. AI-Powered Proposal Analysis
- **Automatic Data Extraction**: Parse prices, terms, and conditions from responses
- **Comparative View**: Side-by-side comparison of all proposals
- **Smart Scoring**: AI evaluates proposals based on multiple criteria
- **Recommendations**: Get AI-generated insights on the best vendor choice

### 5. Decision Support Dashboard
- **Visual Comparisons**: Charts and tables showing key metrics
- **Completeness Tracking**: See which vendors provided full responses
- **Cost Analysis**: Break down total costs including terms
- **Risk Assessment**: AI identifies potential red flags

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.x) - Component-based UI
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Modern component library
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hook Form** - Form handling with validation

### Backend
- **Node.js** (v18.x) - Runtime environment
- **Express.js** (v4.x) - Web framework
- **PostgreSQL** (v15.x) - Relational database
- **Sequelize ORM** - Database modeling
- **Nodemailer** - Email sending (SMTP)
- **IMAP** - Email receiving
- **Multer** - File upload handling

### AI Integration
- **OpenAI GPT-4** - RFP structuring and response parsing
- **Anthropic Claude** - Proposal analysis and recommendations
- **LangChain** - AI orchestration framework
- **PDF.js** - PDF parsing
- **XLSX** - Excel file processing

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** - Database
- **Winston** - Logging
- **Jest** - Testing framework
- **ESLint & Prettier** - Code quality

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ RFP Creation │  │   Vendor     │  │  Proposal    │      │
│  │   Interface  │  │  Management  │  │  Comparison  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (Node.js + Express)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     RFP      │  │    Vendor    │  │   Proposal   │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Email     │  │   AI/LLM     │  │   Parser     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│  PostgreSQL  │  │   OpenAI    │  │  Anthropic │
│   Database   │  │   GPT-4     │  │   Claude   │
└──────────────┘  └─────────────┘  └────────────┘
        │
┌───────▼──────────────┐
│   Email Server       │
│  (SMTP + IMAP)       │
└──────────────────────┘
```

### Data Flow

1. **RFP Creation**: User describes needs → AI structures → Saved to database
2. **Vendor Selection**: User selects vendors → System generates emails
3. **Email Distribution**: Emails sent via SMTP to vendors
4. **Response Monitoring**: IMAP monitors inbox for replies
5. **AI Parsing**: Incoming emails → AI extracts data → Structured proposals
6. **Analysis**: All proposals → AI comparison → Recommendations
7. **Decision**: User reviews → Selects vendor → Award notification

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v15.x or higher
- **Docker**: (Optional) For containerized deployment
- **Git**: For version control

API Keys Required:
- **OpenAI API Key** (for GPT-4)
- **Anthropic API Key** (for Claude)
- **Email Server Credentials** (SMTP + IMAP)

Check your versions:
```bash
node -v
npm -v
psql --version
docker -v
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-rfp-management-system.git
cd ai-rfp-management-system
```

### 2. Setup Database

#### Using Docker:
```bash
docker run -d \
  --name rfp-postgres \
  -e POSTGRES_USER=rfp_admin \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=rfp_db \
  -p 5432:5432 \
  postgres:15
```

#### Manual Setup:
```bash
# Create database
createdb rfp_db

# Connect and verify
psql rfp_db
```

### 3. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_db
DB_USER=rfp_admin
DB_PASSWORD=secure_password

# AI API Keys
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-specific-password

# Application Settings
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,xlsx,xls,doc,docx
```

#### Run Database Migrations
```bash
npm run migrate
npm run seed  # Optional: Seed sample data
```

### 4. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 5. Docker Setup (Alternative)

For a containerized setup:

```bash
# From project root
docker-compose up -d
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: rfp_db
      POSTGRES_USER: rfp_admin
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app

volumes:
  postgres_data:
```

## 🎮 Usage

### Starting the Application

#### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on **http://localhost:5000**

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on **http://localhost:3000**

#### Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Serve with backend
cd ../backend
npm start
```

### Using the Application

#### 1. Create an RFP

Navigate to the dashboard and click **"Create New RFP"**:

**Option A: Natural Language Input**
```
"I need 50 office chairs with ergonomic design and lumbar support. 
Budget is $15,000. Need delivery by January 15. Must include 2-year 
warranty and free installation."
```

**Option B: Structured Form**
Fill in the guided form with specific fields.

The AI will generate a structured RFP including:
- Title and description
- Line items with specifications
- Budget breakdown
- Delivery requirements
- Terms and conditions

#### 2. Manage Vendors

**Add Vendors:**
- Navigate to **Vendors** → **Add New Vendor**
- Enter company details and contact information
- Save to vendor database

**Select Vendors for RFP:**
- From RFP detail page, click **"Select Vendors"**
- Choose relevant vendors from your database
- System shows vendor match score based on past performance

#### 3. Send RFP

- Click **"Send to Vendors"**
- Review auto-generated email
- Click **"Confirm and Send"**
- System sends emails and tracks status

**Sample Generated Email:**
```
Subject: RFP: Office Equipment Procurement - Response Due Jan 10, 2025

Dear Vendor,

We are requesting proposals for the following procurement:

RFP ID: RFP-2025-001
Title: Office Equipment Procurement
Budget: $50,000
Deadline for Submission: January 10, 2025

Requirements:
- 20 Laptops (16GB RAM, Intel i7)
- 15 Monitors (27-inch, 4K)

Please reply to this email with your proposal including:
- Itemized pricing
- Delivery timeline
- Payment terms
- Warranty information

[Full RFP details attached as PDF]

Best regards,
Procurement Team
```

#### 4. Monitor Responses

The system automatically:
- Monitors your inbox for vendor replies
- Parses email content and attachments
- Extracts pricing and terms
- Updates proposal database
- Notifies you of new submissions

**Dashboard shows:**
- Total vendors contacted
- Responses received
- Pending responses
- Response rate

#### 5. Compare Proposals

Navigate to **Proposals** for the RFP:

**Comparison View includes:**
- Side-by-side vendor comparison
- Price breakdown table
- Terms comparison
- Completeness score
- AI-generated insights

**AI Analysis provides:**
- Best value recommendation
- Risk assessment
- Completeness evaluation
- Key differentiators

#### 6. Make Decision

- Review AI recommendations
- Check detailed proposal comparisons
- Click **"Award to Vendor"**
- System sends notification emails

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### RFP Management

**Create RFP from Natural Language**
```http
POST /rfps/create
Content-Type: application/json

{
  "description": "I need 20 laptops with 16GB RAM...",
  "naturalLanguage": true
}
```

**Response:**
```json
{
  "success": true,
  "rfp": {
    "id": "rfp_001",
    "title": "Office Laptop Procurement",
    "status": "draft",
    "budget": 50000,
    "items": [
      {
        "category": "Laptop",
        "quantity": 20,
        "specifications": {
          "ram": "16GB",
          "processor": "Intel i7"
        }
      }
    ],
    "terms": {
      "payment": "Net 30",
      "warranty": "1 year minimum"
    },
    "createdAt": "2025-12-11T10:30:00Z"
  }
}
```

**Get All RFPs**
```http
GET /rfps?status=active&page=1&limit=10
```

**Get RFP Details**
```http
GET /rfps/:rfpId
```

**Update RFP**
```http
PUT /rfps/:rfpId
Content-Type: application/json

{
  "budget": 55000,
  "deadline": "2025-01-15"
}
```

**Delete RFP**
```http
DELETE /rfps/:rfpId
```

#### Vendor Management

**Create Vendor**
```http
POST /vendors
Content-Type: application/json

{
  "name": "TechSupply Co",
  "email": "sales@techsupply.com",
  "phone": "+1-555-0123",
  "category": "Electronics",
  "contacts": [
    {
      "name": "John Doe",
      "role": "Sales Manager",
      "email": "john@techsupply.com"
    }
  ]
}
```

**Get All Vendors**
```http
GET /vendors?category=Electronics&search=tech
```

**Update Vendor**
```http
PUT /vendors/:vendorId
```

#### Email Operations

**Send RFP to Vendors**
```http
POST /rfps/:rfpId/send
Content-Type: application/json

{
  "vendorIds": ["vendor_001", "vendor_002", "vendor_003"],
  "customMessage": "Looking forward to your proposal"
}
```

**Response:**
```json
{
  "success": true,
  "sent": 3,
  "failed": 0,
  "details": [
    {
      "vendorId": "vendor_001",
      "email": "sales@techsupply.com",
      "status": "sent",
      "sentAt": "2025-12-11T10:35:00Z"
    }
  ]
}
```

**Check Email Inbox**
```http
GET /emails/check
```

**Process Vendor Response**
```http
POST /proposals/parse
Content-Type: multipart/form-data

{
  "rfpId": "rfp_001",
  "vendorId": "vendor_001",
  "email": "Raw email content...",
  "attachments": [file1.pdf, file2.xlsx]
}
```

#### Proposal Management

**Get All Proposals for RFP**
```http
GET /rfps/:rfpId/proposals
```

**Response:**
```json
{
  "success": true,
  "proposals": [
    {
      "id": "prop_001",
      "rfpId": "rfp_001",
      "vendorId": "vendor_001",
      "vendorName": "TechSupply Co",
      "pricing": {
        "total": 48000,
        "breakdown": [
          {"item": "Laptops", "unitPrice": 2200, "quantity": 20, "total": 44000},
          {"item": "Monitors", "unitPrice": 300, "quantity": 15, "total": 4500}
        ]
      },
      "terms": {
        "payment": "Net 30",
        "warranty": "2 years",
        "delivery": "15 days"
      },
      "completeness": 95,
      "receivedAt": "2025-12-09T14:20:00Z"
    }
  ]
}
```

**Get AI Comparison**
```http
GET /rfps/:rfpId/compare
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "proposals": 3,
    "lowestPrice": 45000,
    "highestPrice": 52000,
    "avgPrice": 48333,
    "recommendation": {
      "vendorId": "vendor_002",
      "vendorName": "Office Solutions Inc",
      "reasoning": "Best balance of price and terms. Offers fastest delivery and extended warranty.",
      "score": 92,
      "strengths": [
        "Competitive pricing",
        "2-year warranty included",
        "10-day delivery"
      ],
      "concerns": [
        "New vendor - limited history"
      ]
    }
  }
}
```

**Award Proposal**
```http
POST /proposals/:proposalId/award
Content-Type: application/json

{
  "notes": "Selected for best value and delivery terms"
}
```

## 🤖 AI Integration

### AI Services Architecture

The system uses multiple AI models for different tasks:

#### 1. RFP Structuring (OpenAI GPT-4)

**Purpose**: Convert natural language to structured RFP

**Prompt Template**:
```javascript
const prompt = `You are an AI assistant helping with procurement. 
Convert this natural language description into a structured RFP:

"${userInput}"

Extract and return JSON with:
- title: Clear RFP title
- description: Brief summary
- items: Array of line items with quantities and specs
- budget: Total budget amount
- deadline: Delivery/completion date
- terms: Payment terms, warranties, etc.

Return only valid JSON.`;
```

**Implementation**:
```javascript
async function structureRFP(naturalLanguageInput) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: naturalLanguageInput }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}
```

#### 2. Proposal Parsing (OpenAI GPT-4)

**Purpose**: Extract structured data from vendor emails

**Workflow**:
1. Receive vendor email
2. Extract text from email body
3. Parse attachments (PDF, Excel)
4. Send to GPT-4 for extraction
5. Return structured proposal data

**Prompt Template**:
```javascript
const prompt = `Extract proposal information from this vendor response:

EMAIL CONTENT:
${emailText}

ATTACHED DOCUMENTS:
${attachmentText}

Extract:
- Line item pricing
- Total cost
- Payment terms
- Delivery timeline
- Warranty information
- Any special conditions

Return structured JSON.`;
```

#### 3. Proposal Comparison (Anthropic Claude)

**Purpose**: Analyze and compare multiple proposals

**Prompt Template**:
```javascript
const prompt = `You are a procurement analyst. Compare these vendor proposals:

${JSON.stringify(proposals, null, 2)}

Provide:
1. Price comparison summary
2. Terms comparison
3. Completeness analysis
4. Recommendation with reasoning
5. Risk assessment

Consider:
- Total cost
- Payment terms
- Delivery speed
- Warranty coverage
- Vendor reputation
- Completeness of response`;
```

**Response Format**:
```json
{
  "summary": {
    "lowestPrice": 45000,
    "fastestDelivery": "10 days",
    "bestWarranty": "3 years"
  },
  "recommendation": {
    "vendor": "Office Solutions Inc",
    "score": 92,
    "reasoning": "...",
    "strengths": [...],
    "concerns": [...]
  },
  "detailed_comparison": [...]
}
```

### AI Service Code Example

```javascript
// services/aiService.js
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async structureRFP(description) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a procurement assistant...' },
        { role: 'user', content: description }
      ],
      temperature: 0.3
    });
    
    return JSON.parse(response.choices[0].message.content);
  }

  async parseProposal(emailContent, attachments) {
    const prompt = this.buildParsingPrompt(emailContent, attachments);
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    });
    
    return JSON.parse(response.choices[0].message.content);
  }

  async compareProposals(proposals) {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: this.buildComparisonPrompt(proposals)
      }]
    });
    
    return this.parseComparisonResponse(message.content[0].text);
  }
}

module.exports = new AIService();
```

## 📁 Project Structure

```
ai-rfp-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── email.js
│   │   │   └── ai.js
│   │   ├── controllers/
│   │   │   ├── rfpController.js
│   │   │   ├── vendorController.js
│   │   │   ├── proposalController.js
│   │   │   └── emailController.js
│   │   ├── models/
│   │   │   ├── RFP.js
│   │   │   ├── Vendor.js
│   │   │   ├── Proposal.js
│   │   │   └── Email.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── emailService.js
│   │   │   ├── parserService.js
│   │   │   └── comparisonService.js
│   │   ├── routes/
│   │   │   ├── rfp.routes.js
│   │   │   ├── vendor.routes.js
│   │   │   ├── proposal.routes.js
│   │   │   └── email.routes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js
│   │   │   └── fileUpload.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── pdfParser.js
│   │   │   └── excelParser.js
│   │   └── app.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RFP/
│   │   │   │   ├── RFPCreator.jsx
│   │   │   │   ├── RFPList.jsx
│   │   │   │   ├── RFPDetail.jsx
│   │   │   │   └── NaturalLanguageInput.jsx
│   │   │   ├── Vendor/
│   │   │   │   ├── VendorList.jsx
│   │   │   │   ├── VendorForm.jsx
│   │   │   │   └── VendorSelector.jsx
│   │   │   ├── Proposal/
│   │   │   │   ├── ProposalList.jsx
│   │   │   │   ├── ProposalDetail.jsx
│   │   │   │   ├── ComparisonView.jsx
│   │   │   │   └── AIRecommendation.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   └── Charts/
│   │   │       ├── PriceComparison.jsx
│   │   │       └── ProposalMetrics.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RFPs.jsx
│   │   │   ├── Vendors.jsx
│   │   │   └── Proposals.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── rfpSlice.js
│   │   │   │   ├── vendorSlice.js
│   │   │   │   └── proposalSlice.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── rfpService.js
│   │   │   ├── vendorService.js
│   │   │   └── proposalService.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

## 📧 Email Configuration

### Gmail Setup (Recommended for Testing)

#### 1. Enable App Passwords
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password: Security → 2-Step Verification → App Passwords
4. Use this password in your `.env` file

#### 2. Backend Configuration
```env
EMAIL_HOST=smtp.gmail.com

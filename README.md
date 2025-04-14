# BeaconBot – #### AI Chatbot  
**Georgia Tech | MGT 8803 – AI in Business**

**BeaconBot** is an AI-powered Retrieval-Augmented Generation (RAG) chatbot built to assist users of [#####] in finding accurate, timely, and relevant information about child welfare topics. It leverages **Astra DB** for vector search and **OpenAI** for natural language generation. Designed for high usability and accessibility, the bot can be deployed easily on **Vercel** and CAN be integrated with government UI standards like USWDS.

---

## 👨‍🏫 Course Info  
**Course:** MGT 8803 – AI in Business  
**Institution:** Georgia Institute of Technology – Scheller College of Business  
**Team Members:**  
- Raghav Gupta  
- Nigam Wadhwa  
- Ruhma Mehak Khan

**Live Site:** https://beacon-bot-opal.vercel.app/ 

---

## 🚀 Features

- **🔍 Astra DB Vector Search:** Retrieves relevant documents with semantic matching.
- **🧠 OpenAI Language Generation:** Answers user questions with contextual awareness.
- **⚙️ Seamless Deployment:** Launch on Vercel in minutes.
- **🛠 Customizable Frontend:** Tailor UI to match ##### styling standards.
- **📦 Built-In Seeding:** Quickly populate the vector store with curated CMS content.

---

## ⚙️ Architecture Diagram
<img width="600" alt="arch diag" src="https://github.com/RaghavKGupta/BeaconBot/blob/main/BBArch.png">

---

## 🛠 Getting Started

### ✅ Prerequisites

- [Astra DB](https://www.datastax.com/astra): Vector-enabled database
- [OpenAI API Key](https://platform.openai.com/signup)

---

### 📦 Deployment Options

#### 🔁 One-Click Vercel Deployment

> ⚠️ Before pushing to production, **remove** the seed script from your Vercel build settings.

#### 🧪 Local Development Setup

1. **Clone the repo:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/beaconbot.git
   cd beaconbot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file with the following:**

   ```env
   OPENAI_API_KEY=your_openai_key
   ASTRA_DB_API_ENDPOINT=https://your-astra-endpoint
   ASTRA_DB_APPLICATION_TOKEN=AstraCS:your_token_here
   ASTRA_DB_NAMESPACE=your_keyspace (optional)
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-s3-bucket
   S3_PREFIX=pdfs/
   ```
4. ## 📄 Ingesting PDFs from S3

BeaconBot includes tooling to extract PDF content from AWS S3 and convert it into structured JSON format used for training, search, or vectorization.

### 📥 How it Works

Run the following script to:
- Connect to your AWS S3 bucket
- Parse PDFs into text
- Generate structured JSON with `url`, `title`, `content`
- Append new entries (avoiding duplicates) to `scripts/sample_data.json`

```bash
npm run ingest:pdfs
```


5. **Seed the database (development only):**

   ```bash
   npm run seed
   ```

6. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── /api              # API endpoints for chat & search
├── /components       # UI components (chat window, input field, etc.)
├── /lib              # Utility functions and integrations (OpenAI, Astra DB)
├── /scripts          # Database seeding and maintenance scripts
├── /public           # Static assets (images, icons, etc.)
├── /styles           # Global and component-specific styles
├── .env.example      # Example environment variables file
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

---

## 📚 Resources

- [OpenAI Docs](https://platform.openai.com/docs)
- [Astra DB Docs](https://docs.datastax.com/en/astra/)
- [Vercel Docs](https://vercel.com/docs)

# 🌍 WhatIfWorld

> **AI-Powered Hypothetical Scenario Prediction Platform**

WhatIfWorld is an AI-powered web application that allows users to explore **"What If?"** scenarios using Large Language Models (LLMs). Users can enter hypothetical situations, receive AI-generated predictions, visualize results with charts, and share their scenarios with the community.

---

## 🚀 Features

### 🔐 Authentication
- Local Authentication using Passport.js
- Google OAuth Login
- Session-based Authentication
- Secure Password Hashing
- Protected Routes

### 🤖 AI Scenario Prediction
- Enter any hypothetical **"What If?"** scenario
- Select a prediction domain
- AI validates the scenario
- Structured prompt generation
- AI-generated prediction including:
  - Probability Score
  - Key Implications
  - Potential Challenges
  - Statistical Metrics

### 📊 Data Visualization
- Interactive Charts
- Probability Visualization
- Statistical Analysis
- Easy-to-understand prediction dashboard

### 👥 Community
- Share AI predictions
- Like Posts
- Comment on Posts
- View Community Predictions
- Custom Trending Algorithm

### 👤 User Profile
- Edit Profile
- Profile Picture Upload
- View Shared Posts
- Manage Account

### 📄 Export
- Download prediction reports as PDF

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- EJS

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- Passport.js
- Passport Local Strategy
- Google OAuth 2.0
- Express Session
- Connect-Mongo

## AI
- Cerebras AI
- Llama Model
- Prompt Engineering

## Cloud & Deployment
- Render
- Cloudinary
- MongoDB Atlas

---

# 📂 Project Structure

```
WhatIfWorld
│
├── models/
├── routes/
├── middleware/
├── utils/
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│
├── views/
│   ├── home/
│   ├── profile/
│   ├── community/
│   ├── result/
│   ├── auth/
│
├── app.js
├── package.json
└── README.md
```

---

# ⚙️ Workflow

```
Guest User
      │
      ▼
Login / Google OAuth
      │
      ▼
Explore Page
      │
      ▼
Enter "What If?" Scenario
      │
      ▼
Server-side Validation (Joi)
      │
      ▼
AI Validation
      │
      ▼
Prompt Generation
      │
      ▼
Cerebras AI API
      │
      ▼
Structured JSON Response
      │
      ▼
Store Result in MongoDB
      │
      ▼
Display Result + Charts
      │
      ▼
Share to Community
      │
      ▼
Trending Feed
```

---

# 🧠 Trending Algorithm

Community posts are ranked using a custom engagement-based algorithm.

```
Trending Score =
(Comments × 4 + Likes × 3 + Views)
/
(Age + 2)
```

Where:

- Comments have the highest weight.
- Likes contribute moderate weight.
- Views contribute base engagement.
- Age reduces the score over time to promote fresh content.

---

# 🔒 Authentication Flow

- User Login
- Passport.js Authentication
- Session Creation
- Session stored in MongoDB using Connect-Mongo
- Session ID stored as Cookie
- Protected Routes verified using Middleware

---

# 🗄️ Database Design

## User
- Username
- Email
- Password
- Profile Image
- Google ID (Optional)

## Result
- Scenario
- Domain
- Probability Score
- Key Implications
- Challenges
- Statistics

## Community
- Shared Result
- Author
- Likes
- Comments
- Views
- Trending Score

---

# 🛡️ Validation

Two levels of validation are used:

### Level 1
Joi Validation

- Required Fields
- Minimum Length
- Input Validation

### Level 2
AI Validation

- Checks whether the input is actually a hypothetical scenario.
- Prevents meaningless AI requests.

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/PRATEEKK9223/WhatIfWorld.git
```

Move into the project

```bash
cd WhatIfWorld
```

Install dependencies

```bash
npm install
```

Create a `.env` file and add the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CEREBRAS_API_KEY=your_cerebras_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the application

```bash
npm start
```

Open in browser

```
http://localhost:3000
```

---

# 📈 Future Improvements

- AI-powered recommendation system
- AI-generated community scenarios
- Admin dashboard
- Bookmark predictions
- Advanced analytics
- Personalized feeds
- Multi-language support
- Real-time notifications

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```
git checkout -b feature-name
```

3. Commit changes

```
git commit -m "Added feature"
```

4. Push

```
git push origin feature-name
```

5. Create a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Prateek K**

- GitHub: https://github.com/PRATEEKK9223
- LinkedIn: www.linkedin.com/in/prateek-k-394ab1330


---

⭐ If you like this project, consider giving it a **Star** on GitHub!

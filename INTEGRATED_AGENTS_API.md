# Integrated Agents API Registry

This document maintains a registry of all external AI agents integrated into the IntelliBiz platform, including their API endpoints and usage details.

## 1. Customer Support Auto-Agent

*   **Description**: Automates responses to common customer inquiries with sentiment analysis and escalation detection.
*   **Base URL**: `https://customersupportagent-1.onrender.com`
*   **Status**: ✅ Active

### Endpoints

#### Process Query
*   **URL**: `/api/agent/process`
*   **Method**: `POST`
*   **Description**: Main endpoint to process customer queries.
*   **Request Body**:
    ```json
    {
      "ticket_id": "TKT-123456",
      "query": "Where is my order?",
      "context": { ... },
      "metadata": { ... }
    }
    ```

#### Health Check
*   **URL**: `/api/health`
*   **Method**: `GET`
*   **Description**: Check if the service is running.

#### Agent Status
*   **URL**: `/api/agent/status`
*   **Method**: `GET`
*   **Description**: Get agent statistics and operational status.

---

## 2. Proactive Survey Agent

*   **Description**: Analyzes user behavior and purchase history to trigger timely, relevant surveys.
*   **Base URL**: `https://proactive-survey-agent.vercel.app`
*   **Status**: ✅ Active

### Endpoints

#### Analyze User Behavior
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Determines if a survey should be triggered based on user activity.
*   **Request Body**:
    ```json
    {
      "last_purchase": "Wireless Earbuds",
      "last_survey_date": "2025-09-20",
      "recent_activity": "Support chat with negative sentiment",
      "user_id": "user123"
    }
    ```
*   **Response**:
    ```json
    {
      "survey_trigger": true,
      "survey_type": "Product Experience",
      "priority": "high",
      "reason": "...",
      "questions": [...]
    }
    ```

---

## 3. Customer Sentiment Agent

*   **Description**: Analyzes customer feedback across platforms (Twitter, Facebook, etc.) to gauge sentiment, emotion, and engagement.
*   **Base URL**: `https://customer-sentiment-agent-g5gd.onrender.com`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Sentiment
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Performs deep sentiment and emotion analysis on text.
*   **Request Body**:
    ```json
    {
      "user": "user_1234",
      "platform": "twitter",
      "timestamp": "2025-10-21T13:45:00Z",
      "text": "The new product launch blew my mind! So innovative 🔥 #TechTrends",
      "hashtags": ["TechTrends"],
      "likes": 542,
      "retweets": 120,
      "country": "Germany"
    }
    ```
*   **Response**:
    ```json
    {
      "sentiment_label": "neutral",
      "sentiment_score": 0,
      "emotion_analysis": [...],
      "engagement_prediction": "high",
      "topic_extracted": [...],
      "recommendation": "..."
    }
    ```

---

## 4. Market Trend Monitor Agent

*   **Description**: Analyzes market sectors to identify emerging trends and growth opportunities.
*   **Base URL**: `https://minahilasif222.pythonanywhere.com`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Market
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Analyzes a specific sector for trends.
*   **Request Body**:
    ```json
    {
      "sector": "Technology",
      "query_type": "emerging_trends"
    }
    ```
*   **Response**:
    ```json
    {
      "agent_id": "market-trend-monitor-001",
      "agent_name": "Market Trend Monitor Agent",
      "status": "success",
      "sector": "Technology",
      "analysis_type": "emerging_trends",
      "result": {
        "trend_direction": "Rising",
        "strength": "Strong",
        "confidence": 0.65,
        "key_patterns": ["AI", "automation", "cloud computing"],
        "insights": ["AI and automation adoption increasing", "Cloud computing growth"],
        "recommendation": "Monitor Technology sector closely for emerging opportunities"
      }
    }
    ```

---

## 5. Lead Scoring Agent

*   **Description**: Evaluates leads based on engagement and demographics to predict conversion probability.
*   **Base URL**: `https://lead-scoring-agent-production.up.railway.app`
*   **Status**: ✅ Active

### Endpoints

#### Score Lead
*   **URL**: `/score`
*   **Method**: `POST`
*   **Description**: Calculates conversion probability and risk for a lead.
*   **Request Body**:
    ```json
    {
      "lead_id": "LEAD-12345",
      "age": 35,
      "location": "New York",
      "industry": "Technology",
      "email_opens": 15,
      "website_visits": 10,
      "content_downloads": 5,
      "days_since_contact": 7,
      "lead_source": "Webinar",
      "actual_outcome": null
    }
    ```
*   **Response**:
    ```json
    {
      "lead_id": "LEAD-12345",
      "conversion_score": 0.78,
      "risk_category": "high",
      "timestamp": "2025-11-23T10:30:00.000000",
      "model_version": "1.0"
    }
    ```

---

## 6. Churn Prevention Agent

*   **Description**: Identifies at-risk customers and suggests retention strategies using AI-powered churn prediction.
*   **Base URL**: `https://spmproject-production.up.railway.app`
*   **Status**: ✅ Active

### Endpoints

#### Predict/Analyze
*   **URL**: `/api/v1/predict`
*   **Method**: `POST`
*   **Description**: Analyzes customer data to predict churn and provide retention recommendations.
*   **Request Body**:
    ```json
    {
      "customer": {
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "tenure": 12,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "Yes",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 70.5,
        "TotalCharges": 850,
        "customerID": "CUST-001"
      },
      "prediction_type": "standard",
      "recommendation_type": "balanced"
    }
    ```
*   **Response**:
    ```json
    {
      "status": "success",
      "prediction": {
        "customer_id": "CUST-001",
        "churn_probability": 0.4661,
        "will_churn": false,
        "risk_category": "Medium",
        "confidence": "Low",
        "top_risk_factors": [
          "charges_per_tenure",
          "Contract",
          "MonthlyCharges",
          "TotalCharges",
          "OnlineSecurity"
        ],
        "recommendation": {
          "action": "Proactive Engagement",
          "priority": "High",
          "discount": "10-15%",
          "duration": "2 months",
          "suggestions": [
            "Send customer satisfaction survey",
            "Offer 10-15% discount on upgrade",
            "Provide personalized service recommendations",
            "Schedule check-in call",
            "Send quarterly engagement emails"
          ],
          "customer_insights": [
            "Contract type is month-to-month - high flexibility risk",
            "No tech support - consider offering support package",
            "Electronic check payment - consider auto-pay incentive"
          ]
        },
        "timestamp": "2025-11-23T15:16:23.993627"
      },
      "request_type": "standard",
      "recommendation_level": "balanced",
      "timestamp": "2025-11-23T15:16:23.993680"
    }
    ```

---

## 7. Competitor Analysis Agent

*   **Description**: Analyzes products to identify competitors and provides links to competitor products.
*   **Base URL**: `https://competitor-analysis-api.vercel.app`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Competitors
*   **URL**: `/api/competitors`
*   **Method**: `POST`
*   **Description**: Analyzes a product name and returns a list of competitors with links.
*   **Request Body**:
    ```json
    {
      "input": "iPhone 15"
    }
    ```
*   **Response**:
    ```json
    {
      "input": "iPhone 15",
      "competitors": [
        {
          "name": "Samsung Galaxy S24 Ultra",
          "link": "https://www.samsung.com/us/smartphones/galaxy-s24-ultra/"
        },
        {
          "name": "Google Pixel 8 Pro",
          "link": "https://store.google.com/product/pixel_8_pro"
        },
        {
          "name": "OnePlus 12",
          "link": "https://www.oneplus.com/us/oneplus-12"
        },
        {
          "name": "Xiaomi 14 Ultra",
          "link": "https://www.mi.com/global/product/xiaomi-14-ultra/"
        },
        {
          "name": "Oppo Find X7 Ultra",
          "link": "https://www.oppo.com/en/smartphones/find-x/"
        }
      ],
      "total_competitors_found": 5
    }
    ```

---

## 8. SEO Optimizer Agent

*   **Description**: Analyzes content and URLs for SEO optimization, providing scores, keyword analysis, and actionable recommendations.
*   **Base URL**: `https://seo-optimizer-agent.onrender.com`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Content
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Performs a comprehensive SEO analysis of the provided content or URL.
*   **Request Body**:
    ```json
    {
      "content": {
        "title": "10 Best SEO Tips for 2025",
        "body": "SEO is crucial for website visibility..."
      },
      "url": "https://example.com/blog/seo-tips-2025",
      "task_id": "task-12345",
      "config": {
        "focus_keyword": "SEO tips",
        "analysis_depth": "standard"
      }
    }
    ```
*   **Response**:
    ```json
    {
      "status": "success",
      "analysis": {
        "overall_score": 75,
        "keyword_analysis": {
          "keywords": {
            "SEO": { "count": 5, "density": 2.5, "status": "optimal" }
          },
          "total_words": 200
        },
        "readability": {
          "score": 68.5,
          "level": "Standard"
        },
        "meta_tags": {
          "title": { "present": true, "status": "good" },
          "description": { "present": false, "status": "missing" }
        },
        "recommendations": [
          {
            "type": "meta_description",
            "priority": "high",
            "suggestion": "Add a meta description to improve CTR."
          }
        ]
      }
    }
    ```

---

## 9. Loyalty Program Optimizer Agent

*   **Description**: Optimizes loyalty programs to maximize retention and LTV by analyzing customer data and recommending rewards.
*   **Base URL**: `https://web-production-37e1.up.railway.app`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Customer
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Analyzes a customer to predict retention, segment them, and recommend rewards.
*   **Request Body**:
    ```json
    {
      "customer_id": "CUST-12345",
      "include_history": true
    }
    ```
*   **Response**:
    ```json
    {
      "customer_id": "CUST-12345",
      "recommended_reward": "15% Discount on Next Purchase",
      "predicted_retention": 0.85,
      "segment": "Loyal",
      "rfm_score": 450,
      "churn_risk": "Low",
      "timestamp": "2025-11-29T14:30:00Z",
      "history": []
    }
    ```

---

## 10. Influencer Engagement Agent

*   **Description**: Identifies and drafts outreach to relevant influencers, and tracks sent emails.
*   **Base URL**: `https://email-marketing-bot-chi.vercel.app`
*   **Status**: ✅ Active

### Endpoints

#### Send Email
*   **URL**: `/api/send-email`
*   **Method**: `POST`
*   **Description**: Generates and sends an outreach email to an influencer.
*   **Request Body**:
    ```json
    {
      "request_type": "send_email",
      "influencer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "email_details": {
        "subject": "Collaboration Opportunity",
        "description": "We'd like to discuss a partnership.",
        "category": "meeting"
      },
      "meta": {
        "priority": "high"
      }
    }
    ```
*   **Response**:
    ```json
    {
      "status": "success",
      "task_id": "TASK_20251118_002",
      "email_content": {
        "to": "john@example.com",
        "subject": "Collaboration Opportunity",
        "body": "Generated email content...",
        "sent_at": "2025-11-18T16:44:16Z"
      },
      "tracking_info": {
        "email_id": "EMAIL_2",
        "delivery_status": "queued",
        "db_status": "stored_in_mongo"
      }
    }
    ```

#### Get Emails
*   **URL**: `/api/emails`
*   **Method**: `GET`
*   **Description**: Retrieves a list of all sent emails.
*   **Response**:
    ```json
    {
      "status": "success",
      "total_emails": 2,
      "emails": [
        {
          "email_id": "EMAIL_2",
          "subject": "Collaboration Opportunity",
          "body_preview": "Generated email content...",
          "sent_at": "2025-11-18T16:44:16Z",
          "category": "meeting",
          "to": "john@example.com",
          "influencer_name": "John Doe",
          "body": "Full email body...",
          "priority": "high",
          "delivery_status": "queued"
        }
      ]
    }
    ```

---

## 11. Brand Reputation Guard Agent

*   **Description**: Monitors brand reputation across various sources, detects fake news, and provides actionable recommendations.
*   **Base URL**: `https://brand-reputation-agent-frontend.vercel.app`
*   **Status**: ✅ Active

### Endpoints

#### Analyze Brand Reputation
*   **URL**: `/analyze`
*   **Method**: `POST`
*   **Description**: Analyzes brand sentiment, detects fake news, and provides a summary and recommendations.
*   **Request Body**:
    ```json
    {
      "brand_name": "Cloudflare",
      "Type": "webservice",
      "date_range": "2010-10-01 to 2025-10-20",
      "sources": ["Twitter", "NewsAPI"],
      "metadata": {
        "region": "Global",
        "language": "English"
      }
    }
    ```
*   **Response**:
    ```json
    {
        "brand_name": "Cloudflare",
        "fake_news_Reallife": [],
        "mentions_detected": "High",
        "recommendation": "Cloudflare should prioritize transparent communication...",
        "status": "Warning",
        "summary": "Cloudflare's brand reputation is currently under a 'Warning' status...",
        "suspicious_posts": 0,
        "timestamp": "2025-11-22T12:00:00Z",
        "top_sources": [
            "https://www.ynetnews.com/tech-and-digital/article/s1z11kmrlbg",
            "..."
        ]
    }
    ```






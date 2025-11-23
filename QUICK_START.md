# 🚀 Quick Start Guide - IntelliBiz Platform

## Get Started in 3 Minutes

### 1️⃣ Navigate to Project
```bash
cd /Users/abdullahasif/Desktop/SPM_Supervisor_Agent/intellibiz
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

### 3️⃣ Open in Browser
Visit: **http://localhost:3000**

---

## 📱 What You'll See

### Dashboard (Home Page)
- **17 Agent Cards** organized by category
- Click any card to open that agent's interface

### Agent Pages
Each agent has:
- **Input Section** - Enter your data/query
- **Output Section** - View agent results
- **Run Button** - Execute the agent
- **Copy Button** - Copy results to clipboard

### Settings Page
Configure:
- API endpoints
- Authentication keys
- Timeout settings
- Agent status monitoring

---

## 🎯 Try It Out

### Example 1: Market Trend Monitor
1. Click "Market Trend Monitor" from dashboard
2. Enter: `AI-powered CRM tools`
3. Click "Run Agent"
4. View the market analysis output

### Example 2: SEO Optimizer
1. Navigate to "SEO Optimizer"
2. Enter a URL or paste content
3. Run the agent
4. Get SEO recommendations

### Example 3: Customer Sentiment
1. Open "Customer Sentiment" agent
2. Paste customer reviews
3. Analyze sentiment scores
4. Identify key issues

---

## 🔌 Connect Your Real Agents

### Step 1: Create Environment File
```bash
cp env.example .env.local
```

### Step 2: Add Your API Details
Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_API_KEY=your-key-here
```

### Step 3: Update Agent Interface
See `src/lib/api-integration.example.ts` for code examples

### Step 4: Test Connection
Run an agent and verify it connects to your backend

---

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `src/data/agents.ts` | All agent definitions |
| `src/components/agent-interface.tsx` | Agent UI component |
| `src/app/agent/[id]/page.tsx` | Dynamic agent pages |
| `src/lib/api-integration.example.ts` | API integration examples |
| `README.md` | Full documentation |

---

## 🎨 Customize the Platform

### Change Colors
Edit `src/app/globals.css`:
```css
--primary: oklch(0.533 0.175 264.052); /* Blue */
```

### Add New Agent
Edit `src/data/agents.ts`:
```typescript
{
  id: "new-agent",
  name: "New Agent Name",
  description: "What it does",
  category: "Marketing",
  icon: YourIcon,
  inputPlaceholder: "Enter...",
  demoOutput: "Sample output"
}
```

### Modify Layout
Edit `src/app/layout.tsx` for global changes

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
npm run build
# Check for TypeScript errors
```

---

## 📊 Platform Features

✅ **17 Business Intelligence Agents**
✅ **Clean, Modern UI**
✅ **Responsive Design**
✅ **Real-time Interaction**
✅ **Category Organization**
✅ **Settings Management**
✅ **Copy to Clipboard**
✅ **Loading States**
✅ **Error Handling**
✅ **Type-Safe Code**

---

## 🎓 For Your Course Project

### Demo the Platform
1. Show the dashboard with all agents
2. Demonstrate 2-3 different agents
3. Explain the categorization
4. Show the settings page
5. Discuss integration approach

### Explain the Architecture
- Next.js App Router
- Server/Client Components
- Dynamic Routing
- Type Safety
- Component Reusability

### Highlight Key Features
- Unified interface for all agents
- Easy to add new agents
- Ready for backend integration
- Production-ready code quality

---

## 📞 Need Help?

- **Documentation**: See `README.md`
- **API Examples**: See `src/lib/api-integration.example.ts`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

## ⚡ Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

**You're all set! 🎉**

The platform is running at http://localhost:3000

Start exploring the agents or begin integrating your backend APIs!

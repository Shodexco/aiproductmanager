# AI Product Manager (AutoGen)

A production-quality MVP that uses a 5-agent AutoGen team to generate comprehensive Product Requirement Documents (PRDs) from a 1-sentence product idea. Features a modern React frontend with dark mode support, expert agent collaboration visualization, and comprehensive PRD generation.

## 🚀 Features

### 🤖 **5-Expert Agent Collaboration**
- **Product Strategist** (Alex Sterling): Ex-McKinsey strategist for market analysis & business strategy
- **Technical Architect** (Dr. Maya Chen): Google Cloud principal architect for scalable systems design
- **UX Writer** (Jordan Rivera): Apple design team for user experience & microcopy
- **Mockup Designer** (Sofia Rossi): IDEO creative director for visual design & design systems
- **PRD Synthesizer** (Prof. David Park): Stanford professor for PRD synthesis & requirements

### 🎨 **Modern React Frontend**
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Glass Morphism UI**: Modern glass card effects with backdrop blur
- **Real-time Visualization**: Live agent status and collaboration visualization
- **Interactive Components**: Hover effects, animations, and responsive design
- **Expert Chat Interface**: Simulated conversations between expert agents

### 📋 **Comprehensive PRD Generation**
- **Structured PRD Template**: Market analysis, user personas, features, tech stack
- **12-Week Execution Plan**: Detailed development roadmap with phases and deliverables
- **Mockup Specifications**: JSON-based wireframe specifications for key screens
- **Multiple Output Formats**: PRD in Markdown, PDF, conversation log, and downloadable bundle

### 🏗️ **Technical Architecture**
- **FastAPI Backend**: High-performance REST API with comprehensive endpoints
- **React Frontend**: Modern TypeScript application with Tailwind CSS
- **Dockerized Deployment**: Full containerized deployment with docker-compose
- **Observability**: Structured logging and run persistence
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## 📸 Screenshots

### Light Mode Interface
![Light Mode](https://via.placeholder.com/800x450/3b82f6/ffffff?text=AI+Product+Manager+Light+Mode)

### Dark Mode Interface  
![Dark Mode](https://via.placeholder.com/800x450/1e293b/ffffff?text=AI+Product+Manager+Dark+Mode)

### Agent Collaboration
![Agent Collaboration](https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Expert+Agent+Collaboration)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API key (or compatible LLM API)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aiproductmanager
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your OpenAI API key:**
   ```env
   OPENAI_API_KEY=sk-...
   # Optional: Configure other environment variables
   LOG_LEVEL=INFO
   ENVIRONMENT=development
   ```

4. **Build and start services:**
   ```bash
   docker-compose up --build
   ```

5. **Access the applications:**
   - **React Frontend**: http://localhost:3000
   - **FastAPI Backend**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

## 🏗️ Project Structure

```
aiproductmanager/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # REST API endpoints
│   │   ├── core/           # Configuration and middleware
│   │   └── services/       # Business logic services
│   ├── Dockerfile
│   └── requirements.txt
├── frontend-react/          # Modern React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AgentChat.tsx
│   │   │   ├── AgentVisualization.tsx
│   │   │   ├── ExecutionPlan.tsx
│   │   │   ├── MockupPreview.tsx
│   │   │   └── ProgressTracker.tsx
│   │   ├── App.tsx         # Main application component
│   │   ├── index.tsx       # Application entry point
│   │   └── index.css       # Tailwind CSS with custom styles
│   ├── public/             # Static assets
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tailwind.config.js  # Tailwind configuration
│   └── tsconfig.json
├── core/                   # Shared agent logic and models
│   ├── llm_client.py       # LLM client abstraction
│   ├── orchestration.py    # Agent orchestration logic
│   ├── models/             # Data models
│   ├── prompts/            # Prompt templates
│   └── agents/             # Individual agent implementations
├── data/                   # Persisted runs (gitignored)
├── tests/                  # Unit tests
├── docker-compose.yml      # Multi-service orchestration
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔧 API Endpoints

### Core Endpoints
- `POST /runs` - Create a new run with a product idea
- `GET /runs/{run_id}` - Get run details and artifacts
- `GET /runs/{run_id}/download` - Download zip bundle
- `GET /health` - Health check

### Example API Usage
```bash
# Create a new PRD run
curl -X POST "http://localhost:8000/runs" \
  -H "Content-Type: application/json" \
  -d '{
    "product_idea": "A mobile app that helps people track their daily water intake with gamification elements"
  }'

# Get run status
curl "http://localhost:8000/runs/{run_id}"

# Download PRD bundle
curl "http://localhost:8000/runs/{run_id}/download" --output prd_bundle.zip
```

## 🤖 Agent Workflow

### 1. **Product Strategist** (Alex Sterling)
- **Role**: Market analysis & business strategy
- **Expertise**: Porter's Five Forces, Blue Ocean Strategy, Business Model Canvas
- **Output**: Market analysis, competitive landscape, business model

### 2. **Technical Architect** (Dr. Maya Chen)
- **Role**: Scalable systems design
- **Expertise**: Cloud-native architecture, microservices, database design
- **Output**: Tech stack recommendations, system architecture, data model

### 3. **UX Writer** (Jordan Rivera)
- **Role**: User experience & microcopy
- **Expertise**: Information architecture, accessibility, voice & tone
- **Output**: User personas, user flows, microcopy guidelines

### 4. **Mockup Designer** (Sofia Rossi)
- **Role**: Visual design & design systems
- **Expertise**: Design thinking, component libraries, responsive design
- **Output**: Wireframe mockups, design system specifications

### 5. **PRD Synthesizer** (Prof. David Park)
- **Role**: PRD synthesis & requirements
- **Expertise**: PRD best practices, stakeholder alignment, risk assessment
- **Output**: Comprehensive PRD document with execution plan

## 📋 PRD Template Enhancements

### Comprehensive PRD Structure
1. **Executive Summary** - Product vision and business case
2. **Market Analysis** - Competitive landscape and opportunity
3. **User Personas** - Target user segments and needs
4. **Features & Requirements** - Detailed feature specifications
5. **Technical Architecture** - System design and tech stack
6. **User Experience** - User flows and interface design
7. **Mockup Specifications** - Wireframe designs and specifications
8. **Execution Plan** - 12-week development roadmap
9. **Success Metrics** - KPIs and measurement criteria
10. **Risks & Mitigations** - Risk assessment and contingency plans

### 12-Week Execution Plan
- **Phase 1: Foundation** (Weeks 1-2) - Setup, architecture, and prototyping
- **Phase 2: Core Features** (Weeks 3-6) - Main feature development
- **Phase 3: Polish & Launch** (Weeks 7-12) - Testing, refinement, and deployment
- **Definition of Done** - Clear completion criteria for each phase

## 🎨 UI/UX Features

### Modern Design System
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Effects**: Smooth color transitions and animated gradients
- **Dark/Light Mode**: Full theme support with automatic detection
- **Micro-interactions**: Hover effects, loading states, and transitions
- **Responsive Design**: Mobile-first approach with breakpoints

### Interactive Components
- **Agent Visualization**: Real-time agent status and collaboration flow
- **Progress Tracker**: Visual progress indicators for each agent
- **Mockup Preview**: Interactive mockup specifications
- **Execution Plan**: Expandable/collapsible roadmap sections
- **Expert Chat**: Simulated conversations between agents

## 🛠️ Development

### Local Development (with Docker)
```bash
# Start all services
docker-compose up --build

# Start specific services
docker-compose up react-frontend backend

# View logs
docker-compose logs -f react-frontend
docker-compose logs -f backend

# Rebuild specific service
docker-compose build react-frontend
```

### Local Development (without Docker)

#### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies from requirements.txt
pip install -r backend/requirements.txt

# Run backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### React Frontend Setup
```bash
# Install Node.js dependencies (package.json)
cd frontend-react
npm install

# Start development server
npm start
```

### Python Dependencies

The project uses separate dependency files for different components:

#### Backend Dependencies (`backend/requirements.txt`)
- **FastAPI** (v0.104.1): Modern web framework for building APIs
- **Uvicorn** (v0.24.0): ASGI server for FastAPI
- **PyAutoGen** (v0.2.14): Multi-agent conversation framework
- **Redis** (v5.0.1): Caching and session storage
- **ReportLab** (v4.0.7): PDF generation for PRDs
- **Pydantic** (v2.5.0): Data validation and settings management
- **Additional libraries**: HTTP client, logging, testing, etc.

#### React Frontend Dependencies (`frontend-react/package.json`)
- **React** (v18.2.0): UI library
- **TypeScript** (v4.9.5): Type-safe JavaScript
- **Tailwind CSS** (v3.3.0): Utility-first CSS framework
- **Framer Motion** (v10.16.4): Animation library
- **Lucide React** (v0.309.0): Icon library
- **Additional packages**: Development tools, testing, etc.

### Running Tests
```bash
# Run all tests
pytest tests/

# Run specific test file
pytest tests/test_backend.py

# Run with coverage
pytest --cov=backend tests/
```

## ⚙️ Configuration

### Environment Variables
See `.env.example` for complete list:

```env
# Required
OPENAI_API_KEY=sk-...              # Your OpenAI API key

# Optional
LOG_LEVEL=INFO                     # Logging level (DEBUG, INFO, WARNING, ERROR)
ENVIRONMENT=development            # Environment (development, production)
REDIS_URL=redis://redis:6379      # Redis connection URL
DATABASE_URL=sqlite:///data/runs.db # Database connection URL
FRONTEND_URL=http://localhost:3000 # React frontend URL
BACKEND_URL=http://localhost:8000  # Backend API URL
```

### Tailwind CSS Configuration
The project uses Tailwind CSS with custom configuration:
- **CSS Variables**: Comprehensive theming system
- **Dark Mode**: Class-based dark mode support
- **Custom Colors**: Agent-specific color schemes
- **Animations**: Custom keyframes and transitions
- **Glass Effects**: Backdrop blur and transparency utilities

## 📊 Monitoring & Observability

### Logging
- Structured JSON logging for production
- Development-friendly formatted logs
- Log levels configurable via environment variables

### Health Checks
- `/health` endpoint for service health monitoring
- Database connectivity checks
- External service dependency checks

### Metrics
- Request/response timing
- Error rates and types
- Agent execution times
- Resource utilization

## 🔒 Security

### Best Practices
- Environment variable configuration
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration for frontend access
- Secure Docker configurations

### Data Privacy
- No persistent storage of sensitive data
- Ephemeral run data with automatic cleanup
- Secure API key management

## 🚀 Deployment

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.yml up --build -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment Options
- **AWS**: ECS/EKS with RDS and ElastiCache
- **Google Cloud**: Cloud Run with Cloud SQL and Memorystore
- **Azure**: Container Instances with Azure SQL and Redis Cache
- **Heroku**: Container registry with Postgres and Redis add-ons

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Maintain backward compatibility
- Use meaningful commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AutoGen Framework** - Microsoft's multi-agent conversation framework
- **FastAPI** - Modern, fast web framework for building APIs
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI** - GPT models for agent intelligence

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/aiproductmanager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/aiproductmanager/discussions)
- **Documentation**: [Project Wiki](https://github.com/yourusername/aiproductmanager/wiki)

---

**Built with ❤️ by the AI Product Manager Team**

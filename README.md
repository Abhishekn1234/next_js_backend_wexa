WEXA CognoDB — Backend

Express + TypeScript backend API for the WEXA CognoDB graph application.

Overview

The backend exposes APIs for:

Dashboard statistics

Developers

Jobs

Skills

Projects

Recommendations

It connects to CognoDB using the official Neo4j driver and executes Cypher queries against the graph database.

Tech Stack

Node.js

Express 5

TypeScript

Neo4j Driver

CognoDB

Zod

CORS

Helmet

Morgan

dotenv

tsx

Folder Structure

backend/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── config/
    │   ├── database.ts
    │   └── env.ts
    │
    ├── controllers/
    │   ├── dashboard.controller.ts
    │   ├── developer.controller.ts
    │   ├── job.controller.ts
    │   ├── project.controller.ts
    │   ├── recommendation.controller.ts
    │   └── skill.controller.ts
    │
    ├── models/
    │   ├── company.model.ts
    │   ├── developer.model.ts
    │   ├── job.model.ts
    │   ├── project.model.ts
    │   ├── relationship.model.ts
    │   └── skill.model.ts
    │
    ├── queries/
    │   ├── developer.queries.ts
    │   ├── job.queries.ts
    │   ├── project.queries.ts
    │   ├── recommendation.queries.ts
    │   └── skill.queries.ts
    │
    ├── routes/
    │   ├── dashboard.routes.ts
    │   ├── developer.routes.ts
    │   ├── job.routes.ts
    │   ├── project.routes.ts
    │   ├── recommendation.routes.ts
    │   └── skill.routes.ts
    │
    ├── seed/
    │   ├── seed.ts
    │   └── seedData.ts
    │
    ├── services/
    │   ├── company.service.ts
    │   ├── dashboard.service.ts
    │   ├── developer.service.ts
    │   ├── job.service.ts
    │   ├── project.service.ts
    │   ├── recommendation.service.ts
    │   └── skill.service.ts
    │
    └── server.ts

Backend Architecture

The request flow is:

HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Cypher Query
     ↓
CognoDB / Neo4j
     ↓
Service Response
     ↓
Controller
     ↓
JSON Response

Routes

Defines API endpoints and connects them to controllers.

Controllers

Reads request parameters, calls services and returns HTTP responses.

Services

Contains application/database operations, opens Neo4j sessions and maps database records.

Queries

Contains Cypher queries used to retrieve graph data.

Models

Defines the expected graph node and relationship shapes.

Seed

Creates the sample graph data and relationships.

Config

database.ts creates the CognoDB/Neo4j driver.

env.ts handles environment configuration.

Graph Data Model

The graph contains:

Developer
Skill
Job
Company
Project

Relationships:

Developer ──HAS_SKILL──> Skill
Developer ──WORKED_ON──> Project
Developer ──WORKED_AT──> Company
Company ──POSTED──> Job
Job ──REQUIRES──> Skill
Skill ──RELATED_TO──> Skill
Project ──USES_SKILL──> Skill

Relationship properties include:

HAS_SKILL
- level
- yearsOfExperience

WORKED_ON
- role
- startDate
- endDate

WORKED_AT
- role
- startDate
- endDate

POSTED
- postedAt

REQUIRES
- importance

RELATED_TO
- strength

Why a Graph Database?

The recommendation features depend on traversing relationships between developers, skills, jobs, companies and projects.

For example:

Developer
   ↓ HAS_SKILL
Skill
   ↓ REQUIRES
Job

and:

Developer
   ↓ HAS_SKILL
Skill
   ↓ RELATED_TO
Related Skill
   ↓ REQUIRES
Job

These relationship traversals are the main reason the application uses CognoDB/Neo4j.

API Base URL

Current local backend:

http://localhost:5001

API base:

http://localhost:5001/api

Health endpoint:

GET /health

API Endpoints

Dashboard

GET /api/dashboard/stats

Developers

GET /api/developers
GET /api/developers/:id
GET /api/developers/:id/skills
GET /api/developers/:id/projects
GET /api/developers/:id/companies
GET /api/developers/skill/:skillId

Search/pagination example:

GET /api/developers?page=1&limit=10&search=react

Jobs

GET /api/jobs
GET /api/jobs/:id
GET /api/jobs/:id/skills
GET /api/jobs/:id/company

Search/pagination example:

GET /api/jobs?page=1&limit=10&search=developer

Skills

GET /api/skills
GET /api/skills/:id
GET /api/skills/:id/related
GET /api/skills/:id/developers
GET /api/skills/:id/jobs

Search/pagination example:

GET /api/skills?page=1&limit=10&search=react

Projects

GET /api/projects
GET /api/projects/:id
GET /api/projects/:id/skills
GET /api/projects/:id/developers

Search/pagination example:

GET /api/projects?page=1&limit=10&search=web

Recommendations

GET /api/recommendations/developers/:developerId/jobs

GET /api/recommendations/developers/:developerId/related-jobs

GET /api/recommendations/jobs/:jobId/developers

GET /api/recommendations/developers/:developerId/similar

Recommendation Logic

Jobs for Developer

The service finds the developer's skills and matches them with job requirements.

Developer
   ↓ HAS_SKILL
Skill
   ↓ REQUIRES
Job

The result includes:

job
company
matchedSkills

Jobs with more matching skills are ranked higher.

Related Skill Jobs

The service traverses related skills:

Developer
   ↓ HAS_SKILL
Skill
   ↓ RELATED_TO
Related Skill
   ↓ REQUIRES
Job

The response includes:

job
company
relatedSkills
matchedRelatedSkills

Developers for Job

Job
   ↓ REQUIRES
Skill
   ↓ HAS_SKILL
Developer

The response includes:

developer
commonSkills

Similar Developers

Developer A
   ↓ HAS_SKILL
Skill
   ↑ HAS_SKILL
Developer B

Developers are ranked by the number of common skills.

Search and Pagination

The listing endpoints support:

page
limit
search

Example:

GET /api/jobs?page=1&limit=10&search=react

The response contains:

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}

The backend calculates:

skip = (page - 1) * limit

and applies SKIP and LIMIT to the Cypher query.

Search is applied to the relevant node properties before pagination.

Environment Configuration

Create:

backend/.env

using:

backend/.env.example

Current local configuration:

PORT=5001
COGNODB_URI=<your-cognodb-uri>
COGNODB_USERNAME=<your-cognodb-username>
COGNODB_PASSWORD=<your-cognodb-password>
FRONTEND_URL=http://localhost:5173

Do not commit:

.env

or real CognoDB credentials.

Installation

From the backend directory:

npm install

Seed Database

Configure the CognoDB credentials first.

Then run:

npm run seed

The seed script creates the application graph and its relationships.

Run Development Server

npm run dev

Backend URL:

http://localhost:5001

Health check:

http://localhost:5001/health

Production Build

npm run build

Production Start

npm start

Typical Backend Startup

cd backend
npm install
npm run seed
npm run dev

The seed command is normally required when setting up/resetting the graph, not every time the server starts.

Frontend Relationship

The backend is consumed by the frontend through Axios.

Frontend Page
   ↓
React Query Hook
   ↓
Use Case
   ↓
Repository
   ↓
Axios
   ↓
Backend Route
   ↓
Controller
   ↓
Service
   ↓
Cypher Query
   ↓
CognoDB

Example:

Developers.tsx
   ↓
useDevelopers()
   ↓
GetDevelopers
   ↓
DeveloperRepositoryImpl
   ↓
GET /api/developers
   ↓
developerController
   ↓
developerService
   ↓
developer Cypher query
   ↓
CognoDB

Recommendation flow:

Recommendations/:developerId
   ↓
useDeveloperJobs()
useRelatedSkillJobs()
useSimilarDevelopers()
   ↓
RecommendationRepositoryImpl
   ↓
Recommendation API
   ↓
recommendationController
   ↓
recommendationService
   ↓
recommendation.queries.ts
   ↓
CognoDB
   ↓
Frontend React Flow graph

CORS

The backend should allow the frontend origin configured by:

FRONTEND_URL=http://localhost:5173

If the frontend cannot call the API, check the backend CORS configuration and restart the backend after changing .env.

Troubleshooting

CognoDB connection failed

Check:

COGNODB_URI=
COGNODB_USERNAME=
COGNODB_PASSWORD=

Confirm that the CognoDB instance is running and that the credentials are correct.

CORS error

Verify:

FRONTEND_URL=http://localhost:5173

Restart the backend.

Frontend receives no data

Confirm:

Backend running
      ↓
/health works
      ↓
CognoDB connected
      ↓
Seed completed
      ↓
API returns data

Empty recommendation graph

Check:

The developer ID exists.

The developer has HAS_SKILL relationships.

Jobs have REQUIRES relationships.

Skills have RELATED_TO relationships when related-skill recommendations are expected.

Recommendation API responses contain valid id values.

Recommended Reading Order

package.json
   ↓
.env.example
   ↓
src/server.ts
   ↓
src/config/
   ↓
src/routes/
   ↓
src/controllers/
   ↓
src/services/
   ↓
src/queries/
   ↓
src/seed/

Common Commands

npm install
npm run seed
npm run dev
npm run build
npm start
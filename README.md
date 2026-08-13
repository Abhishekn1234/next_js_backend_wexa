WEXA CognoDB — Backend

Express + TypeScript backend API for the WEXA CognoDB graph application.

The backend connects to CognoDB using the official Neo4j JavaScript driver and executes parameterized Cypher queries against the graph database.

Live API

Production backend:

https://next-js-backend-wexa.onrender.com

API base URL:

https://next-js-backend-wexa.onrender.com/api

Health endpoint:

GET /health
Overview

The backend exposes APIs for:

Dashboard statistics
Developers
Jobs
Skills
Projects
Recommendations

The backend is responsible for:

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
CognoDB
      ↓
Service Response
      ↓
Controller
      ↓
JSON Response
Technology Stack
Node.js
Express 5
TypeScript
Neo4j JavaScript Driver
CognoDB
openCypher
Zod
CORS
Helmet
Morgan
dotenv
tsx

CognoDB supports openCypher over Bolt and can be accessed through official Neo4j drivers.

Why a Graph Database?

This application is designed around relationships between:

Developers
    ↓
Skills
    ↓
Jobs
    ↓
Companies

There are also relationships between:

Developers ↔ Projects
Skills ↔ Skills
Developers ↔ Developers

The interesting questions in this application are relationship-based.

For example:

Which jobs match a developer's skills?
Which jobs match skills related to a developer's skills?
Which developers are suitable for a particular job?
Which developers have similar skills?
Which company provides a recommended job?
Which skills connect a developer to a job?

These questions require multiple graph traversals.

A relational database could represent the same data using many tables and JOIN operations, but the recommendation logic becomes more complicated as relationship depth increases.

CognoDB allows these relationships to be expressed naturally using Cypher patterns.

The assignment specifically asks the README to explain why the selected use case benefits from a graph database rather than a relational schema.

Graph Data Model

The main graph contains the following node types:

Developer
Skill
Job
Company
Project

Main relationships:

Developer ──HAS_SKILL──> Skill

Skill ──REQUIRES──> Job

Job ──POSTED_BY──> Company

Developer ──WORKED_ON──> Project

Project ──USES_SKILL──> Skill

Skill ──RELATED_TO──> Skill

Developer similarity is derived from shared HAS_SKILL relationships.

Graph Diagram
                         ┌─────────────┐
                         │   Company   │
                         └──────▲──────┘
                                │
                           POSTED_BY
                                │
                         ┌──────┴──────┐
                         │     Job     │
                         └──────▲──────┘
                                │
                             REQUIRES
                                │
                                ▼
                         ┌─────────────┐
                         │    Skill    │
                         └──────▲──────┘
                                │
                           HAS_SKILL
                                │
                                ▼
                         ┌─────────────┐
                         │  Developer  │
                         └──────┬──────┘
                                │
                           WORKED_ON
                                │
                                ▼
                         ┌─────────────┐
                         │   Project   │
                         └──────┬──────┘
                                │
                          USES_SKILL
                                │
                                ▼
                         ┌─────────────┐
                         │    Skill    │
                         └─────────────┘

Skill ─────────RELATED_TO─────────> Skill

The assignment requires a documented graph model with labeled nodes, typed relationships, properties, and a simple diagram in the README.

Graph Relationships Used for Recommendations
Jobs for a Developer
Developer
    ↓ HAS_SKILL
Skill
    ↓ REQUIRES
Job
    ↓ POSTED_BY
Company

This finds jobs whose required skills match the developer's skills.

The API returns:

job
company
matchedSkills

Jobs with more matching skills are ranked higher.

Related Skill Jobs
Developer
    ↓ HAS_SKILL
Skill
    ↓ RELATED_TO
Related Skill
    ↓ REQUIRES
Job

This allows the system to recommend jobs even when the job does not directly require the developer's exact skill.

Example:

Developer
    ↓
React
    ↓ RELATED_TO
Next.js
    ↓
Next.js Engineer

The API returns:

job
company
relatedSkills
matchedRelatedSkills
Developers for a Job
Job
    ↓ REQUIRES
Skill
    ↑ HAS_SKILL
Developer

This finds developers whose skills match the requirements of a job.

The result includes:

developer
commonSkills
Similar Developers
Developer A
     ↓
 HAS_SKILL
     ↓
   Skill
     ↑
 HAS_SKILL
     ↑
Developer B

Developers are ranked based on the number of common skills.

Main Cypher Queries

The application uses parameterized Cypher queries through the official Neo4j driver.

The assignment requires at least one multi-hop traversal and at least one query that demonstrates a graph-oriented problem. It also requires parameterized queries rather than string-concatenated Cypher.

Find Jobs Matching Developer Skills
MATCH (d:Developer {id: $developerId})
MATCH (d)-[:HAS_SKILL]->(s:Skill)
MATCH (s)<-[:REQUIRES]-(j:Job)
OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)

WITH j, c, count(DISTINCT s) AS matchedSkills

RETURN
  j,
  c,
  matchedSkills

ORDER BY matchedSkills DESC

This is a multi-hop graph traversal:

Developer
   ↓
Skill
   ↑
Job
   ↓
Company
Find Jobs Through Related Skills
MATCH (d:Developer {id: $developerId})
MATCH (d)-[:HAS_SKILL]->(s:Skill)
MATCH (s)-[:RELATED_TO]->(related:Skill)
MATCH (related)<-[:REQUIRES]-(j:Job)
OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)

WITH
  j,
  c,
  collect(DISTINCT related.name) AS relatedSkills,
  count(DISTINCT related) AS matchedRelatedSkills

RETURN
  j,
  c,
  relatedSkills,
  matchedRelatedSkills

ORDER BY matchedRelatedSkills DESC

This demonstrates why graph traversal is useful for the recommendation system.

Find Developers for a Job
MATCH (j:Job {id: $jobId})
MATCH (j)-[:REQUIRES]->(s:Skill)
MATCH (d:Developer)-[:HAS_SKILL]->(s)

WITH
  d,
  count(DISTINCT s) AS commonSkills

RETURN
  d,
  commonSkills

ORDER BY commonSkills DESC
Find Similar Developers
MATCH (d:Developer {id: $developerId})
MATCH (d)-[:HAS_SKILL]->(s:Skill)
MATCH (other:Developer)-[:HAS_SKILL]->(s)

WHERE other.id <> d.id

WITH
  other,
  count(DISTINCT s) AS commonSkills

RETURN
  other AS developer,
  commonSkills

ORDER BY commonSkills DESC
Search Developers
MATCH (d:Developer)

WHERE
  toLower(d.name) CONTAINS toLower($search)
  OR toLower(d.location) CONTAINS toLower($search)
  OR toLower(d.email) CONTAINS toLower($search)

RETURN d

ORDER BY d.name ASC

SKIP $skip
LIMIT $limit
Search Jobs
MATCH (j:Job)

WHERE
  toLower(j.title) CONTAINS toLower($search)
  OR toLower(j.description) CONTAINS toLower($search)
  OR toLower(j.location) CONTAINS toLower($search)

RETURN j

ORDER BY j.createdAt DESC

SKIP $skip
LIMIT $limit
Search Skills
MATCH (s:Skill)

WHERE
  toLower(s.name) CONTAINS toLower($search)
  OR toLower(s.description) CONTAINS toLower($search)

RETURN s

ORDER BY s.name ASC

SKIP $skip
LIMIT $limit
Search Projects
MATCH (p:Project)

WHERE
  toLower(p.name) CONTAINS toLower($search)
  OR toLower(p.description) CONTAINS toLower($search)

RETURN p

ORDER BY p.startDate DESC

SKIP $skip
LIMIT $limit
Parameterized Queries

The backend does not concatenate user input into Cypher strings.

Instead, values are passed separately:

const result = await session.run(
  `
  MATCH (d:Developer)
  WHERE toLower(d.name) CONTAINS toLower($search)
  RETURN d
  SKIP $skip
  LIMIT $limit
  `,
  {
    search,
    skip: neo4j.int(skip),
    limit: neo4j.int(limit),
  }
);

This keeps user input separate from the Cypher query structure.

Seed Data

The backend contains a seed script for creating realistic graph data.

The seed data contains:

Developers
Skills
Companies
Jobs
Projects
Relationships

The seed process creates nodes and relationships such as:

Developer → HAS_SKILL → Skill

Skill → REQUIRES → Job

Job → POSTED_BY → Company

Developer → WORKED_ON → Project

Project → USES_SKILL → Skill

Skill → RELATED_TO → Skill

The assignment requires realistic seed data loaded through a script included in the repository.

Backend Folder Structure
backend/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
│
└── src/
    │
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
Backend Layer Responsibilities
Routes

Routes define API endpoints and connect them to controllers.

Route
 ↓
Controller
Controllers

Controllers:

Read request parameters
Validate basic input
Call services
Return HTTP responses
Handle errors
Services

Services contain application and database logic.

They:

Create Neo4j sessions
Execute Cypher
Process database results
Calculate pagination
Map graph records into API responses
Queries

The query layer contains the application's Cypher queries.

Keeping queries separated makes the graph logic easier to understand and maintain.

Models

Models describe expected node and relationship structures.

Seed

The seed layer creates realistic sample graph data.

Config

database.ts creates the Neo4j driver.

env.ts loads environment configuration.

API Endpoints
Health
GET /health
Dashboard
GET /api/dashboard/stats
Developers
GET /api/developers
GET /api/developers/:id
GET /api/developers/:id/skills
GET /api/developers/:id/projects
GET /api/developers/:id/companies
GET /api/developers/skill/:skillId

Search and pagination:

GET /api/developers?page=1&limit=10&search=react
Jobs
GET /api/jobs
GET /api/jobs/:id
GET /api/jobs/:id/skills
GET /api/jobs/:id/company

Search and pagination:

GET /api/jobs?page=1&limit=10&search=developer
Skills
GET /api/skills
GET /api/skills/:id
GET /api/skills/:id/related
GET /api/skills/:id/developers
GET /api/skills/:id/jobs

Search and pagination:

GET /api/skills?page=1&limit=10&search=react
Projects
GET /api/projects
GET /api/projects/:id
GET /api/projects/:id/skills
GET /api/projects/:id/developers

Search and pagination:

GET /api/projects?page=1&limit=10&search=web
Recommendations

Jobs for developer:

GET /api/recommendations/developers/:developerId/jobs

Jobs through related skills:

GET /api/recommendations/developers/:developerId/related-jobs

Developers for job:

GET /api/recommendations/jobs/:jobId/developers

Similar developers:

GET /api/recommendations/developers/:developerId/similar
Search and Pagination

Listing endpoints support:

page
limit
search

Pagination uses:

skip = (page - 1) * limit

The Cypher query then applies:

SKIP $skip
LIMIT $limit

Search is applied before pagination.

Example:

GET /api/jobs?page=1&limit=10&search=react

Example response structure:

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
Environment Configuration

Create:

.env

Example:

PORT=5001

COGNODB_URI=bolt+s://<your-instance>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password>

FRONTEND_URL=http://localhost:5173

Do not commit the real .env file.

Use:

.env.example

as the configuration template.

The assignment explicitly requires connection credentials to come from environment variables and not be committed to the repository.

CognoDB Setup

Create a CognoDB Cloud account and create a free instance.

CognoDB provides a Bolt URI similar to:

bolt+s://<instance-id>.databases.cognodb.cloud

The application uses:

Username: cognodb
Password: <generated password>

The password should be stored securely in the backend environment.

The assignment specifies using the official Neo4j driver to connect to CognoDB.

Installation

Enter the backend directory:

cd backend

Install dependencies:

npm install

Create the environment file:

.env

Add the CognoDB credentials.

Seed the Database

Run:

npm run seed

This creates:

Developers
Skills
Companies
Jobs
Projects

and their relationships.

Run Development Server
npm run dev

The backend runs locally on:

http://localhost:5001

API:

http://localhost:5001/api
Production Build
npm run build
Start Production Server
npm start
Hosted Deployment

The backend is deployed on Render.

Production URL:

https://next-js-backend-wexa.onrender.com

Production API:

https://next-js-backend-wexa.onrender.com/api

The frontend can consume the production API directly without running the backend locally.

Error Handling

The backend returns meaningful HTTP errors when database/API operations fail.

Example:

{
  "success": false,
  "message": "Failed to fetch developers"
}

The backend also closes Neo4j sessions in finally blocks to avoid leaving database sessions open.

The assignment requires graceful handling when the graph database is unreachable.

Security

Never commit:

.env

Never expose:

COGNODB_PASSWORD

Never place database credentials directly inside source code.

Use:

.env.example

for safe configuration documentation.

Frontend ↔ Backend Relationship

The complete application flow is:

                    FRONTEND
                        │
                        ▼
                React Components
                        │
                        ▼
                 React Query Hooks
                        │
                        ▼
                  Use Cases
                        │
                        ▼
                   Repositories
                        │
                        ▼
                     Axios
                        │
                        ▼
              ─────── HTTP ───────
                        │
                        ▼
                    BACKEND
                        │
                        ▼
                     Routes
                        │
                        ▼
                  Controllers
                        │
                        ▼
                   Services
                        │
                        ▼
                  Cypher Queries
                        │
                        ▼
                Neo4j JavaScript Driver
                        │
                        ▼
                    CognoDB
                        │
                        ▼
                 Graph Data

This separation allows the frontend to remain independent from the database implementation.

Assignment Requirements Covered

The WEXA assignment asks for:

A working graph-backed application
Thoughtful graph data model
Labeled nodes
Typed relationships
Properties
Graph model diagram
Realistic seed data
Multi-hop Cypher queries
A query that demonstrates a graph-oriented problem
Parameterized queries
Functional web UI
Loading and empty states
Environment-based database credentials
Graceful database error handling
README documentation
Main query explanations
UI screenshots
Hosted demo
Short screen recording

These requirements are stated in the assignment specification.

Final Submission Checklist

Before submitting:

[ ] Frontend source code committed
[ ] Backend source code committed
[ ] Seed script committed
[ ] Cypher queries committed
[ ] .env excluded from Git
[ ] .env.example included
[ ] Frontend README updated
[ ] Backend README updated
[ ] Graph model documented
[ ] Why Graph Database section documented
[ ] Main Cypher queries explained
[ ] Search tested
[ ] Pagination tested
[ ] Infinite scrolling tested
[ ] Recommendation APIs tested
[ ] Recommendation graph tested
[ ] Loading states tested
[ ] Empty states tested
[ ] Error states tested
[ ] Production backend tested
[ ] UI screenshots added
[ ] Hosted frontend demo added
[ ] Screen recording prepared
[ ] Final production build tested
Summary

WEXA CognoDB is a graph-based developer and job recommendation application.

The system connects:

Developer
   ↓
Skill
   ↓
Job
   ↓
Company

and also supports:

Developer
   ↓
Project
   ↓
Skill

and:

Skill
   ↓
RELATED_TO
   ↓
Skill

These relationships power the recommendation features.

The backend uses Express, TypeScript, the official Neo4j driver and Cypher to communicate with CognoDB.

The frontend uses React, TypeScript, React Query, Axios and React Flow to present the graph data through an interactive UI.

Production backend:

https://next-js-backend-wexa.onrender.com

Production API:

https://next-js-backend-wexa.onrender.com/api
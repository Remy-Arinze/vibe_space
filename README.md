# VibeSpace - Team-Based Task Manager

A comprehensive team collaboration platform built with Next.js and NestJS, featuring role-based access control, team management, and task tracking.

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT with email verification
- **Email**: Nodemailer (configured for Mailtrap in development)

## 🏗️ Architecture

### Backend Structure
```
backend/src/
├── auth/           # Authentication module (JWT, guards, strategies)
├── users/          # User management
├── teams/          # Team management and member roles
├── tasks/          # Task CRUD with team-scoped authorization
├── common/         # Shared decorators and utilities
└── database/       # Database configuration and seeds
```

### Frontend Structure
```
frontend/src/
├── app/            # Next.js app router pages
├── components/     # Reusable UI components
├── context/        # React context providers (Auth, Team, Task)
└── types/          # TypeScript type definitions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Database Setup

Start PostgreSQL using Docker:
```bash
cd backend
docker-compose up -d
```

Or use your local PostgreSQL instance and create a database named `vibe_space`.

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run start:dev
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 3 test users (john@example.com, jane@example.com, bob@example.com)
- 2 teams (Development Team, Marketing Team)
- 5 sample tasks with various statuses and assignments

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**Test Credentials:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `bob@example.com` | Password: `password123`

## 🔐 Authentication Flow

1. **Registration**: User signs up with email/username/password
2. **Email Verification**: System sends verification email with token
3. **Login**: User logs in after email verification
4. **JWT Token**: Backend issues JWT for authenticated requests

## 👥 Team Management

### Roles & Permissions

**Admin:**
- Create/edit/delete team
- Add/remove team members
- Assign roles to members
- Full task management (create/edit/delete any task)

**Member:**
- View team and tasks
- Create new tasks
- Edit/delete only their own created tasks
- Edit tasks assigned to them

### Team Operations

- Users can belong to multiple teams
- Team context switching in the UI
- Role-based UI rendering (conditional buttons/actions)

## 📋 Task Management

### Features
- Create tasks with title, description, and status
- Assign tasks to team members
- Three status levels: To Do, In Progress, Done
- Team-scoped task visibility
- Role-based task editing permissions

### Task Views
- **All Tasks**: All tasks in current team
- **Assigned to Me**: Tasks assigned to current user
- **Created by Me**: Tasks created by current user

## 🔒 Security Implementation

### Backend Security
- JWT authentication with configurable expiration
- Role-based guards for team operations
- Team membership verification for all operations
- Input validation using class-validator
- Password hashing with bcrypt

### Authorization Patterns
```typescript
// Example: Team-scoped task creation
@UseGuards(JwtAuthGuard)
@Post('teams/:teamId/tasks')
async createTask(@Param('teamId') teamId: string, @GetUser() user: User) {
  // Verify user is team member before allowing task creation
  await this.teamsService.verifyUserIsTeamMember(teamId, user.id);
  // ... create task
}
```

## 🎨 Frontend Architecture

### State Management
- **AuthContext**: User authentication state
- **TeamContext**: Team data and current team selection
- **TaskContext**: Task operations and data

### Key Design Decisions

1. **Context-Aware UI**: Interface adapts based on selected team
2. **Role-Based Rendering**: UI elements show/hide based on user permissions
3. **Optimistic Updates**: Immediate UI feedback with error handling
4. **Responsive Design**: Mobile-first approach with Tailwind CSS

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register          # User registration
POST /api/auth/login             # User login
GET  /api/auth/verify-email      # Email verification
POST /api/auth/resend-verification # Resend verification email
```

### Teams
```
GET    /api/teams                # Get user's teams
POST   /api/teams                # Create team
GET    /api/teams/:id            # Get team details
PATCH  /api/teams/:id            # Update team
DELETE /api/teams/:id            # Delete team
POST   /api/teams/:id/members    # Add team member
DELETE /api/teams/:id/members/:userId # Remove team member
PATCH  /api/teams/:id/members/:userId/role # Update member role
GET    /api/teams/:id/members    # Get team members
```

### Tasks
```
GET    /api/tasks/team/:teamId   # Get team tasks
GET    /api/tasks/assigned       # Get tasks assigned to user
GET    /api/tasks/created        # Get tasks created by user
POST   /api/tasks               # Create task
GET    /api/tasks/:id           # Get task details
PATCH  /api/tasks/:id           # Update task
DELETE /api/tasks/:id           # Delete task
```

## 🧪 Example API Requests

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "securepassword123"
}
```

### Create Team
```json
POST /api/teams
Authorization: Bearer <jwt_token>
{
  "name": "My Awesome Team",
  "description": "A team for awesome projects"
}
```

### Create Task
```json
POST /api/tasks
Authorization: Bearer <jwt_token>
{
  "title": "Implement new feature",
  "description": "Add user profile management functionality",
  "status": "To Do",
  "teamId": "team-uuid-here",
  "assigneeId": "user-uuid-here"
}
```

### Add Team Member
```json
POST /api/teams/:teamId/members
Authorization: Bearer <jwt_token>
{
  "email": "newmember@example.com",
  "role": "Member"
}
```

## 🔧 Development

### Running Tests
```bash
cd backend
npm run test
```

### Database Migration
The application uses TypeORM synchronization in development. For production, implement proper migrations:

```bash
npm run migration:generate -- -n CreateInitialTables
npm run migration:run
```

### Environment Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=vibe_space
JWT_SECRET=your-super-secret-jwt-key
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your-mailtrap-username
MAIL_PASS=your-mailtrap-password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure production email service
5. Build: `npm run build`
6. Start: `npm run start:prod`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

## 🎯 Key Features Implemented

✅ **Multi-team Support**: Users can belong to multiple teams
✅ **Role-based Access Control**: Admin/Member roles with different permissions
✅ **Team-scoped Tasks**: Tasks are isolated per team
✅ **Email Verification**: Secure user registration flow
✅ **Responsive UI**: Works on desktop and mobile
✅ **Real-time Context**: UI updates based on team selection
✅ **Comprehensive Validation**: Input validation on both frontend and backend
✅ **Error Handling**: Graceful error handling with user feedback



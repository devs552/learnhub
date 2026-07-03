# Student Enrollment Approval System

## Overview

LearnHub now includes a complete enrollment approval workflow. Students must be approved by admins before they can access courses.

## Student Flow

### 1. Sign Up
- Student fills out signup form with name, email, and password
- Account is created with `approvalStatus: 'pending'`
- **Redirect**: Approval Waiting Page (`/approval-waiting`)

### 2. Approval Waiting Screen
- Student sees a beautiful animated waiting screen
- Email address displayed
- Auto-refresh every 5 seconds to check approval status
- When admin approves: automatic redirect to dashboard

### 3. Admin Approval/Rejection
- Admin receives email notification (if configured)
- Admin logs into admin panel
- Views pending students table
- Clicks "Approve" or "Reject"

### 4. After Approval
- Student receives approval email from LearnHub
- Email contains login link and course list
- Student can now sign in normally

### 5. If Rejected
- Student receives rejection email
- Cannot sign in to account

## Admin Workflow

### Admin Dashboard Updates

The admin dashboard now shows:

1. **Pending Approvals Alert** - Prominent banner when pending requests exist
2. **Pending Approvals Stat Card** - Number of pending approvals in stats grid
3. **Pending Students Table** - Full table with:
   - Student name
   - Email address
   - Requested date
   - Approve/Reject buttons

### Approving Students

```
Admin Dashboard → Pending Students Table → Click "Approve"
↓
Email sent to student with approval notice
↓
Student can now login
```

### Rejecting Students

```
Admin Dashboard → Pending Students Table → Click "Reject"
↓
Email sent to student with rejection notice
↓
Student cannot login
```

## Database Schema

### User Model Updates

```typescript
{
  email: String,
  password: String,
  name: String,
  approvalStatus: 'pending' | 'approved' | 'rejected', // default: pending
  approvalRequestedAt: Date,  // When signup happened
  approvedAt?: Date,          // When admin approved
  approvedBy?: ObjectId,      // Admin ID who approved
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Check Approval Status
```
GET /api/users/approval-status?email=student@example.com
Response: { approvalStatus, email, name }
```

### Admin: Get Pending Users
```
GET /api/admin/users/approval?status=pending
Headers: admin_token cookie required
Response: { users: [...] }
```

### Admin: Approve/Reject User
```
POST /api/admin/users/approval
Headers: admin_token cookie required
Body: { userId, action: 'approve' | 'reject' }
Response: { message, user }
```

### Get Dashboard (Updated)
```
GET /api/admin/dashboard
Headers: admin_token cookie required
Response: {
  stats: { 
    ..., 
    pendingApprovals: number
  },
  students: [...],
  pendingStudents: [{ id, name, email, approvalRequestedAt }]
}
```

## Email Configuration

### Environment Variables

```env
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@learnhub.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Default Configuration (Development)

If no SMTP settings are provided, emails are logged to console:
- Uses `nodemailer` with `localhost:1025` (mailhog default)
- Safe for development without real email sending

### Email Templates

#### Approval Email
- Subject: "Your LearnHub Enrollment is Approved!"
- Contains: Welcome message, course list, login link

#### Rejection Email
- Subject: "Your LearnHub Enrollment Request"
- Contains: Regret message, support contact

## Sign In Behavior

### Pending Approval
```
Login attempt → Account found → Status: pending
Response: 403 Forbidden
Message: "Your account is awaiting admin approval"
```

### Rejected
```
Login attempt → Account found → Status: rejected
Response: 403 Forbidden
Message: "Your enrollment request was rejected"
```

### Approved
```
Login attempt → Account found → Status: approved
Response: 200 OK
Redirect: /dashboard
```

## Components

### ApprovalWaiting Component (`/components/auth/ApprovalWaiting.tsx`)
- Displays while student waits for approval
- Auto-checks status every 5 seconds
- Shows visual progress indicator
- Redirects when approved

### Admin Dashboard Updates
- Pending approvals section added
- Student approval buttons
- Real-time status updates

## Testing

### Default Admin Account
After running `/api/seed`:
- Email: `admin@learnhub.com`
- Password: `admin123`

### Test Flow

1. **Create Student Account**
   - Visit `/auth/signup`
   - Fill form and submit
   - Redirected to approval waiting screen

2. **Check Admin Dashboard**
   - Login to `/admin/signin`
   - See pending student in dashboard
   - Click Approve/Reject

3. **Test Student Login**
   - If approved: Can login normally
   - If pending: Get "awaiting approval" message
   - If rejected: Get "request rejected" message

## Security Features

1. **Role-Based Access** - Only admins can approve/reject
2. **Token Verification** - All admin endpoints require valid token
3. **Status Validation** - Only approved users can access courses
4. **Audit Trail** - Tracks who approved and when
5. **Email Verification** - Confirmations sent to student email

## Email Flow Diagram

```
Student Signs Up
    ↓
Status: pending
Redirect to Approval Waiting
    ↓
Admin Reviews in Dashboard
    ↓
Admin Clicks Approve
    ↓
Approval Email Sent → Student Receives Notification
    ↓
Student Can Now Sign In
    ↓
Access to Courses & Learning
```

## Troubleshooting

### Emails Not Sending
- Check SMTP configuration in `.env.local`
- Verify email credentials
- Check server logs for errors
- For development, use mailhog on localhost:1025

### Student Stuck on Approval Screen
- Check `/api/users/approval-status` endpoint
- Verify user status in database
- Admin should refresh dashboard and approve

### Admin Can't See Pending Students
- Verify admin token in cookies
- Check if students have `approvalStatus: 'pending'`
- Try refreshing admin dashboard

## Future Enhancements

1. Bulk approval/rejection
2. Rejection reason templates
3. Automated approval based on criteria
4. Approval deadline reminders
5. Approval audit log viewer
6. SMS notifications
7. Webhook integrations

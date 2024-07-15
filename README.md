# React Moodle Admin Dashboard

A control panel for managing students and courses that interacts with the Moodle API. Implemented using React based on the FSD architecture. It uses Zustand for state management, MUI for the UI, and mui/x-data-grid for table implementations. It features seamless authentication from an external application based on existing user data, as well as automatic user registration.
The system also includes user notifications regarding administrator actions related to course assignment/removal and changes in completion deadlines via a Telegram bot.

The application includes sections for:

- Statistics
- Users
- Courses

## Statistics

This page contains a table that displays statistics of all users and their course completion results, specifically:

- Result (points/percentage)
- Status
- Completion date

### Detailed Statistics

Clicking on a cell displays detailed user statistics. A popup shows the results of the best attempt:
- Date/Time
- Questions answered
- Points scored
- Passing score
- Time spent
- Result

Additionally, it shows detailed attempt information:

- Question formulation
- Option selected by the user
- Result (correct/incorrect)
- Points scored for the question
- Correct answer formulation

## Courses

This page displays a table of all available courses in the learning system for application users:

- Course name
- Course description

It also provides the ability to block each course for specific users.

## Users

This page shows a table listing all users, with the ability to mass block/unblock courses for selected users and set deadlines for course completion.

### Mass Editing

This page features a set of cards for the available courses and the ability to block/unblock courses as well as select a deadline by which the course must be completed.



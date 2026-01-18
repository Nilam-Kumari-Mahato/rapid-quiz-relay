# Quizora – Real-Time Quiz Architecture

## Core Principles
- Server is the source of truth
- Clients are reactive views
- All time validation happens server-side

## Components
Frontend:
- React + TypeScript
- Convex subscriptions for live updates

Backend:
- Convex mutations for session control
- Convex queries for live state sync

## Planned Relay Engine Enhancements
- Time-locked answers
- Synchronized transitions
- Reconnection recovery
- Race-condition prevention

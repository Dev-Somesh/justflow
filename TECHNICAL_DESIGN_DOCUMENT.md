# Technical Design Document

## 1. Introduction

This document outlines the technical design and architecture for the JustFlow application, with a focus on the front-end.

This document aligns with the BMAD plan (Build-Measure-Analyze-Design). The Visual Workflow Builder described here directly fulfills BMAD Phase 2 “Custom workflows.” See `docs/BMAD.md` and `VISUAL_WORKFLOW_BUILDER_SPEC.md` for the program plan and detailed feature specification.

## 2. Architecture Overview

*   **Front-End:** A single-page application (SPA) built with React, TypeScript, and Vite.
*   **UI:** The UI is built using shadcn/ui components and styled with Tailwind CSS.
*   **State Management:** TanStack Query is used for server state management (fetching, caching, and updating data from the back-end). For client-side state, we will use a combination of React's built-in state management (useState, useReducer) and Zustand for more complex global state.
*   **Routing:** React Router is used for client-side routing.
*   **Testing:** Vitest is used for unit and integration testing, and Playwright is used for end-to-end testing.

## 3. Component Hierarchy

The application's components are organized in the `src/components` directory. The main structure is as follows:

*   `src/components/layouts`: Contains the main layout components of the application (e.g., `AppLayout`).
*   `src/components/ui`: Contains the reusable UI components from shadcn/ui.
*   `src/components/features`: This directory will be created to house the components for specific features, such as the "Visual Workflow Builder".

### 3.1. Visual Workflow Builder Components

The "Visual Workflow Builder" will have the following component structure:

*   `src/components/features/workflow-builder/`:
    *   `WorkflowBuilder.tsx`: The main component that brings everything together.
    *   `Canvas.tsx`: The component that renders the canvas and handles panning and zooming.
    *   `Node.tsx`: A generic component for rendering a node on the canvas.
    *   `NodePalette.tsx`: The component for the list of available nodes.
    *   `PropertiesPanel.tsx`: The component for editing the properties of a selected node.
    *   `Connection.tsx`: The component for rendering the connections between nodes.

## 4. State Management

### 4.1. Server State (TanStack Query)

*   TanStack Query will be used to manage all interactions with the back-end API.
*   We will define custom hooks for each API endpoint (e.g., `useGetWorkflows`, `useCreateWorkflow`).
*   The query keys will be managed in a structured way to allow for easy invalidation and refetching of data.

### 4.2. Client State (Zustand)

*   For the "Visual Workflow Builder", we will use Zustand to manage the state of the workflow being built. This includes the nodes, their positions, and the connections between them.
*   The Zustand store will be defined in `src/stores/workflow-builder.store.ts`.

## 5. API Design

(This section assumes a RESTful API. The actual API design would need to be more detailed.)

*   **Workflows:**
    *   `GET /api/workflows`: Get a list of all workflows.
    *   `GET /api/workflows/{id}`: Get a single workflow.
    *   `POST /api/workflows`: Create a new workflow.
    *   `PUT /api/workflows/{id}`: Update a workflow.
    *   `DELETE /api/workflows/{id}`: Delete a workflow.

## 6. Deployment

*   The application will be built using `npm run build`.
*   The resulting static files in the `dist` directory can be deployed to any static hosting service (e.g., Vercel, Netlify, AWS S3).

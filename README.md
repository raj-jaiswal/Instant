# Instant

Instant is a **mobile-first AI automation app** built with React Native
and Expo that helps users manage unread conversations across
**Instagram, WhatsApp, and LinkedIn** automatically. It uses
**Mobilerun** (powered by **DroidRun**) to control real Android devices,
read messages and media, generate context-aware replies, and write
structured summaries back into the app.

Unlike desktop-controlled automation tools, Instant is designed as a
**fully mobile-driven experience**, where task creation, monitoring,
memory management, and termination all happen directly from the phone.

------------------------------------------------------------------------

## Core Features

-   AI-powered automation for Instagram, WhatsApp, and LinkedIn\
-   Context-aware replies using a persistent, editable memory store\
-   Handles both **text messages and media** (reels, posts, shared
    content + comments)\
-   Clear separation of **personal and professional communication**\
-   Fully on-device context and log storage\
-   Manual launch and termination control\
-   Detailed summaries and execution logs after each run\
-   Logout and credential wipe at any time

------------------------------------------------------------------------

## Context System

Instant includes a dedicated **Context tab** that stores a JSON-based
memory of people you interact with.

Before every task: - Context is injected into the agent prompt

After every task: - The agent updates and refines the context - Saves it
for future executions

This enables personalized replies for friends, professional tone for
recruiters, and consistent messaging for business use cases.

------------------------------------------------------------------------

## Automation Flow

1.  User selects a platform and launches a task\
2.  Instant builds a prompt with stored context\
3.  Task is sent to the Mobilerun API\
4.  Agent interacts with the target app:
    -   Reads messages and media
    -   Analyzes sentiment and comments
    -   Sends appropriate replies\
5.  Agent returns to Instant, updates context, writes a summary, and
    terminates

------------------------------------------------------------------------

## Screens

-   **Home**: Launch/terminate tasks, live status, summaries\
-   **Logs**: Session history and execution details\
-   **Context**: Editable memory store and logout

------------------------------------------------------------------------

## Tech Stack

-   React Native\
-   Expo\
-   React Navigation\
-   AsyncStorage\
-   Mobilerun API\
-   DroidRun\
-   Expo Vector Icons\
-   EAS Build

------------------------------------------------------------------------

## Building APK

``` bash
npm install -g eas-cli
eas login
npx expo prebuild
eas build -p android --profile apk
```

------------------------------------------------------------------------

## Challenges

-   Limited and evolving Mobilerun documentation\
-   Designing a fully mobile-driven agent workflow instead of
    desktop-based control

------------------------------------------------------------------------

## Security

-   All data stored locally\
-   No background automation\
-   Credentials removable at any time

------------------------------------------------------------------------

## Intended Use

-   Personal inbox management\
-   Professional messaging\
-   Business and customer support automation

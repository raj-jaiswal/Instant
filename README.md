# Instant

Instant is a **mobile-first AI automation application** built with
**React Native and Expo** that helps users manage unread conversations
across **Instagram, WhatsApp, and LinkedIn** automatically. It
integrates with **Mobilerun**, powered internally by **DroidRun**, to
control real Android devices, read messages and media, analyze context,
and generate accurate, human-like replies.

Unlike most agent platforms that rely on desktop-based orchestration,
Instant is designed as a **fully mobile-driven experience**. Task
creation, monitoring, context management, and termination all happen
directly from the phone. 


Download from: <a href='https://github.com/raj-jaiswal/Instant/releases/'>https://github.com/raj-jaiswal/Instant/releases/</a>

------------------------------------------------------------------------

## Core Features

-   AI-powered automation for Instagram, WhatsApp, and LinkedIn
-   Persistent **context memory** for personalized replies
-   Handles **text messages, reels, posts, and shared media**, including
    comment sentiment
-   Clear distinction between **personal and professional
    communication**
-   Fully local storage of summaries, logs, and context
-   Manual task launch and termination
-   Detailed execution summaries after every run
-   Execution logs for debugging and transparency
-   Secure logout with credential wipe

------------------------------------------------------------------------

## Context System (Key Differentiator)

Instant includes a dedicated **Context tab** that stores a JSON-based
memory of people and conversations.

Context may include: - Relationship type (personal / professional /
business) - Tone preferences - Prior interactions - Notes discovered
during conversations

### How it works

Before each task: - Context JSON is injected into the agent prompt

After each task: - The agent navigates back to Instant - Updates and
refines the context - Saves it for future executions

This enables: - Casual replies for friends - Professional tone for
recruiters - Consistent messaging for businesses and customer support

All context is **user-visible and editable**.

------------------------------------------------------------------------

## Automation Flow

1.  User selects the target app (Instagram / WhatsApp / LinkedIn)
2.  Instant builds a task prompt using:
    -   Selected app workflow
    -   Stored context JSON
3.  Prompt is sent to the **Mobilerun API**
4.  A mobile agent:
    -   Opens the target app
    -   Locates unread conversations
    -   Reads text and media
    -   Analyzes sentiment and comments
    -   Sends appropriate replies
5.  Agent returns to Instant and:
    -   Updates context
    -   Writes a detailed summary
    -   Terminates execution

Tasks can be cancelled at any time using the **Terminate** button.

------------------------------------------------------------------------

## Screens Overview

### Home

-   App selector (Instagram / WhatsApp / LinkedIn)
-   Launch and terminate controls
-   Live task status and task ID
-   Persistent summary output

### Logs

-   Session-level execution history
-   Timestamps, app type, termination reason
-   Clear logs option

### Context

-   Editable JSON context store
-   Save, format, and clear actions
-   Logout (clears API key and device ID)

------------------------------------------------------------------------

## Tech Stack

-   React Native
-   Expo
-   React Navigation (Bottom Tabs)
-   Expo Vector Icons (Ionicons)
-   AsyncStorage
-   Mobilerun REST API
-   DroidRun (Android UI automation engine)
-   EAS Build (APK generation)

------------------------------------------------------------------------

## Project Structure (Relevant)

    app/
     └─ (tabs)/
        ├─ instant.tsx   # Main automation logic
        ├─ logs.tsx      # Execution logs
        └─ context.tsx   # Context management

------------------------------------------------------------------------

## Setup Requirements

Before running the app, ensure you have:

-   Node.js (18+ recommended)
-   Expo CLI
-   EAS CLI
-   An Expo account
-   An Android device registered on Mobilerun
-   A valid Mobilerun API key and Device ID

------------------------------------------------------------------------

## Installation

Clone the repository and install dependencies:

``` bash
npm install
```

or

``` bash
yarn install
```

------------------------------------------------------------------------

## Running Locally (Development)

Start the Expo development server:

``` bash
npx expo start
```

Then: - Run on a physical Android device using Expo Go **or** - Run on
an Android emulator

> Note: Real automation requires a **Mobilerun-registered Android
> device**.

------------------------------------------------------------------------

## First-Time App Setup

On first launch, the app shows a **Setup screen**.

You must enter: - Mobilerun API Key - Mobilerun Device ID

These credentials are stored locally using AsyncStorage. The setup
screen will not appear again unless credentials are cleared.

------------------------------------------------------------------------

## Persistent Storage Keys

Instant uses the following AsyncStorage keys:

-   `instant_summary` -- Live summaries and logs
-   `instant_logs` -- Historical execution logs
-   `context_json` -- Persistent conversation context
-   `mobilerun_api_key` -- API key
-   `mobilerun_device_id` -- Device ID

------------------------------------------------------------------------

## Building a Standalone APK (EAS)

Install EAS CLI:

``` bash
npm install -g eas-cli
eas login
```

Prebuild native code:

``` bash
npx expo prebuild
```

Configure `eas.json`:

``` json
{
  "build": {
    "apk": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Build APK:

``` bash
eas build -p android --profile apk
```

Download and install the APK on your Android device.

------------------------------------------------------------------------

## Challenges Faced

-   **Limited and evolving Mobilerun documentation**, requiring
    experimentation
-   Adapting agent workflows to a **purely mobile-driven experience**
-   Handling UI changes across third-party apps
-   Ensuring safe and transparent context updates

------------------------------------------------------------------------

## Security Notes

-   All data is stored locally on the device
-   No background execution without user action
-   Credentials can be wiped instantly via logout
-   Do not commit real API keys to version control

------------------------------------------------------------------------

## Intended Use Cases

-   Personal inbox cleanup
-   Professional messaging and recruiter communication
-   Social media engagement
-   Business and customer support automation

------------------------------------------------------------------------

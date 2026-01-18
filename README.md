# Instant

Instant is a React Native mobile application built using Expo and configured for EAS.
The app integrates with the Mobilerun API to automate Instagram actions on a connected Android device and display a structured execution summary directly inside the app.

The core idea is simple:
- Launch an automation task on a real device
- Let Mobilerun handle Instagram interactions
- Collect a human-readable summary back inside Instant

---

## Features

- Expo-based React Native project
- Configured for EAS Build and deployment
- Persistent local storage using AsyncStorage
- One-time setup for Mobilerun credentials
- Launch and terminate remote automation tasks
- Live task status and task ID visibility
- Automatic logging of API responses and errors
- Persistent summary output across app restarts

---

## Tech Stack

- React Native
- Expo
- Expo Router
- EAS Build
- AsyncStorage
- Mobilerun REST API
- Expo Vector Icons (Ionicons)

---

## Project Structure (Relevant)

```
app/
 └─ (tabs)/
    └─ instant.tsx        # Main screen logic
```

---

## Setup Requirements

Before running the app, ensure you have:

- Node.js (18+ recommended)
- Expo CLI
- An Expo account
- An Android device registered on Mobilerun
- A valid Mobilerun API key

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

---

## Running the App Locally

Start the Expo development server:

```bash
npx expo start
```

Run on a physical Android device or emulator.

---

## First-Time App Setup

When the app is launched for the first time, you will see the Setup screen.

You must enter:
- Mobilerun API Key
- Mobilerun Device ID

These values are stored locally using AsyncStorage and are required to communicate with the Mobilerun API.

Once saved, the setup screen will not appear again unless local storage is cleared.

---

## Main Screen Behavior

The main screen provides:

- Task status indicator (idle, running, terminating, error)
- Active task ID when a task is running
- Launch button to start automation
- Terminate button to cancel a running task
- A multiline text area where summaries and logs appear

The text area is persistent and retains content even after the app restarts.

---

## Automation Logic Overview

When Launch is pressed:

1. A detailed automation prompt is sent to the Mobilerun API
2. The automation performs the following actions on Instagram:
   - Opens Instagram
   - Navigates to unread chats
   - Processes unread messages and reels
   - Generates natural replies
   - Replies to each item
3. After completion:
   - Instagram is closed
   - Instant app is reopened
   - A summary is written into the text area

The summary includes:
- Number of chats processed
- Number of messages replied to
- Number of reels replied to
- Any urgent or special messages
- Overall execution summary

---

## Task Control

- Launch button:
  - Creates and starts a new Mobilerun task
- Terminate button:
  - Cancels the currently running task using the task ID

All API responses and errors are logged into the summary area for transparency and debugging.

---

## Persistent Storage Keys

The app uses the following AsyncStorage keys:

- `instant_summary`  
  Stores the summary and logs displayed in the text area

- `mobilerun_api_key`  
  Stores the Mobilerun API key

- `mobilerun_device_id`  
  Stores the Mobilerun device ID

---

## Environment Notes

- This app is intended to run with real Android devices registered on Mobilerun
- Instagram UI changes may require prompt updates
- Network connectivity is required during task execution

---

## EAS Build

This project is compatible with EAS.

To build:

```bash
npx expo prebuild
npx expo run:android
```

Or use EAS cloud builds:

```bash
npx expo install expo-updates
npx expo install expo-dev-client
npx expo install expo-build-properties
npx expo install expo-application
```

Then:

```bash
npx expo prebuild
npx expo start
```

---

## Security Notes

- API keys are stored locally on the device
- Do not commit real API keys to version control
- Use environment variables or secure storage in production if needed

---

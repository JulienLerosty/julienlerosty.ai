---
id: petit-francais
title: Le Petit Francais — SwiftUI Language Learning
hook: Off-the-shelf language apps optimize for streaks. I wanted something that optimized for fluency.
domains: [ios, swiftui, language]
---

# Le Petit Francais — SwiftUI Language Learning

## Hook
Every major language learning app is a retention product that teaches French on the side. Streaks, coins, and leaderboards are engagement mechanics — not fluency mechanics. I built my own app because I wanted to control the learning model, not the notification cadence.

## Problem
Commercial apps serialize learning: word → translation → repetition. Real fluency requires vocabulary in context, speech production under time pressure, and a review schedule that adapts to what you actually remember. None of that fits neatly into a four-minute daily streak.

## Architecture (shape)
- A **Spaced Repetition Engine** (Leitner-box model, 5 boxes, intervals: 0/1/3/7/14 days) that drives every review session — words move up on correct recall, drop back on miss
- A **World/Activity graph** — vocabulary organized into thematic worlds, each unlocking a set of activity types: flashcards, fill-in-the-blank, memory match, speech exercises, scripted dialogues, interactive choices
- **GameState** as the single source of truth for progression, XP, streaks, and star ratings — persisted via `UserDefaults`, upgraded with a v2 migration guard
- A **ClaudeService** layer for AI-generated conversational practice, backed by a speech recognizer + synthesizer pair so the app can listen and respond
- A **NavigationCoordinator** that decouples navigation intent from view hierarchy — prevents deep-link spaghetti as the activity count grew
- A **ParentalDashboard** with session timers and activity breakdowns — built early because the target user is a child and a parent's trust matters as much as the child's engagement
- **BedtimeMode** — locks the app after a configurable cutoff time, which is the feature I'm most proud of adding before it was requested

## Outcomes
- Ships on iOS 17+ with SwiftUI and Swift's `@Observable` macro throughout
- Onboarding flow with adaptive layout handles both iPhone and iPad
- Achievement system with a sticker book — because intrinsic rewards matter more than virtual coins when the user is six years old

## Lessons
1. **The SRS engine is the product.** The vocabulary content matters, but the review scheduling algorithm is what determines whether a word sticks. Build that first.
2. **Ship BedtimeMode before parents ask for it.** Parental trust is load-bearing. Features that protect children's attention earn more goodwill than features that demand it.
3. **`@Observable` + environment injection beats `ObservableObject` + `@EnvironmentObject` for large state graphs.** Fewer `objectWillChange` publishers, cleaner diffs, less mystery re-rendering.

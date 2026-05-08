---
id: motionlab
title: Motion Lab — Live Sensor Diagnostics on iOS
hook: A wireless engineer's pocket diagnostic for the sensors most people never see.
domains: [ios, sensors, validation]
---

# Motion Lab — Live Sensor Diagnostics on iOS

## Hook
Wireless validation work generates a lot of data: antenna patterns, propagation measurements, RF performance sweeps. What it doesn't generate automatically is the device's physical context during those measurements — orientation, movement, altitude. Motion Lab fixes that. It's a pocket instrument that reads every motion sensor CoreMotion exposes and streams them live.

## Problem
During validation runs, correlating RF measurements with device pose requires either a second operator, a custom fixture, or a lot of post-hoc reconstruction from logs. None of those options are good in a lab with limited rack space and a moving test subject. What you actually want is a live instrument running on the device under test that shows you attitude, step cadence, altitude delta, and head-tracking state all at once — so you can cross-reference by eye in real time.

## Architecture (shape)
- Four independent `ObservableObject` managers, each owning one CoreMotion subsystem:
  - **DeviceMotionManager** — `CMMotionManager` / `CMDeviceMotion`: roll, pitch, yaw, user acceleration (gravity-subtracted, Gs), and a 300-sample rolling buffer (~30s at 10Hz) fed into a Swift Charts accelerometer-magnitude graph
  - **PedometerManager** — `CMPedometer`: live step count, distance, cadence, and pace
  - **AltimeterManager** — `CMAltimeter`: relative altitude and barometric pressure
  - **HeadphoneMotionService** — `CMHeadphoneMotionManager`: attitude and gravity from head-tracking-capable headphones, with delegate-driven connection state
- A `TabView` splits iPhone sensors (four panels) from headphone tracking — the tab boundary reflects the physical boundary between two distinct sensor planes
- Every manager has explicit `start()` / `stop()` methods; views drive lifecycle via `.onAppear` / `.onDisappear` to avoid phantom sensor activity when the tab is backgrounded
- Targets iOS 17.0+, Swift 5, portrait-only — the constraint is intentional, lab use means one hand on equipment

## Outcomes
- Ships as a single-target iOS app with no third-party dependencies — everything is CoreMotion, SwiftUI, and Swift Charts
- The rolling acceleration chart is the most useful panel in practice: a flat line means the device is stationary, a spike means someone bumped the table, which correlates directly with RF measurement noise
- Head-tracking tab works only with H1/H2 headphones; the status card reports connection state explicitly rather than silently showing zeros

## Lessons
1. **Four independent managers beat one monolithic motion class.** Each subsystem fails independently — pedometer unavailability (no motion coprocessor) doesn't take down the altimeter.
2. **The 300-sample rolling buffer was the right call, but the right size took three iterations.** Too short and the chart is noise; too long and old data misleads. 30s at 10Hz matches the typical pause-and-resume cadence of a lab measurement.
3. **Validation tooling is ugly on purpose.** This app has no onboarding screen, no animations, and no color theme. That's a feature. Every second spent on aesthetics is a second not spent on sensor fidelity.

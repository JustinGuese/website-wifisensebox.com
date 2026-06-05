---
title: True Presence
category: smart-home
rank: 1
heroTitle: Lights That Never Leave You In The Dark
heroSubtitle: PIR sensors miss you when you're still. WifiSenseBox detects your breathing — so the lights stay on while you read.
heroBullets:
  - No more clapping or waving to keep lights on
  - One sensor covers the whole apartment through walls
  - Works with Home Assistant, Hubitat, HomeKit (via bridge)
heroStats:
  - value: 99.9%
    label: Stillness accuracy
  - value: <1s
    label: Reaction time
  - value: '1'
    label: Sensor per home
demoConfig:
  headerLabel: Live Home Feed
  metricLabel: Presence Signal (CSI)
  metricUnit: BPM
  metricBase: 14
  metricMin: 10
  metricMax: 22
  metricFooter: Detecting your breathing pattern through interior walls.
  statusLabel: Lights State
  statusOn: ON — Someone home
  statusOff: OFF — Empty
  secondaryLabel: Activity (last 8s)
  privacyText: Your home knows you're there. It doesn't need to see you to know it.
  ctaText: Bring true presence home
painPoint: PIR occupancy sensors miss people who sit still, plunging readers, sleepers, and bathers into darkness — and they can't cover a whole home from a single spot.
solution: WifiSenseBox provides an affordable, standalone, and 100% GDPR-compliant way to monitor your space.
features:
  - icon: shield
    title: 100% GDPR-compliant
    body: Replaces invasive cameras with privacy-first sensing technology.
  - icon: zap
    title: Standalone & Affordable
    body: No extra hubs or expensive hardware needed—just one WifiSenseBox.
  - icon: check
    title: Zero-Motion Detection
    body: Maintains 'occupied' status even when you are perfectly still or sleeping.
targetBuyer: Smart Home Enthusiasts
faq:
  - q: How does WifiSenseBox detect me if I'm not moving?
    a: It uses high-frequency radar signals to detect the rhythmic micro-movements of your chest as you breathe.
  - q: Can it see through walls?
    a: Yes, WiFi and radar signals naturally penetrate drywall, allowing one sensor to cover multiple zones.
  - q: Is it difficult to install?
    a: Not at all. It's a plug-and-play appliance that calibrates to your room in minutes.
ctaText: Join the waitlist
locale: en
---


## The Magic of a Home That Truly Understands You

## The Standalone, GDPR-Safe Advantage
Unlike traditional security or monitoring systems that rely on invasive camera networks or complex motion detector arrays, WifiSenseBox offers a revolutionary standalone approach. It provides high-fidelity occupancy and movement data without ever capturing images or identifying individuals, ensuring 100% GDPR compliance from day one. Best of all, WifiSenseBox is a cost-effective, all-in-one device—no expensive hubs, NVRs, or additional hardware are required to get started.

Imagine walking into your living room at dusk. Without a word spoken, without a button pressed, the lights transition into a warm, amber glow. You sit down on the sofa to lose yourself in a book. Thirty minutes pass. You haven’t moved much, just the occasional turn of a page. In a traditional smart home, this is where the "smart" falls apart. The motion sensor on the wall—a technology essentially unchanged since the 1970s—decides the room is empty. Suddenly, you’re plunged into darkness. You’re forced to perform the "sensor dance," waving your arms like a stranded sailor trying to catch the eye of a passing ship just to get your lights back on.

This isn't just a minor annoyance; it’s a failure of the promise of home automation. A smart home should serve you, not demand your attention. This is where **True Presence** by WifiSenseBox changes everything.

## The Problem: The "Dumb" Reality of Traditional Motion Sensors

Most "smart" homes today rely on Passive Infrared (PIR) sensors. These devices work by detecting changes in heat signatures across their field of view. They are excellent for catching a burglar walking across a yard, but they are fundamentally flawed for indoor living. 

### Why PIR Fails You:
*   **The "Stillness" Trap:** If you aren't moving your large muscle groups, you are invisible to a PIR sensor. This makes them useless for offices, bedrooms, and lounges.
*   **Line-of-Sight Limitations:** PIR sensors cannot see through a shower curtain, a glass door, or around a piece of furniture.
*   **False Negatives:** They often turn off while you are still in the room, leading to "zombie" homes where lights flicker on and off unpredictably.
*   **Delayed Activation:** Many battery-powered sensors take seconds to "wake up" and report motion, leaving you in the dark for those first critical steps into a room.

We’ve accepted these flaws as the status quo, but at WifiSenseBox, we believe your home should be smarter than a 50-year-old security light.

## The Solution: Invisible, Radar-Based Sensing

WifiSenseBox replaces the "dumb" PIR sensor with a sophisticated WiFi-sensing and radar appliance. Instead of looking for heat, it emits low-power radio frequency signals that fill the room like an invisible mist. These signals bounce off objects and people, returning to the WifiSenseBox with a wealth of data about the environment.

When you enter a room, WifiSenseBox doesn't just see "motion." It sees a human-sized entity. When you sit down and stay still, it doesn't lose track of you. It shifts its focus to **micro-movements**. It detects the rhythmic rise and fall of your chest as you breathe. It detects the tiny shifts in your posture. As long as you are alive and in the room, WifiSenseBox knows you are there.

### The WifiSenseBox Advantage:
1.  **True Occupancy:** Lights stay on as long as you are in the room, whether you are sleeping, reading, or meditating.
2.  **Through-Wall Sensing:** A single WifiSenseBox can detect presence in an adjacent room or through a closed door, allowing for more discreet placement.
3.  **Environmental Awareness:** Unlike cameras, WifiSenseBox doesn't care about lighting conditions. It works in pitch black, bright sunlight, or even through steam in a bathroom.

## Benefits: Comfort, Peace of Mind, and Magic-Like Automation

The implementation of True Presence transforms your relationship with your living space. It moves the smart home from "command-based" (where you tell the home what to do) to "context-based" (where the home knows what to do).

### Seamless Comfort
You never have to think about light switches again. Your home follows your rhythm. The kitchen lights stay on while you’re meticulously chopping vegetables; the office lights stay on while you’re focused on a deep-work session. It’s the ultimate luxury: a home that anticipates your needs.

### Unprecedented Energy Efficiency
True Presence isn't just about keeping lights on; it's about turning them off the moment they aren't needed. Because WifiSenseBox is so accurate, you can set much shorter "timeout" periods. Instead of waiting 15 minutes to ensure no one is there, you can turn off the HVAC and lights within 30 seconds of the room truly being empty. This adds up to significant savings on your utility bills and a smaller carbon footprint.

### Total Privacy by Design
In an era where every device seems to have a camera or a microphone, WifiSenseBox stands apart. We use radio waves, not images. There is no way for a WifiSenseBox to "see" what you look like, what you’re wearing, or what you’re doing. It only knows that a person is present. All processing happens locally on the device, ensuring your data never leaves your four walls.

## Technical Deep Dive: How We Detect a Heartbeat Through a Wall

The technology behind WifiSenseBox is a fusion of advanced Signal Processing and Machine Learning. We utilize a technique called **FMCW (Frequency Modulated Continuous Wave) Radar** combined with **CSI (Channel State Information)** from WiFi signals.

### 1. The Micro-Doppler Effect
When a radio wave hits a moving object, its frequency changes. This is the Doppler Effect. While a walking person creates a large frequency shift, a breathing person creates a tiny, rhythmic "micro-Doppler" shift. Our custom AI models are trained to isolate these tiny patterns from the "noise" of spinning fans or fluttering curtains.

### 2. Spatial Mapping
WifiSenseBox creates a dynamic "map" of the RF environment. By analyzing how signals reflect off the walls and ceiling, it can determine your exact coordinates in a room. This allows you to set "Smart Zones"—for example, you can tell the WifiSenseBox to dim the lights only when you are in the "Couch Zone," but keep them bright if you are at the "Desk Zone."

### 3. Penetrating Materials
WiFi signals (2.4GHz and 5GHz) and our specific radar frequencies are optimized to pass through common building materials like drywall, wood, and plastic. This allows the WifiSenseBox to be hidden inside a cabinet or behind a television while still maintaining a perfect "view" of the entire floor.

## Why "True Presence" is the Foundation of the Future

The "Smart Home" has long been a collection of disparate gadgets. True Presence is the glue that binds them together. Without reliable occupancy data, your smart thermostat is just a guesser, and your smart lights are just remote-controlled bulbs. 

With WifiSenseBox, your home finally gains the "sense of touch." It feels your presence, understands your location, and respects your privacy. It is the first step toward a home that doesn't just house you, but truly understands you.

## Join the Revolution of Invisible Sensing

We are currently in the final stages of refining the WifiSenseBox hardware. We aren't just building a sensor; we're building the nervous system for the modern home. 

**Are you ready to stop waving your arms and start living in the future?**

[Join our exclusive waitlist today](#) to be the first to experience True Presence. Early supporters will receive priority access to our first production run and a special "Founders Edition" discount.

*The future of the smart home is here. And it’s invisible.*

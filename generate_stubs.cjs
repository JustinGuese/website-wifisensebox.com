const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'senior-care', title: 'Senior Care', rank: 1, tagline: 'Non-intrusive safety and peace of mind.', description: 'Advanced WiFi sensing for fall detection and sleep monitoring without cameras.' },
  { slug: 'smart-office', title: 'Smart Office', rank: 2, tagline: 'Optimize your workspace.', description: 'Data-driven occupancy and HVAC control for modern offices.' },
  { slug: 'smart-home', title: 'Smart Home', rank: 3, tagline: 'True presence detection.', description: 'Eliminate dead zones and control your home seamlessly.' },
  { slug: 'retail', title: 'Retail & Hospitality', rank: 4, tagline: 'Understand your spaces.', description: 'GDPR-compliant analytics and automation for commercial spaces.' },
  { slug: 'industrial', title: 'Industrial Safety', rank: 5, tagline: 'Protect your workforce.', description: 'Robust sensing for demanding environments and heavy machinery zones.' }
];

const usecases = [
  { slug: 'fall-detection', category: 'senior-care', rank: 1, title: 'Fall Detection', heroTitle: 'Instant Fall Detection, Zero Wearables', heroSubtitle: 'Get alerted the moment a fall happens, even through bathroom walls.', painPoint: 'Falls are a leading cause of injury for seniors, but wearables are often forgotten or taken off.', solution: 'WifiSenseBox monitors the space continuously and detects falls immediately without relying on the user.', targetBuyer: 'Adult children of aging parents' },
  { slug: 'sleep-apnea-vitals', category: 'senior-care', rank: 2, title: 'Sleep Vitals', heroTitle: 'Overnight Breathing & HR Monitoring', heroSubtitle: 'Track vital signs continuously without any contact.', painPoint: 'Traditional sleep tracking requires uncomfortable equipment that disrupts rest.', solution: 'WifiSenseBox uses micro-doppler radar to track chest movements and heart rate with medical-grade accuracy.', targetBuyer: 'Care facilities and health-conscious individuals' },
  { slug: 'gait-frailty', category: 'senior-care', rank: 3, title: 'Gait & Frailty', heroTitle: 'Early Warning for Mobility Decline', heroSubtitle: 'Detect changes in walking patterns before falls occur.', painPoint: 'Gradual decline in mobility is hard to notice until a serious incident happens.', solution: 'WifiSenseBox analyzes gait speed and stability over time, providing early warnings to caregivers.', targetBuyer: 'Assisted living facilities' },
  
  { slug: 'hvac-occupancy', category: 'smart-office', rank: 1, title: 'HVAC Optimization', heroTitle: 'Stop Heating Empty Rooms', heroSubtitle: 'Slash utility bills by 15-30% with true occupancy detection.', painPoint: 'PIR sensors turn off lights when people sit still, and HVAC runs on fixed schedules regardless of actual occupancy.', solution: 'WifiSenseBox detects breathing, so lights and HVAC stay on as long as someone is in the room, and turn off immediately when they leave.', targetBuyer: 'Facility Managers' },
  { slug: 'meeting-room-reclaim', category: 'smart-office', rank: 2, title: 'Meeting Room Reclaim', heroTitle: 'Never Double-Book Again', heroSubtitle: 'Automatically free up ghost meetings.', painPoint: 'Rooms show as booked but are actually empty, causing frustration and wasted space.', solution: 'WifiSenseBox instantly detects if a room is actually occupied and updates the calendar system.', targetBuyer: 'IT & Workplace Experience' },
  { slug: 'space-utilization', category: 'smart-office', rank: 3, title: 'Space Utilization', heroTitle: 'Data-Driven Office Design', heroSubtitle: 'Understand exactly how your space is used.', painPoint: 'Companies pay for real estate without knowing which areas are actually utilized by employees.', solution: 'WifiSenseBox provides anonymous, highly accurate heatmaps and usage data over time.', targetBuyer: 'Real Estate Directors' },
  
  { slug: 'true-presence', category: 'smart-home', rank: 1, title: 'True Presence', heroTitle: 'Lights That Never Leave You In The Dark', heroSubtitle: 'Say goodbye to waving your arms to turn the lights back on.', painPoint: 'Standard motion sensors fail when you sit still to read or watch TV.', solution: 'WifiSenseBox detects the micro-movements of breathing, keeping your smart home responsive.', targetBuyer: 'Smart Home Enthusiasts' },
  { slug: 'camera-free-security', category: 'smart-home', rank: 2, title: 'Camera-Free Security', heroTitle: 'Protect Your Home, Keep Your Privacy', heroSubtitle: 'Intruder detection that works through walls.', painPoint: 'People want security but feel uncomfortable putting cameras in private spaces like bedrooms.', solution: 'WifiSenseBox detects human presence reliably without capturing any visual data.', targetBuyer: 'Privacy-conscious homeowners' },
  { slug: 'gesture-control', category: 'smart-home', rank: 3, title: 'Gesture Control', heroTitle: 'Control Your Home With A Wave', heroSubtitle: 'Intuitive smart home interactions.', painPoint: 'Voice assistants can be disruptive, and apps are too slow for simple tasks.', solution: 'WifiSenseBox translates simple hand gestures into smart home commands.', targetBuyer: 'Early tech adopters' },
  
  { slug: 'dwell-heatmap', category: 'retail', rank: 1, title: 'Dwell & Heatmaps', heroTitle: 'Understand Customer Behavior', heroSubtitle: 'GDPR-compliant analytics for retail spaces.', painPoint: 'Camera-based analytics raise privacy concerns and require complex compliance management.', solution: 'WifiSenseBox provides accurate dwell times and heatmaps entirely anonymously.', targetBuyer: 'Retail Operations Managers' },
  { slug: 'table-turnover', category: 'retail', rank: 2, title: 'Table Turnover', heroTitle: 'Optimize Restaurant Seating', heroSubtitle: 'Know exactly when a table is free.', painPoint: 'Hosts struggle to track table status in large or multi-room restaurants, leading to longer wait times.', solution: 'WifiSenseBox silently monitors table occupancy and alerts the host stand instantly.', targetBuyer: 'Restaurant Managers' },
  { slug: 'hotel-energy', category: 'retail', rank: 3, title: 'Hotel Energy Saving', heroTitle: 'Defeat the Card-in-Slot Trick', heroSubtitle: 'True room occupancy for hotels.', painPoint: 'Guests leave AC on by tricking the keycard slot, costing hotels thousands in energy.', solution: 'WifiSenseBox knows if the room is actually empty and adjusts the climate control automatically.', targetBuyer: 'Hotel Operators' },
  
  { slug: 'cobot-safety-zone', category: 'industrial', rank: 1, title: 'Cobot Safety Zones', heroTitle: 'Safe Human-Robot Collaboration', heroSubtitle: 'Dynamic safety zones that adapt in real-time.', painPoint: 'Physical cages slow down production, and laser scanners struggle in dusty environments.', solution: 'WifiSenseBox creates reliable, invisible safety perimeters that immune to dust and lighting.', targetBuyer: 'Automation Engineers' },
  { slug: 'amr-blind-corner', category: 'industrial', rank: 2, title: 'AMR Collision Avoidance', heroTitle: 'See Around Corners', heroSubtitle: 'Prevent accidents in busy warehouses.', painPoint: 'Forklifts and AMRs collide at blind intersections where sensors cannot see.', solution: 'WifiSenseBox detects presence through walls and racks, warning vehicles before they turn.', targetBuyer: 'Warehouse Managers' },
  { slug: 'confined-space-count', category: 'industrial', rank: 3, title: 'Confined Space Monitoring', heroTitle: 'Automated Safety Compliance', heroSubtitle: 'Know exactly who is in danger zones.', painPoint: 'Manual counting for confined space entry is error-prone and dangerous.', solution: 'WifiSenseBox accurately tracks the number of people in a space without relying on badges.', targetBuyer: 'Health & Safety Officers' }
];

fs.mkdirSync(path.join(__dirname, 'src/content/categories'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'src/content/usecases'), { recursive: true });

categories.forEach(c => {
  const content = `---
title: "${c.title}"
rank: ${c.rank}
tagline: "${c.tagline}"
description: "${c.description}"
locale: "en"
---
Overview of ${c.title}.
`;
  fs.writeFileSync(path.join(__dirname, `src/content/categories/${c.slug}.md`), content);
});

usecases.forEach(u => {
  const content = `---
title: "${u.title}"
category: "${u.category}"
rank: ${u.rank}
heroTitle: "${u.heroTitle}"
heroSubtitle: "${u.heroSubtitle}"
painPoint: "${u.painPoint}"
solution: "${u.solution}"
features:
  - icon: "check"
    title: "Feature 1"
    body: "Lorem ipsum dolor sit amet."
  - icon: "zap"
    title: "Feature 2"
    body: "Lorem ipsum dolor sit amet."
  - icon: "shield"
    title: "Feature 3"
    body: "Lorem ipsum dolor sit amet."
targetBuyer: "${u.targetBuyer}"
faq:
  - q: "How does it work?"
    a: "It uses WiFi sensing technology."
  - q: "Is it secure?"
    a: "Yes, 100% privacy-first and GDPR compliant."
ctaText: "Join the waitlist"
locale: "en"
---
${u.title} is a key use case for our sensing technology, addressing the core needs of ${u.targetBuyer}.
`;
  fs.writeFileSync(path.join(__dirname, `src/content/usecases/${u.slug}.md`), content);
});

console.log('Markdown stubs generated successfully.');

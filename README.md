# 🛠️ Rao Electronics: Service Center Dashboard

A professional, high-performance Progressive Web App (PWA) built with **Next.js 16** to manage electronic repair workflows. Optimized for mobile touch, it features a high-contrast "Clean Card" design and real-time priority management.

## ✨ Features

### 🚀 Smart Priority Engine
- **Call-Based Bumping:** Repairs with the most customer follow-ups automatically jump to the top of the queue.
- **Dynamic Sorting:** Secondary sorting by promised delivery dates ensures deadlines are never missed.

### 📱 Professional Mobile UI
- **Stark White Cards:** Every repair is isolated in a self-contained white box on a deep black background for maximum readability.
- **Zero-Overlap Layout:** A strictly vertical, mechanical design ensures no elements ever touch or cover each other.
- **Finger-Friendly Controls:** Massive full-width buttons designed for fast, one-handed shop operations.

### 🔴 Visual Status Indicators
- **Persistent Border Logic:** Every card features a thick 10px border—Blue for normal repairs and **Solid Red** for overdue items.
- **Pulsing Overdue Alerts:** Late items display a bold `⚠️ LATE / OVERDUE` warning to drive immediate action.

### 💬 Integrated Notifications
- **WhatsApp Automation:** The "Complete Repair" button prompts for the final bill amount and generates a professionally formatted pickup message.
- **Auto-Cleaning Phone Numbers:** Strips non-digit characters to ensure 100% compatibility with the WhatsApp API.

---

## 📸 App Preview

<!-- You can replace these with your actual screenshots once uploaded to your repo -->
| Mobile Dashboard | Overdue Alert | New Entry Form |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/200x400?text=Dashboard) | ![Overdue Placeholder](https://via.placeholder.com/200x400?text=Overdue+Alert) | ![Form Placeholder](https://via.placeholder.com/200x400?text=New+Repair+Form) |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Persistence:** Browser `LocalStorage` (Data stays safe on your device without a server)
- **Deployment:** Optimized for Vercel

---

## 🚀 Getting Started

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/meerao123/rao-electronics
   cd repair-shop-pwa
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev -- -p 3005
   ```
   *Dashboard available at `http://localhost:3005`*

---

## 🏗️ Operational Logic

### Sorting Hierarchy
1. **Call Count:** Items with more customer calls are moved to the top.
2. **Promised Date:** For items with equal calls, the one with the earlier deadline comes first.
3. **No Date:** Unscheduled items are placed at the bottom within their call-count group.

### Data Security
This app is designed for local-first reliability.
- **Storage:** Data is stored in the browser's `LocalStorage`.
- **Note:** Data entered on one device (e.g., a laptop) will not automatically appear on another (e.g., a phone). For shop use, it is recommended to use one dedicated management device.

---

## ⚖️ License
This project is licensed under the MIT License.

---
*Built specifically for Rao Electronics workforce management.*
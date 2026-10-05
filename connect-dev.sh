#!/bin/bash
# Run this once whenever you reconnect your phone or restart your Mac.
# It restores the ADB USB tunnel so the Flutter app can reach the local backend.

echo "🔌 Restoring ADB reverse tunnel..."
adb reverse tcp:5055 tcp:5055

echo "🩺 Checking backend health..."
HEALTH=$(curl -s http://localhost:5055/api/health 2>/dev/null)
if [ -z "$HEALTH" ]; then
  echo "❌ Backend is NOT running! Start it with: cd school-management-backend && npm run dev"
else
  echo "✅ Backend OK: $HEALTH"
fi

echo ""
echo "✅ Done! Press 'r' in your flutter terminal to hot reload."

#!/bin/bash

# Phaser Games App - SDK Build Script
# This script builds the Android APK/AAB for distribution

set -e

echo "🎮 Phaser Games App - SDK Build Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}[1/5]${NC} Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  Warning: Android SDK not found in environment"
    echo "   Set ANDROID_SDK_ROOT or ANDROID_HOME environment variable"
fi

if [ -z "$JAVA_HOME" ]; then
    echo "⚠️  Warning: Java not found in environment"
    echo "   Set JAVA_HOME environment variable"
fi

echo -e "${GREEN}✓${NC} Prerequisites checked"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}[2/5]${NC} Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 3: Build web assets
echo -e "${BLUE}[3/5]${NC} Building web assets..."
npm run build
echo -e "${GREEN}✓${NC} Web assets built"
echo ""

# Step 4: Sync to Android
echo -e "${BLUE}[4/5]${NC} Syncing to Android..."
npx cap sync android
echo -e "${GREEN}✓${NC} Synced to Android"
echo ""

# Step 5: Build APK
echo -e "${BLUE}[5/5]${NC} Building Android APK..."
cd android
./gradlew assembleDebug
cd ..
echo -e "${GREEN}✓${NC} APK built successfully"
echo ""

# Output location
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}✅ Build Complete!${NC}"
    echo ""
    echo "📦 APK Location:"
    echo "   $APK_PATH"
    echo ""
    echo "📱 To install on device:"
    echo "   adb install -r \"$APK_PATH\""
    echo ""
    echo "🎯 To build release APK:"
    echo "   cd android && ./gradlew assembleRelease && cd .."
else
    echo "⚠️  APK not found at expected location"
    echo "   Check Android SDK and JDK installation"
fi

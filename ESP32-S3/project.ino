#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// --- 1. CONFIGURATION ---
#define WIFI_SSID "tm"
#define WIFI_PASSWORD "tungmay3003"

#define API_KEY "AIzaSyCQOgkA23VX7zJyEWW8w55YTPPSjuQsE7U"
#define DATABASE_URL "https://mamatomyamembeded-default-rtdb.asia-southeast1.firebasedatabase.app"
#define USER_EMAIL "neennera@gmail.com"
#define USER_PASSWORD "MaMaTomYamEmbeded"

// Define Pins for UART connection to STM32
#define RXD2 18 // Connect to STM32 TX (PA9)
#define TXD2 17 // Connect to STM32 RX (PA10)

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;

// Variables to hold parsed data
int tempValue = 0;
int soilValue = 0;
int waterValue = 0;

void setup() {
  delay(3000);
  // Debug Serial (USB to Computer)
  Serial.begin(115200);
  
  // UART Serial (Connected to STM32)
  Serial1.begin(9600, SERIAL_8N1, RXD2, TXD2); // Adjust 9600 if STM32 uses a different baud rate
  
  Serial.println("Starting...My setup");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi Connected");

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  // Wait for token
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  signupOK = true;
  Serial.println("\nFirebase Ready!");
}

// Function to handle the Read-Check-Write logic for a single sensor
void updateSensorInDB(String sensorName, int newValue) {
  String basePath = "/" + sensorName;
  
  // 1. Read Min/Max first
  Serial.printf("Checking limits for %s...\n", sensorName.c_str());
  
  int minVal = 0; 
  int maxVal = 100; // Defaults
  
  // Get Min
  if (Firebase.RTDB.getInt(&fbdo, basePath + "/min")) {
    minVal = fbdo.intData();
  }
  // Get Max
  if (Firebase.RTDB.getInt(&fbdo, basePath + "/max")) {
    maxVal = fbdo.intData();
  }

  // 2. Check Logic (Just for logging/alerting locally)
  if (newValue < minVal) {
    Serial.printf("ALERT: %s value (%d) is BELOW min (%d)\n", sensorName.c_str(), newValue, minVal);
  } else if (newValue > maxVal) {
    Serial.printf("ALERT: %s value (%d) is ABOVE max (%d)\n", sensorName.c_str(), newValue, maxVal);
  } else {
    Serial.printf("OK: %s value (%d) is within range (%d - %d)\n", sensorName.c_str(), newValue, minVal, maxVal);
  }

  // 3. Update the Value
  if (Firebase.RTDB.setInt(&fbdo, basePath + "/value", newValue)) {
    Serial.printf("SUCCESS: Updated %s to %d\n", sensorName.c_str(), newValue);
  } else {
    Serial.printf("ERROR updating %s: %s\n", sensorName.c_str(), fbdo.errorReason().c_str());
  }
}

void loop() {
  // Check if data is available from STM32
  if (Serial1.available()) {
    // Read the incoming line (Expected: T931H0S47R47E)
    String data = Serial1.readStringUntil('E'); 
    data.trim(); // Remove whitespace

    // Simple parsing logic based on your format
    int tIndex = data.indexOf('T');
    int hIndex = data.indexOf('H');
    int sIndex = data.indexOf('S');
    int rIndex = data.indexOf('R');

    // Ensure all markers are present
    if (tIndex != -1 && hIndex != -1 && sIndex != -1 && rIndex != -1) {
      
      // Extract substrings and convert to integers
      String tStr = data.substring(tIndex + 1, hIndex);
      String sStr = data.substring(sIndex + 1, rIndex);
      String rStr = data.substring(rIndex + 1); // Reads until end of string (which was 'E')

      tempValue = tStr.toInt();
      soilValue = sStr.toInt();
      waterValue = rStr.toInt();

      Serial.println("\n--- New Data Received ---");
      Serial.printf("Temp: %d, Soil: %d, Water: %d\n", tempValue, soilValue, waterValue);

      if (Firebase.ready() && signupOK) {
        // Update Temperature
        updateSensorInDB("temperature", tempValue);
        
        // Update Soil Moisture
        updateSensorInDB("soil-moisture", soilValue);
        
        // Update Water Level (Mapped 'R' to water-level)
        updateSensorInDB("water-level", waterValue);
      }
    }
  }
}
import express from "express";
import admin from "./firebase.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

/**
 * POST /send-notification
 * body: anything from frontend
 */
app.post("/send-notification", async (req, res) => {
  try {
    const {
      fcmToken,
      title,
      body,
      android,
      ios,
      apns,
      ...restData
    } = payloadFromFrontend;
    
    const androidConfig = {
      priority: "high",
      notification: {
        channelId: android?.channelId || "default",
      },
    };
    
    const message = {
      token: fcmToken,
    
      notification: {
        title: title || "Test Notification",
        body: body || "Hello from Node.js",
      },
    
      data: {
        ...Object.fromEntries(
          Object.entries(restData).map(([k, v]) => [k, String(v)])
        ),
        notifee: JSON.stringify({
          android,
          ios,
        }),
      },
    
      android: androidConfig,
    
      apns: apns || {
        payload: { aps: { sound: "default" } },
      },
    };
    

    const response = await admin.messaging().send(message);

    res.json({
      success: true,
      message: "Notification with action payload sent",
      firebaseResponse: response,
      receivedPayload: payloadFromFrontend,
    });
  } catch (error) {
    console.error("FCM Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      receivedPayload: req.body,
    });
  }
});


app.get("/health", async (req, res) => {
    res.json({
      success: true,
      message: "API is working",
    });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

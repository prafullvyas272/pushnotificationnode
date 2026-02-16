import express from "express";
import admin from "./firebase.js";

const app = express();
app.use(express.json());

/**
 * POST /send-notification
 * body: anything from frontend
 */
app.post("/send-notification", async (req, res) => {
  try {
    const payloadFromFrontend = req.body;
    const { fcmToken, title, body } = payloadFromFrontend;

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: "fcmToken is required",
        receivedPayload: payloadFromFrontend,
      });
    }

    const message = {
      token: fcmToken,
      notification: {
        title: title || "Test Notification",
        body: body || "Hello from Node.js ",
      },
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);

    res.json({
      success: true,
      message: "Notification sent",
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

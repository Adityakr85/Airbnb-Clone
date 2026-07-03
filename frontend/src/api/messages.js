// src/api/messages.js

const BASE_URL = "http://localhost:8000/api";

export const fetchInbox = async (clerkId) => {
  if (!clerkId) throw new Error("Clerk ID is required");
  
  const response = await fetch(`${BASE_URL}/messages/inbox?clerk_id=${clerkId}`);
  if (!response.ok) throw new Error("Backend API failed");
  
  const result = await response.json();
  if (!result.success) throw new Error("API returned success: false");
  
  return result.data;
};

export const fetchThreadHistory = async (partnerId, clerkId) => {
  if (!clerkId || !partnerId) throw new Error("Clerk ID and Partner ID are required");
  
  const response = await fetch(`${BASE_URL}/messages/thread/${partnerId}?clerk_id=${clerkId}`);
  if (!response.ok) throw new Error("Backend API failed");
  
  const result = await response.json();
  if (!result.success) throw new Error("API returned success: false");
  
  return result.data;
};

export const sendMessage = async (payload) => {
  const response = await fetch(`${BASE_URL}/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const result = await response.json();
  if (!result.success) throw new Error("Failed to send message on server");
  
  return result;
};
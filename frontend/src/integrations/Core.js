// src/integrations/Core.js

export async function InvokeLLM(commentText) {
  try {
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: commentText }),
    });

    if (!response.ok) {
      throw new Error("Failed to classify comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("InvokeLLM Error:", error.message);
    throw error;
  }
}

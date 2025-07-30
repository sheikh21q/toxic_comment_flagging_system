// src/entities/Classification.js

// Schema for reference (not used directly in runtime but useful for validation/documentation)
export const ClassificationSchema = {
  name: "Classification",
  type: "object",
  properties: {
    comment: {
      type: "string",
      description: "The comment text that was classified"
    },
    result: {
      type: "string",
      enum: ["TOXIC", "NON-TOXIC"],
      description: "Classification result"
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "Confidence score of the classification"
    },
    processing_time: {
      type: "number",
      description: "Time taken to process in milliseconds"
    }
  },
  required: ["comment", "result", "confidence"]
};

// Actual Classification module with functions
export const Classification = {
  list: async () => {
    return JSON.parse(localStorage.getItem("classificationHistory")) || [];
  },

  add: async (item) => {
    const history = JSON.parse(localStorage.getItem("classificationHistory")) || [];
    history.unshift(item); // Add to top
    localStorage.setItem("classificationHistory", JSON.stringify(history));
  }
};

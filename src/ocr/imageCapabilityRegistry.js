export const imageCapabilities = {
  vision: true,
  ocr: true,
  objectDetection: true,
  documentReading: true,
  screenshotAnalysis: true,
  imageEditingWorkflow: true,
  providers: [
    "OpenAI Vision",
    "Google Vision",
    "Gemini Vision"
  ]
};

console.log(JSON.stringify(imageCapabilities, null, 2));

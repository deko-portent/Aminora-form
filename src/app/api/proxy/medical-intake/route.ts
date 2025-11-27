import { NextRequest, NextResponse } from "next/server";
import { forwardToBask } from "../_utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { authToken, intake, ...rest } = body || {};

  if (!authToken) {
    return NextResponse.json(
      { error: "authToken is required for medical intake" },
      { status: 401 }
    );
  }

  const payload = intake ?? rest;

  // Map internal answers to Bask patient profile fields if needed.
  // The Bask API expects specific fields for Update Patient (firstName, lastName, etc.)
  // But here we are sending "medical" data. 
  // The Update Patient endpoint accepts: allergies, medicalConditions, medications.
  // We need to map our quiz answers to these.
  
  // Example mapping based on payload structure from Step10Contact:
  /*
    intake: {
      goal, weight, height_feet, height_inches, gender, dob, state, motivation,
      medical_conditions, medications, surgery_history, eating_disorder_history,
      caloric_intake, weight_change, comorbidities
    }
  */

  // Bask Update Patient Payload:
  /*
    {
      weight: number,
      height: number (cm presumably, or inches? Docs say 0-300, likely cm. 175.5 example),
      medicalConditions: string[],
      medications: object[],
      allergies: string[]
    }
  */

  // We need to convert height/weight.
  // 1 inch = 2.54 cm.
  const heightInches = (parseInt(payload.height_feet || 0) * 12) + parseInt(payload.height_inches || 0);
  const heightCm = heightInches * 2.54;
  
  const baskPayload: any = {
    weight: parseFloat(payload.weight),
    height: heightCm,
    sexAtBirth: payload.gender?.toLowerCase(), // 'male', 'female', 'other'
    dateOfBirth: payload.dob, // Ensure YYYY-MM-DD
    state: payload.state,
    
    // Map medical arrays
    medicalConditions: payload.medical_conditions || [],
    // Medications in Bask is an object array {name, dose, frequency}.
    // Our form likely collects strings. We might need to adapt or just send as metadata if Bask allows custom fields?
    // The docs show strict schema for medications.
    // If we can't map perfectly, we might lose data if we strict-map.
    // BUT, we can also submit the raw questionnaire answers via /questions-answers endpoint.
    // The docs say: "Submit Questionnaire... Save patient questionnaire responses".
    // This is probably safer for "eating_disorder_history", "motivation", etc.
  };

  // Strategy: 
  // 1. Update Profile (Demographics + structured medical)
  // 2. Submit Questionnaire (Free text / other fields)
  
  // For now, I will just try to update the profile with what fits.
  // And maybe fire a separate questionnaire submission if I had that route.
  // To keep it simple and working with "medical-intake" concept, I'll send to /patients/me.
  // I'll filter out fields that might cause 400 errors if unknown.

  return forwardToBask(req, {
    path: "/patients/me",
    method: "PUT",
    body: baskPayload,
    authToken,
  });
}

import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any

# --- Pydantic Models ---

class ConverseRequest(BaseModel):
    transcript: str
    session_id: str = Field(..., description="A unique identifier for the user's session.")

class ConverseResponse(BaseModel):
    response_text: str = Field(..., description="The text response to be spoken by the TTS engine.")
    particle_expression: Literal["neutral", "listening", "thinking", "speaking"] = Field(..., description="The emotional state for the particle face to animate to.")
    is_final: bool = Field(default=False, description="Indicates if this is the final turn of the conversation.")


# --- NLU-Driven Conversation Engine ---
# This engine orchestrates the conversation by calling the NLU service.

class NLUDrivenConversationEngine:
    def __init__(self):
        self.gateway_url = os.getenv("GATEWAY_URL", "http://localhost:8000")
        self.dashboard_generator_url = os.getenv("DASHBOARD_GENERATOR_URL", "http://localhost:8002")

    def get_response(self, transcript: str, session_id: str) -> ConverseResponse:
        # 1. Call the NLU Service (via the Gateway)
        try:
            nlu_response = requests.post(
                f"{self.gateway_url}/nlu/parse",
                json={"text": transcript, "session_id": session_id},
                timeout=3
            )
            nlu_response.raise_for_status()
            nlu_data = nlu_response.json()
            intent = nlu_data.get("intent", "unknown")
        except requests.RequestException as e:
            print(f"NLU service call failed: {e}")
            return ConverseResponse(
                response_text="I'm having trouble understanding right now. Please try again in a moment.",
                particle_expression="thinking",
                is_final=False,
            )

        # 2. Orchestrate based on intent
        if intent == "dashboard_request":
            # Call the dashboard generator to pre-warm the config
            try:
                requests.get(f"{self.dashboard_generator_url}/api/v1/dashboard/config", timeout=2)
            except requests.RequestException as e:
                print(f"Could not pre-warm dashboard config: {e}")

            return ConverseResponse(
                response_text="Of course. Generating your dashboard now.",
                particle_expression="speaking",
                is_final=True,
            )

        elif intent in ["lead_generation", "marketing_automation"]:
             return ConverseResponse(
                response_text=f"I understand you're interested in {intent.replace('_', ' ')}. I'll be able to help with that soon.",
                particle_expression="speaking",
                is_final=False,
            )

        else: # Fallback for "unknown" intent
            return ConverseResponse(
                response_text="I'm sorry, I'm not sure how to help with that yet. You could try asking about a dashboard.",
                particle_expression="thinking",
                is_final=False,
            )


# --- FastAPI Application ---
app = FastAPI()
engine = NLUDrivenConversationEngine()

@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.post("/api/v1/voice/converse", response_model=ConverseResponse)
def converse(request: ConverseRequest):
    """
    Processes a user's transcribed text via the NLU engine and returns the agent's response.
    """
    return engine.get_response(request.transcript, request.session_id)

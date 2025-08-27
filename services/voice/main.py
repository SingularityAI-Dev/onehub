import re
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal, Optional

# --- Pydantic Models ---
# Defines the structure of the request and response bodies for type safety and validation.

class ConverseRequest(BaseModel):
    transcript: str
    current_state: Optional[str] = Field(default="GREETING", description="The current state of the conversation.")

class ConverseResponse(BaseModel):
    response_text: str = Field(..., description="The text response to be spoken by the TTS engine.")
    particle_expression: Literal["neutral", "listening", "thinking", "speaking"] = Field(..., description="The emotional state for the particle face to animate to.")
    next_state: str = Field(..., description="The new state of the conversation.")
    is_final: bool = Field(default=False, description="Indicates if this is the final turn of the conversation.")


# --- Scripted Conversation Engine ---
# A simple state machine to handle a predefined conversational flow.

class ScriptedConversationEngine:
    def __init__(self):
        # The conversation tree is defined here.
        self.conversation_tree = {
            "GREETING": {
                "response_text": "Welcome to OneHub. To get started, what is your primary focus right now: Marketing, Sales, or overall Business Health?",
                "particle_expression": "speaking",
                "transitions": {
                    r"marketing": "ELABORATION",
                    r"sales": "ELABORATION",
                    r"business health": "ELABORATION",
                },
            },
            "ELABORATION": {
                "response_text": "Great choice. I can help with that. What would you like to do first? For example, you could say 'Show me my main dashboard' or 'Find new leads'.",
                "particle_expression": "speaking",
                "transitions": {
                    r"dashboard": "ACTION",
                    r"leads": "ACTION",
                },
            },
            "ACTION": {
                "response_text": "Perfect. I'll get right on that.",
                "particle_expression": "speaking",
                "is_final": True,
                "transitions": {},
            },
            "FALLBACK": {
                "response_text": "I'm sorry, I didn't understand that. Could you please rephrase?",
                "particle_expression": "thinking",
                "transitions": {}, # Stays in the same state
            },
        }

    def get_response(self, transcript: str, current_state: str) -> ConverseResponse:
        state_node = self.conversation_tree.get(current_state, self.conversation_tree["GREETING"])

        # If the transcript is empty (e.g., initial call), return the greeting.
        if not transcript and current_state == "GREETING":
             return ConverseResponse(
                response_text=state_node["response_text"],
                particle_expression=state_node["particle_expression"],
                next_state=current_state,
            )

        # Match transcript against possible transitions
        for pattern, next_state_name in state_node.get("transitions", {}).items():
            if re.search(pattern, transcript, re.IGNORECASE):
                next_node = self.conversation_tree[next_state_name]
                return ConverseResponse(
                    response_text=next_node["response_text"],
                    particle_expression=next_node["particle_expression"],
                    next_state=next_state_name,
                    is_final=next_node.get("is_final", False),
                )

        # If no transition matches, return the fallback response
        fallback_node = self.conversation_tree["FALLBACK"]
        return ConverseResponse(
            response_text=fallback_node["response_text"],
            particle_expression=fallback_node["particle_expression"],
            next_state=current_state, # Stay in the current state on fallback
        )


# --- FastAPI Application ---
app = FastAPI()
engine = ScriptedConversationEngine()

@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.post("/api/v1/voice/converse", response_model=ConverseResponse)
def converse(request: ConverseRequest):
    """
    Processes a user's transcribed text and returns the agent's response.
    """
    return engine.get_response(request.transcript, request.current_state)

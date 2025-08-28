import re
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Any, Dict

# --- Pydantic Models ---

class NLURequest(BaseModel):
    text: str
    session_id: str = Field(..., description="A unique identifier for the user's session.")

class NLUResponse(BaseModel):
    intent: str = Field(..., description="The detected intent.")
    entities: List[Dict[str, Any]] = Field(..., description="A list of extracted entities.")
    confidence: float = Field(..., description="The confidence score of the intent prediction.")


# --- Mock NLU Engine ---
# This class simulates a real NLU model. In a production system, this would
# load trained models (e.g., from scikit-learn and spaCy) and perform inference.
# For now, it uses simple regex matching to simulate the output.

class MockNLUEngine:
    def parse(self, text: str) -> NLUResponse:
        text_lower = text.lower()

        # --- Intent: dashboard_request ---
        if re.search(r"dashboard|metrics|analytics|kpis", text_lower):
            entities = []
            if "marketing" in text_lower:
                entities.append({"entity": "dashboard_type", "value": "marketing"})
            elif "sales" in text_lower:
                entities.append({"entity": "dashboard_type", "value": "sales"})
            else:
                 entities.append({"entity": "dashboard_type", "value": "business_intelligence"})

            return NLUResponse(
                intent="dashboard_request",
                entities=entities,
                confidence=0.95
            )

        # --- Intent: lead_generation ---
        if re.search(r"leads|prospects|find people", text_lower):
            return NLUResponse(
                intent="lead_generation",
                entities=[],
                confidence=0.92
            )

        # --- Intent: marketing_automation ---
        if re.search(r"campaigns|marketing", text_lower):
            return NLUResponse(
                intent="marketing_automation",
                entities=[],
                confidence=0.88
            )

        # --- Fallback: Unkown Intent ---
        return NLUResponse(
            intent="unknown",
            entities=[],
            confidence=0.40
        )


# --- FastAPI Application ---
app = FastAPI()
engine = MockNLUEngine()

@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.post("/nlu/parse", response_model=NLUResponse)
def parse(request: NLURequest):
    """
    Parses the user's text to extract intent and entities.
    """
    return engine.parse(request.text)

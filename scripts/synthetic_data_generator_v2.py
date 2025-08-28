import json
import random

# This script generates synthetic data for training the NLU model.
# It creates varied user requests based on predefined templates and entities.

# --- Templates ---
TEMPLATES = {
    "dashboard_request": [
        "show me my {dashboard_type} dashboard",
        "can I see my {dashboard_type} metrics",
        "pull up the {dashboard_type} dashboard",
        "I want to see my {dashboard_type} analytics",
    ],
    "lead_generation": [
        "find more leads",
        "I need new leads for {industry}",
        "get me a list of {role} in {location}",
        "can you find some new prospects",
    ],
    "marketing_automation": [
        "how are my campaigns doing",
        "show me the performance of the {campaign_name} campaign",
        "I want to check on my marketing campaigns",
    ],
}

# --- Entities ---
ENTITIES = {
    "dashboard_type": ["main", "marketing", "sales", "financial"],
    "industry": ["SaaS", "e-commerce", "fintech", "healthcare"],
    "role": ["CEOs", "CTOs", "VPs of Marketing", "Sales Directors"],
    "location": ["the United States", "Europe", "California", "New York"],
    "campaign_name": ["Q2 Launch", "Summer Sale", "New Feature Promo"],
}

def generate_sentence(intent):
    """Generates a single sentence for a given intent."""
    template = random.choice(TEMPLATES[intent])

    # Fill in the entities
    entities_in_template = [e.strip('{}') for e in template.split() if '{' in e and '}' in e]
    sentence = template
    entities_found = []

    for entity_name in entities_in_template:
        value = random.choice(ENTITIES[entity_name])
        start_index = sentence.find(f"{{{entity_name}}}")
        end_index = start_index + len(value)
        sentence = sentence.replace(f"{{{entity_name}}}", value, 1)
        entities_found.append((start_index, end_index, entity_name.upper()))

    return sentence, entities_found


def generate_data(num_samples):
    """Generates a dataset of a given size."""
    dataset = []
    for _ in range(num_samples):
        intent = random.choice(list(TEMPLATES.keys()))
        text, entities = generate_sentence(intent)
        dataset.append({
            "text": text,
            "intent": intent,
            "entities": entities
        })
    return dataset

def save_to_jsonl(data, filename):
    """Saves the dataset to a JSONL file."""
    with open(filename, 'w') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')
    print(f"Successfully saved {len(data)} samples to {filename}")


if __name__ == "__main__":
    NUM_SAMPLES = 500
    print(f"Generating {NUM_SAMPLES} synthetic data samples...")
    generated_data = generate_data(NUM_SAMPLES)
    save_to_jsonl(generated_data, "train.jsonl")
    print("Done.")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import uvicorn
from typing import Dict

app = FastAPI(title="Movie Emotion Detection API", version="1.2")

# --- Allow React frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load updated TMDB movie dataset ---
DATASET_PATH = "TMDB_movie_dataset_v11.csv"
try:
    movies_df = pd.read_csv(DATASET_PATH)
    print(f"✅ Movie dataset loaded successfully from {DATASET_PATH}")
    print(f"📊 Dataset contains {len(movies_df)} entries.")

    # --- Simple genre → emotion mapping ---
    genre_emotion_map = {
        "Comedy": "happy",
        "Horror": "fear",
        "Drama": "sad",
        "Action": "surprise",
        "Romance": "happy",
        "Thriller": "fear",
        "Adventure": "surprise"
    }

    # Assign emotion based on first matching genre
    def assign_emotion(genres):
        for g in genre_emotion_map:
            if g in str(genres):
                return genre_emotion_map[g]
        return "neutral"

    if "emotion" not in movies_df.columns:
        movies_df["emotion"] = movies_df["genres"].apply(assign_emotion)
        print("ℹ️ 'emotion' column added based on genre mapping.")

except Exception as e:
    print(f"⚠️ Warning: Could not load dataset ({DATASET_PATH}):", e)
    movies_df = pd.DataFrame(columns=["movie", "emotion", "genres"])

# --- Pydantic model for receiving expressions ---
class ExpressionsInput(BaseModel):
    expressions: Dict[str, float]

@app.post("/detect_emotion/")
async def detect_emotion(data: ExpressionsInput):
    """
    Receive expressions from frontend and recommend movies based on top emotion.
    """
    expressions = data.expressions
    if not expressions:
        return {"error": "No expressions detected"}

    # Get the emotion with the highest score
    top_emotion = max(expressions, key=expressions.get)

    # Return recommendations
    return recommend_movies(top_emotion)

def recommend_movies(emotion: str):
    """
    Filter TMDB movies from dataset for a given emotion.
    """
    if movies_df.empty:
        return {"detected_emotion": emotion, "recommendations": ["Dataset missing"]}

    if "emotion" not in movies_df.columns:
        return {"detected_emotion": emotion, "recommendations": ["Invalid dataset format: 'emotion' column missing"]}

    # Strip whitespace and match case-insensitive
    recs = movies_df[movies_df["emotion"].str.strip().str.lower() == emotion.lower()]
    if recs.empty:
        return {"detected_emotion": emotion, "recommendations": ["No matching movies found"]}

    movie_col = "movie" if "movie" in recs.columns else "title"
    movie_list = recs[movie_col].tolist()

    return {"detected_emotion": emotion, "recommendations": movie_list[:10]}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

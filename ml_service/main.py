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
        if "genres" in movies_df.columns:
            movies_df["emotion"] = movies_df["genres"].apply(assign_emotion)
            print("ℹ️ 'emotion' column added based on genre mapping.")
            print(f"   Emotion distribution: {movies_df['emotion'].value_counts().to_dict()}")
        else:
            print("⚠️ 'genres' column not found. Cannot assign emotions.")
            movies_df["emotion"] = "neutral"

except Exception as e:
    print(f"⚠️ Warning: Could not load dataset ({DATASET_PATH}):", e)
    movies_df = pd.DataFrame(columns=["movie", "emotion", "genres"])

# --- Pydantic model for receiving expressions ---
class ExpressionsInput(BaseModel):ommended movies"
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
    
    # Map face-api.js emotion names to dataset emotion names
    emotion_mapping = {
        "fearful": "fear",
        "surprised": "surprise",
        "disgusted": "neutral",  # Map disgusted to neutral if not in dataset
        "angry": "neutral",      # Map angry to neutral if not in dataset
        "happy": "happy",
        "sad": "sad",
        "neutral": "neutral"
    }
    
    # Normalize emotion name to match dataset
    normalized_emotion = emotion_mapping.get(top_emotion.lower(), top_emotion.lower())
    print(f"📊 Detected emotion: {top_emotion} -> Normalized: {normalized_emotion}")

    # Return recommendations
    return recommend_movies(normalized_emotion)

def recommend_movies(emotion: str):
    """
    Filter TMDB movies from dataset for a given emotion.
    """
    if movies_df.empty:
        print("❌ Dataset is empty")
        return {"detected_emotion": emotion, "recommendations": ["Dataset missing"]}

    if "emotion" not in movies_df.columns:
        print("❌ Emotion column missing from dataset")
        return {"detected_emotion": emotion, "recommendations": ["Invalid dataset format: 'emotion' column missing"]}

    # Strip whitespace and match case-insensitive
    recs = movies_df[movies_df["emotion"].str.strip().str.lower() == emotion.lower()]
    print(f"🔍 Found {len(recs)} movies matching emotion: {emotion}")
    
    if recs.empty:
        print(f"⚠️ No movies found for emotion: {emotion}")
        print(f"   Available emotions in dataset: {movies_df['emotion'].unique()[:10]}")
        return {"detected_emotion": emotion, "recommendations": [f"No matching movies found for {emotion}"]}

    # Check which column exists: 'title' or 'movie'
    movie_col = None
    if "title" in recs.columns:
        movie_col = "title"
    elif "movie" in recs.columns:
        movie_col = "movie"
    else:
        print(f"❌ Neither 'title' nor 'movie' column found. Available columns: {recs.columns.tolist()}")
        return {"detected_emotion": emotion, "recommendations": ["Column name mismatch in dataset"]}

    movie_list = recs[movie_col].tolist()
    
    # Remove duplicates while preserving order
    seen = set()
    unique_movies = []
    MAX_RECOMMENDATIONS = 20  # Increased from 10 to show more movies
    for movie in movie_list:
        if movie not in seen and pd.notna(movie):  # Also filter out NaN values
            seen.add(movie)
            unique_movies.append(movie)
            if len(unique_movies) >= MAX_RECOMMENDATIONS:
                break
    
    print(f"✅ Returning {len(unique_movies)} recommendations")

    return {"detected_emotion": emotion, "recommendations": unique_movies}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

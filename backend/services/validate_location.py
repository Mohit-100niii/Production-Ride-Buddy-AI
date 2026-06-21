import httpx
import os
from dotenv import load_dotenv
load_dotenv()

OPENSTREETMAP_BASE_URL = os.getenv("OPENSTREETMAP_BASE_URL")


async def validate_location(location: str):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            OPENSTREETMAP_BASE_URL,
            params={
                "q": location,
                "format": "json",
                "limit": 1
            },
            headers={
                "User-Agent": "RideBuddy/1.0"
            }
        )

        data = response.json()

        return len(data) > 0
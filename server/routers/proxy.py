from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import httpx

router = APIRouter(prefix="/api/images", tags=["proxy"])


@router.get("/proxy")
async def proxy_image(url: str = Query(...)):
    if not url.startswith("https://photo.yupoo.com/"):
        raise HTTPException(status_code=400, detail="Only Yupoo images allowed")

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers={"Referer": "https://x.yupoo.com/"})
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Upstream error")

        content_type = resp.headers.get("content-type", "image/jpeg")
        return StreamingResponse(
            content=resp.aiter_bytes(),
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=86400"},
        )

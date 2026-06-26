import io
import random
import secrets
import time
import base64

from PIL import Image, ImageDraw, ImageFont, ImageFilter

CHARS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
LENGTH = 4
TTL_SECONDS = 300

_store: dict[str, dict] = {}


def _clean_expired():
    now = time.time()
    expired = [cid for cid, v in _store.items() if v["expires_at"] < now]
    for cid in expired:
        del _store[cid]


def _random_color() -> tuple[int, int, int]:
    return random.randint(0, 100), random.randint(0, 150), random.randint(0, 255)


def _get_font(size=42):
    """跨平台字体加载：优先系统字体，失败则用默认字体"""
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Ubuntu
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",  # CentOS
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",  # 其他 Linux
        "arial.ttf",  # Windows
    ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    # 回退：默认字体（增大字号无意义，改大图片尺寸补偿）
    return ImageFont.load_default()


def _generate_image(text: str) -> bytes:
    width = 240
    height = 80
    img = Image.new("RGB", (width, height), (240, 245, 250))
    draw = ImageDraw.Draw(img)
    font = _get_font(42)

    # 干扰线
    for _ in range(5):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)
        draw.line([(x1, y1), (x2, y2)], fill=_random_color(), width=2)

    # 噪点
    for _ in range(80):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        draw.point((x, y), fill=_random_color())

    # 文字（每个字符独立颜色和轻微旋转）
    for i, ch in enumerate(text):
        char_img = Image.new("RGBA", (55, 60), (0, 0, 0, 0))
        char_draw = ImageDraw.Draw(char_img)
        color = _random_color()
        char_draw.text((5, 0), ch, font=font, fill=color)
        char_img = char_img.rotate(random.randint(-35, 35), expand=True, fillcolor=(0, 0, 0, 0))
        x = 20 + i * 50 + random.randint(-5, 5)
        y = random.randint(8, 18)
        img.paste(char_img, (x, y), char_img)

    img = img.filter(ImageFilter.SMOOTH)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def generate_captcha() -> dict:
    _clean_expired()

    captcha_id = secrets.token_hex(16)
    text = "".join(random.choice(CHARS) for _ in range(LENGTH))
    img_bytes = _generate_image(text)
    img_b64 = base64.b64encode(img_bytes).decode("utf-8")

    _store[captcha_id] = {
        "answer": text.lower(),
        "expires_at": time.time() + TTL_SECONDS,
    }

    return {
        "captcha_id": captcha_id,
        "image": f"data:image/png;base64,{img_b64}",
    }


def verify_captcha(captcha_id: str, answer: str) -> bool:
    _clean_expired()
    entry = _store.pop(captcha_id, None)
    if entry is None:
        return False
    return entry["answer"] == answer.strip().lower()

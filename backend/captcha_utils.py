"""
captcha_utils.py – Generate image-based CAPTCHA for the ESIC portal clone.
"""

import base64
import random
import string
import uuid
from io import BytesIO

from PIL import Image, ImageDraw, ImageFilter, ImageFont


# Exclude easily-confused glyphs
_CHARS = (string.ascii_uppercase + string.digits).translate(
    str.maketrans("", "", "0O1IlS5")
)

# Font search paths (Linux / macOS / Windows)
_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/arial.ttf",
]


def _load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in _FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except (IOError, OSError):
            continue
    return ImageFont.load_default()


def generate_captcha_text(length: int = 6) -> str:
    return "".join(random.choices(_CHARS, k=length))


def generate_captcha_image(text: str) -> str:
    """Return a base64 PNG data-URI of the rendered CAPTCHA."""
    width, height = 190, 45
    bg_color = (245, 245, 250)
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Background noise dots
    for _ in range(400):
        draw.point(
            (random.randint(0, width), random.randint(0, height)),
            fill=(
                random.randint(150, 230),
                random.randint(150, 230),
                random.randint(150, 230),
            ),
        )

    # Distraction lines
    for _ in range(6):
        draw.line(
            [
                (random.randint(0, width), random.randint(0, height)),
                (random.randint(0, width), random.randint(0, height)),
            ],
            fill=(
                random.randint(100, 180),
                random.randint(100, 180),
                random.randint(100, 180),
            ),
            width=1,
        )

    font = _load_font(26)
    x = 8
    for ch in text:
        color = (
            random.randint(10, 80),
            random.randint(10, 80),
            random.randint(80, 160),
        )
        y_offset = random.randint(4, 12)
        draw.text((x, y_offset), ch, font=font, fill=color)
        x += 28

    img = img.filter(ImageFilter.SMOOTH_MORE)

    buf = BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def create_captcha_session() -> dict:
    text = generate_captcha_text()
    return {
        "session_id":    str(uuid.uuid4()),
        "captcha_text":  text,
        "captcha_image": generate_captcha_image(text),
    }

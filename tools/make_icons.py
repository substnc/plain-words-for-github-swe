"""Ritar tilläggets ikoner: en svart pratbubbla med vitt frågetecken och grå kant."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "extension" / "icons"
BLACK = (0, 0, 0, 255)
RING = (127, 127, 127, 255)  # ink-muted
WHITE = (255, 255, 255, 255)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def draw(size_px: int = 512) -> Image.Image:
    img = Image.new("RGBA", (size_px, size_px), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size_px / 128
    # Grå kontur först, så att ikonen syns även i ett mörkt verktygsfält.
    d.rounded_rectangle([4 * s, 6 * s, 124 * s, 98 * s], radius=30 * s, fill=RING)
    d.polygon([(26 * s, 88 * s), (62 * s, 88 * s), (20 * s, 124 * s)], fill=RING)
    d.rounded_rectangle([10 * s, 12 * s, 118 * s, 92 * s], radius=24 * s, fill=BLACK)
    d.polygon([(32 * s, 86 * s), (56 * s, 86 * s), (28 * s, 114 * s)], fill=BLACK)
    font = ImageFont.truetype(FONT, int(70 * s))
    box = d.textbbox((0, 0), "?", font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    d.text((64 * s - w / 2 - box[0], 52 * s - h / 2 - box[1]), "?", font=font, fill=WHITE)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    big = draw()
    for size in (16, 32, 48, 128):
        big.resize((size, size), Image.LANCZOS).save(OUT / f"icon-{size}.png")
    print("Ikoner sparade i", OUT)


if __name__ == "__main__":
    main()

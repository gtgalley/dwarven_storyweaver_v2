"""Build the image layers used by Brassreach's photographic intro.

The generated source plates share one 1672 x 941 composition.  This helper
keeps the blank open-book plate immutable and turns each illustrated plate
into a feathered, registered left-page overlay.  The runtime can therefore
change the painting without changing the lantern, lectern, binding, or light.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


CANVAS_SIZE = (1672, 941)
OVERLAY_BOX = (330, 278, 834, 756)
PAGE_ART_POLYGON = (
    (354, 306),
    (794, 300),
    (820, 324),
    (818, 716),
    (792, 744),
    (368, 744),
    (344, 719),
    (344, 330),
)


def load_plate(path: Path) -> Image.Image:
    plate = Image.open(path).convert("RGB")
    if plate.size != CANVAS_SIZE:
        raise ValueError(f"{path} is {plate.size}; expected {CANVAS_SIZE}")
    return plate


def save_webp(image: Image.Image, path: Path) -> None:
    image.save(path, "WEBP", quality=94, method=6, exact=True)


def edge_ramp(size: tuple[int, int], *, side: str, start: int, end: int) -> Image.Image:
    """Return a smooth black-compositing ramp for one canvas edge."""

    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    span = max(1, end - start)
    if side == "bottom":
        for y in range(start, end + 1):
            progress = (y - start) / span
            smooth = progress * progress * (3 - (2 * progress))
            draw.line((0, y, width, y), fill=round(255 * smooth))
    elif side in {"left", "right"}:
        for offset in range(start, end + 1):
            progress = (offset - start) / span
            smooth = 1 - (progress * progress * (3 - (2 * progress)))
            x = offset if side == "left" else width - 1 - offset
            draw.line((x, 0, x, height), fill=round(255 * smooth))
    else:
        raise ValueError(f"Unsupported edge: {side}")
    return mask


def refine_stage_plate(image: Image.Image) -> Image.Image:
    """Blend the generated stage into true black without moving its geometry.

    The lantern and the warm pool immediately around it remain untouched.  Only
    the distant upper backdrop, a narrow strip at each side, and the cropped
    lower lectern edge are graduated into the site's black canvas.
    """

    top = Image.new("L", CANVAS_SIZE, 0)
    draw = ImageDraw.Draw(top)
    draw.polygon(((0, 0), (510, 0), (545, 245), (0, 322)), fill=255)
    draw.polygon(((1162, 0), (1672, 0), (1672, 322), (1127, 245)), fill=255)
    top = top.filter(ImageFilter.GaussianBlur(52))

    left = edge_ramp(CANVAS_SIZE, side="left", start=0, end=42)
    right = edge_ramp(CANVAS_SIZE, side="right", start=0, end=42)
    bottom = edge_ramp(CANVAS_SIZE, side="bottom", start=874, end=940)
    mask = ImageChops.lighter(top, ImageChops.lighter(bottom, ImageChops.lighter(left, right)))
    return Image.composite(Image.new("RGB", CANVAS_SIZE, "black"), image, mask)


def build_overlay(source: Image.Image, output: Path) -> None:
    mask = Image.new("L", CANVAS_SIZE, 0)
    ImageDraw.Draw(mask).polygon(PAGE_ART_POLYGON, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(12))

    rgba = source.convert("RGBA")
    rgba.putalpha(mask)
    cropped = rgba.crop(OVERLAY_BOX)
    cropped.save(output, "PNG", optimize=True, compress_level=9)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", type=Path, required=True)
    parser.add_argument("--base", type=Path, required=True)
    parser.add_argument("--city", type=Path, required=True)
    parser.add_argument("--archives", type=Path, required=True)
    parser.add_argument("--unfathomer", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    save_webp(refine_stage_plate(load_plate(args.cover)), args.output / "closed-cover.webp")
    save_webp(refine_stage_plate(load_plate(args.base)), args.output / "open-base.webp")

    for name in ("city", "archives", "unfathomer"):
        build_overlay(load_plate(getattr(args, name)), args.output / f"art-{name}.png")


if __name__ == "__main__":
    main()

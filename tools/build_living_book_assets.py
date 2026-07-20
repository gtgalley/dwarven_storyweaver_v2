"""Build the image layers used by Brassreach's photographic intro.

The generated source plates share one 1672 x 941 composition.  This helper
keeps the blank open-book plate immutable and turns each illustrated plate
into a feathered, registered left-page overlay.  The runtime can therefore
change the painting without changing the lantern, lectern, binding, or light.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


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
    save_webp(load_plate(args.cover), args.output / "closed-cover.webp")
    save_webp(load_plate(args.base), args.output / "open-base.webp")

    for name in ("city", "archives", "unfathomer"):
        build_overlay(load_plate(getattr(args, name)), args.output / f"art-{name}.png")


if __name__ == "__main__":
    main()

"""Prepare Brassreach's licensed fireplace recording for browser playback.

The source is a 32-bit stereo WAV.  The intro uses a quiet supporting layer,
so a normalized 22.05 kHz mono PCM file preserves the natural recording while
keeping the GitHub Pages download practical and universally decodable.
"""

from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np


def read_pcm(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as source:
        if source.getcomptype() != "NONE":
            raise ValueError("Only uncompressed PCM WAV input is supported")
        channels = source.getnchannels()
        width = source.getsampwidth()
        rate = source.getframerate()
        frames = source.readframes(source.getnframes())

    if width == 2:
        samples = np.frombuffer(frames, dtype="<i2").astype(np.float64) / 32768
    elif width == 4:
        samples = np.frombuffer(frames, dtype="<i4").astype(np.float64) / 2147483648
    else:
        raise ValueError(f"Unsupported PCM sample width: {width * 8} bits")

    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    return samples, rate


def resample_half_rate(samples: np.ndarray, source_rate: int, target_rate: int) -> np.ndarray:
    if source_rate == target_rate:
        return samples
    if source_rate == target_rate * 2:
        usable = samples[: len(samples) - (len(samples) % 2)]
        return usable.reshape(-1, 2).mean(axis=1)
    duration = len(samples) / source_rate
    output_length = round(duration * target_rate)
    source_positions = np.linspace(0, len(samples) - 1, output_length)
    return np.interp(source_positions, np.arange(len(samples)), samples)


def write_pcm16(path: Path, samples: np.ndarray, rate: int, peak_db: float) -> None:
    peak = float(np.max(np.abs(samples))) or 1.0
    target_peak = 10 ** (peak_db / 20)
    normalized = np.clip(samples * (target_peak / peak), -1, 1)
    pcm = (normalized * 32767).astype("<i2").tobytes()
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(rate)
        output.writeframes(pcm)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--rate", type=int, default=22050)
    parser.add_argument("--peak-db", type=float, default=-7.0)
    args = parser.parse_args()

    samples, source_rate = read_pcm(args.input)
    samples = resample_half_rate(samples, source_rate, args.rate)
    write_pcm16(args.output, samples, args.rate, args.peak_db)


if __name__ == "__main__":
    main()

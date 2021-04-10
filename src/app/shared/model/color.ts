export function generateColor(ind: number): string {
  const s = 0.8;
  const v = 0.8;
  const h = ((0.19 * (ind + 2)) % 1) * 360;
  const rgb = hsv2rgb(h, s, v);
  return rgb2hex(rgb[0], rgb[1], rgb[2]);
}

export function hsv2rgb(h: number, s: number, v: number): number[] {
  /**
   * I: An array of three elements hue (h) ∈ [0, 360], and saturation (s) and value (v) which are ∈ [0, 1]
   * O: An array of red (r), green (g), blue (b), all ∈ [0, 255]
   * Derived from https://en.wikipedia.org/wiki/HSL_and_HSV
   * This stackexchange was the clearest derivation I found to reimplement
   * https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
   */

  const hPrime = h / 60;
  const c = v * s;
  const x = c * (1 - Math.abs(hPrime % 2 - 1));
  const m = v - c;
  let r;
  let g;
  let b;
  if (!hPrime) {
    r = 0;
    g = 0;
    b = 0;
  }
  if (hPrime >= 0 && hPrime < 1) {
    r = c;
    g = x;
    b = 0;
  }
  if (hPrime >= 1 && hPrime < 2) {
    r = x;
    g = c;
    b = 0;
  }
  if (hPrime >= 2 && hPrime < 3) {
    r = 0;
    g = c;
    b = x;
  }
  if (hPrime >= 3 && hPrime < 4) {
    r = 0;
    g = x;
    b = c;
  }
  if (hPrime >= 4 && hPrime < 5) {
    r = x;
    g = 0;
    b = c;
  }
  if (hPrime >= 5 && hPrime < 6) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgb2hex(r: number, g: number, b: number): string {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

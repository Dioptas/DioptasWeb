export function createRandomImage(width, height, maxIntensity = 64000): Uint16Array {
  const size = width * height;
  const data = new Uint16Array(size);
  let index;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      index = i * height + j;
      data[index] = Math.floor(Math.random() * maxIntensity);
    }
  }
  return data;
}

export function createAscendingImage(width, height, maxIntensity = 64000): Uint16Array {
  const size = width * height;
  const data = new Uint16Array(size);

  let index;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      index = i * width + j;
      data[index] = Math.floor((index / (height * width)) * maxIntensity);
    }
  }
  return data;
}

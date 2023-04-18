export function getColor(hex: string) {
  const aRgbHex = hex.substring(1).match(/.{1,2}/g);
  if (aRgbHex) {
    const aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16)
    ];
    const brightness = Math.sqrt(0.241 * Math.pow(+aRgb[0],2) + 0.691 * Math.pow(+aRgb[1],2) + 0.068 * Math.pow(+aRgb[2],2));
    return brightness < 130 ? 'white' : 'black';
  } else {
    return 'black'
  }

}

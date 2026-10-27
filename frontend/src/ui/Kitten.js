// Gatito naranja pixel art (el colaborador). Lienzo de 16x16, se escala con CSS.
export const KITTEN_ROWS = [
  '..OO........OO..',
  '.OOOO......OOOO.',
  '.OPOOOOOOOOOOPO.',
  '.OOODOOOOOODOOO.',
  '.OOOOODOODOOOOO.',
  '.OOKKOOOOOOKKOO.',
  '.OOKKOOOOOOKKOO.',
  '.OOOOOWWWWOOOOO.',
  '.OOOOWWPPWWOOOO.',
  '..OOOWWKKWWOOO.O',
  '...OOOWWWWOOO.OO',
  '..OOOOOOOOOOOOOD',
  '.OOODOOOOOODOOO.',
  '.OOOOWWOOWWOOOO.',
  '.OOOWWWOOWWWOOO.',
  '..OOWWW..WWWOO..'
];
const COLORS = { O: '#f97316', D: '#c2410c', W: '#fef3c7', K: '#1c1917', P: '#f9a8d4' };

export function drawKitten(canvas) {
  if (!canvas) return;
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, 16, 16);
  KITTEN_ROWS.forEach((row, y) => [...row].forEach((ch, x) => {
    if (COLORS[ch]) { c.fillStyle = COLORS[ch]; c.fillRect(x, y, 1, 1); }
  }));
}

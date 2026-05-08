# icons

`feasty.svg` is the source vector. for chrome mv3 you usually want png at 16/32/48/128 — generate them from the svg via something like sharp:

```bash
npx sharp-cli -i feasty.svg -o feasty-16.png --resize 16
npx sharp-cli -i feasty.svg -o feasty-32.png --resize 32
npx sharp-cli -i feasty.svg -o feasty-48.png --resize 48
npx sharp-cli -i feasty.svg -o feasty-128.png --resize 128
```

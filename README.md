# Run

```bash
 $ git clone git@github.com:dsdenes/gol-react.git
 $ npm i
 $ npm run start
```

# Extra functionalities

- "Unlimited" canvas size
- Mouse wheel zoom

# Design decisions

- I decided to implement unlimited canvas size, because without this, the GOL rules couldn't be applied to all cells with the same chance.

# Constraints

- Functionality of keepeng the canvas in the center doesn't work if zoom multiplier is less than 1

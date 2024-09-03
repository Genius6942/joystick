# joystick

### A joystick for the web

---

# Installation:

### npm

```
npm install joystick
```

```js
import { Joystick } from "@haelp/joystick";
```

### script tag

```html
<script src="https://cdn.jsdelivr.net/npm/@haelp/joystick"></script>
```


# Use:
```js
// create a new joystick instance
const joystick = new Joystick();

// add it to the dom tree
document.body.appendChild(joystick.dom);

// position it on the bottom left
joystick.style.cssText = "position: fixed; bottom: 30px; left:30px;";

joystick.on("move", (angle) => {
  console.log('Joystick angle:', angle);
});
```
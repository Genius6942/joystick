'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// import './index.css';

// a class to contain css styles for an element
class Styles {
  constructor() {
    /**
     * @type {Object.<string, string>}
     */
    this.styles = {};
  }

  /**
   * @param {string} name
   * @param {string} style
   */
  set(name, style) {
    this.styles[name] = style;
  }

  /**
   * @returns {string}
   */
  get() {
    return Object.entries(this.styles)
      .map(([name, style]) => `${name}: ${style}`)
      .join("; ");
  }
}

class Joystick {
  constructor(options = {}) {
    this.style = new Styles();

    this.options = {
      outerRadius: 100,
      innerRadius: 75 / 2,
      ...options,
    };

    this.config();

    this.dom = document.createElement("div");

    this.dom.appendChild(document.createElement("div"));

    this.dom.firstElementChild.className = "joystick";
    this.dom.firstElementChild.innerHTML = `
			<div class="handle">

			</div>
		`;

    this.grabber = {
      x: 0,
      y: 0,

      grabbing: false,
    };

    this._handlePosition = {
      x: 0,
      y: 0,
    };

    this.events = {
      /**
       * @type {Array<(angle: number) => void>}
       */
      start: [],
      /**
       * @type {Array<(angle: number) => void>}
       */
      move: [],
      /**
       * @type {Array<(angle: number) => void>}
       */
      end: [],
    };

    /**
     * @type {number | null}
     */
    this.touchIdentifier = null;

    /**
     * @type {number} - angle of joystick in radians
     */
    this.angle = 0;

    // create mouse handlers
    this.dom.firstElementChild.firstElementChild.addEventListener("mousedown", this.mouseHandler.bind(this), {
      passive: false,
    });
    document.addEventListener("mousemove", this.mouseHandler.bind(this), { passive: false });
    document.addEventListener("mouseup", this.mouseHandler.bind(this), { passive: false });

    // create touch handlers
    this.dom.firstElementChild.firstElementChild.addEventListener(
      "touchstart",
      this.touchHandler.bind(this),
      {
        passive: false,
      }
    );

    document.addEventListener("touchmove", this.touchHandler.bind(this), { passive: false });
    document.addEventListener("touchend", this.touchHandler.bind(this), { passive: false });

    this.updateStyle();
  }

  config() {
    this.style.set("--size", `${this.options.outerRadius * 2}px`);
    this.style.set("--inner-size", `${this.options.innerRadius * 2}px`);
  }

  get handlePosition() {
    return this._handlePosition;
  }

  set handlePosition(position) {
    this._handlePosition = position;
    this.style.set("--move-x", `${position.x}px`);
    this.style.set("--move-y", `${position.y}px`);
    this.updateStyle();
  }

  get angleInDeg() {
    return (this.angle * 180) / Math.PI;
  }

  updateStyle() {
    this.dom.firstElementChild.style.cssText = this.style.get();
  }

  calculateAngle() {
    this.angle = Math.atan2(this.handlePosition.y, this.handlePosition.x) + Math.PI / 2;

    if (this.angle < 0) {
      this.angle += 2 * Math.PI;
    }

    this.angle = this.angle;
  }

  /**
   * @param {MouseEvent} e
   */
  mouseHandler(e) {
    if (e.type === "mousedown") {
      this.grabber.grabbing = true;
      this.grabber.x = e.clientX;
      this.grabber.y = e.clientY;

      this.events.start.forEach(callback => callback(this.angle, this.grabber.grabbing));
    } else if (e.type === "mouseup") {
      if (this.grabber.grabbing) {
        this.grabber.grabbing = false;
        this.handlePosition = {
          x: 0,
          y: 0,
        };
      }

      this.events.end.forEach(callback => callback(this.angle, this.grabber.grabbing));
    } else if (e.type === "mousemove") {
      if (this.grabber.grabbing) {
        e.preventDefault();
        let x = e.clientX - this.grabber.x;
        let y = e.clientY - this.grabber.y;

        if (Math.sqrt(x * x + y * y) > this.options.outerRadius) {
          const ratio = this.options.outerRadius / Math.sqrt(x * x + y * y);
          x *= ratio;
          y *= ratio;
        }

        this.handlePosition = {
          x: x,
          y: y,
        };

        this.calculateAngle();

        this.events.move.forEach(callback => callback(this.angle, this.grabber.grabbing));
      }
    }
  }

  /**
   * @param {TouchEvent} e
   */
  touchHandler(e) {
    if (e.type === "touchstart") {
      this.grabber.grabbing = true;
      for (let touch of e.changedTouches) {
        if (touch.target === this.dom.firstElementChild.firstElementChild) {
          this.touchIdentifier = touch.identifier;
          break;
        }
      }
      this.grabber.x = [...e.touches].find(({ identifier }) => identifier === this.touchIdentifier).clientX;
      this.grabber.y = [...e.touches].find(({ identifier }) => identifier === this.touchIdentifier).clientY;

      this.events.start.forEach(callback => callback(this.angle, this.grabber.grabbing));
    } else if (e.type === "touchend") {
      this.grabber.grabbing = false;
      this.handlePosition = {
        x: 0,
        y: 0,
      };

      this.events.end.forEach(callback => callback(this.angle, this.grabber.grabbing));
    } else if (e.type === "touchmove") {
      if (this.grabber.grabbing) {
        e.preventDefault();
        let x =
          [...e.touches].find(({ identifier }) => identifier === this.touchIdentifier).clientX -
          this.grabber.x;
        let y =
          [...e.touches].find(({ identifier }) => identifier === this.touchIdentifier).clientY -
          this.grabber.y;

        if (Math.sqrt(x * x + y * y) > this.options.outerRadius) {
          const ratio = this.options.outerRadius / Math.sqrt(x * x + y * y);
          x *= ratio;
          y *= ratio;
        }

        this.handlePosition = {
          x: x,
          y: y,
        };

        this.calculateAngle();
      }

      this.events.move.forEach(callback => callback(this.angle, this.grabber.grabbing));
    }
  }

  /**
   * @param {'start' | 'move' | 'end'} event - event to listen for
   * @param {(angle: number, grabbing: boolean) => void} callback - callback to call when event occurs
   */
  on(event, callback) {
    if (event === "move") {
      this.events.move.push(callback);
    } else if (event === "start") {
      this.events.start.push(callback);
    } else if (event === "end") {
      this.events.end.push(callback);
    }
  }
}

exports.Joystick = Joystick;

export class Joystick {
    constructor(options?: {});
    style: Styles;
    options: {
        outerRadius: number;
        innerRadius: number;
    };
    dom: HTMLDivElement;
    grabber: {
        x: number;
        y: number;
        grabbing: boolean;
    };
    _handlePosition: {
        x: number;
        y: number;
    };
    events: {
        /**
         * @type {Array<(angle: number) => void>}
         */
        start: ((angle: number) => void)[];
        /**
         * @type {Array<(angle: number) => void>}
         */
        move: ((angle: number) => void)[];
        /**
         * @type {Array<(angle: number) => void>}
         */
        end: ((angle: number) => void)[];
    };
    /**
     * @type {number | null}
     */
    touchIdentifier: number | null;
    /**
     * @type {number} - angle of joystick in radians
     */
    angle: number;
    config(): void;
    set handlePosition(arg: {
        x: number;
        y: number;
    });
    get handlePosition(): {
        x: number;
        y: number;
    };
    get angleInDeg(): number;
    updateStyle(): void;
    calculateAngle(): void;
    /**
     * @param {MouseEvent} e
     */
    mouseHandler(e: MouseEvent): void;
    /**
     * @param {TouchEvent} e
     */
    touchHandler(e: TouchEvent): void;
    /**
     * @param {'start' | 'move' | 'end'} event - event to listen for
     * @param {(angle: number, grabbing: boolean) => void} callback - callback to call when event occurs
     */
    on(event: 'start' | 'move' | 'end', callback: (angle: number, grabbing: boolean) => void): void;
}
declare class Styles {
    /**
     * @type {Object.<string, string>}
     */
    styles: {
        [x: string]: string;
    };
    /**
     * @param {string} name
     * @param {string} style
     */
    set(name: string, style: string): void;
    /**
     * @returns {string}
     */
    get(): string;
}
export {};
//# sourceMappingURL=index.d.ts.map
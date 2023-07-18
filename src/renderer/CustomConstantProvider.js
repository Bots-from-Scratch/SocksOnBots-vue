import * as Blockly from "blockly/core";

export class CustomConstantProvider extends Blockly.blockRendering.ConstantProvider {
    constructor() {
        // Set up all of the constants from the base provider.
        super();

        // Override a few properties.
        /**
         * The width of the notch used for previous and next connections.
         * @type {number}
         * @override
         */
        this.NOTCH_WIDTH = 20;

        /**
         * The height of the notch used for previous and next connections.
         * @type {number}
         * @override
         */
        this.NOTCH_HEIGHT = 10;

        /**
         * Rounded corner radius.
         * @type {number}
         * @override
         */
        this.CORNER_RADIUS = 2;

        /**
         * The height of the puzzle tab used for input and output connections.
         * @type {number}
         * @override
         */
        this.TAB_HEIGHT = 8;
    }

    /**
     * Initialize shape objects based on the constants set in the constructor.
     */
    init() {

        // First, call init() in the base provider to store the default objects.
        super.init();

        /**
         * An object containing sizing and path information about collapsed block
         * indicators.
         */
        this.JAGGED_TEETH = this.makeJaggedTeeth();

        /** An object containing sizing and path information about notches. */
        this.NOTCH = this.makeNotch();

        // Add calls to create shape objects for the new connection shapes.
        this.RECT_PREV_NEXT = this.makeRectangularPreviousConn();
        this.RECT_INPUT_OUTPUT = this.makeRectangularInputConn();
    }

    /**
     * @returns Rectangular notch for use with previous and next connections.
     */
    makeRectangularPreviousConn() {
        const width = this.NOTCH_WIDTH;
        const height = this.NOTCH_HEIGHT;

        /**
         * Since previous and next connections share the same shape you can define
         * a function to generate the path for both.
         *
         * @param dir Multiplier for the horizontal direction of the path (-1 or 1)
         * @returns SVGPath line for use with previous and next connections.
         */
        function makeMainPath(dir) {
            return Blockly.utils.svgPaths.line(
                [
                    Blockly.utils.svgPaths.point(0, height),
                    Blockly.utils.svgPaths.point(dir * width, 0),
                    Blockly.utils.svgPaths.point(0, -height),
                ]);
        }
        const pathLeft = makeMainPath(1);
        const pathRight = makeMainPath(-1);

        return {
            width: width,
            height: height,
            pathLeft: pathLeft,
            pathRight: pathRight,
        };
    }

    /**
     * @returns Rectangular puzzle tab for use with input and output connections.
     */
    makeRectangularInputConn() {
        const width = this.TAB_WIDTH;
        const height = this.TAB_HEIGHT;

        /**
         * Since input and output connections share the same shape you can define
         * a function to generate the path for both.
         *
         * @param dir Multiplier for the vertical direction of the path (-1 or 1)
         * @returns SVGPath line for use with input and output connections.
         */
        function makeMainPath(dir) {
            return Blockly.utils.svgPaths.line(
                [
                    Blockly.utils.svgPaths.point(-width, 0),
                    Blockly.utils.svgPaths.point(0, dir * height),
                    Blockly.utils.svgPaths.point(width, 0),
                ]);
        }
        const pathUp = makeMainPath(-1);
        const pathDown = makeMainPath(1);

        return {
            width: width,
            height: height,
            pathUp: pathUp,
            pathDown: pathDown,
        };
    }

    /**
     * @override
     */
    shapeFor(connection) {
        switch (connection.type) {
            case Blockly.INPUT_VALUE:
            case Blockly.OUTPUT_VALUE:
                return this.RECT_INPUT_OUTPUT;
            case Blockly.PREVIOUS_STATEMENT:
            case Blockly.NEXT_STATEMENT:
                return this.RECT_PREV_NEXT;
            default:
                throw Error('Unknown connection type');
        }
    }
}
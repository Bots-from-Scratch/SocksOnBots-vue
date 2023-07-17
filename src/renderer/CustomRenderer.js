import * as Blockly from "blockly/core";
import { CustomConstantProvider } from "@/renderer/CustomConstantProvider";

export class CustomRenderer extends Blockly.blockRendering.Renderer {
  constructor() {
    super();
  }

  /**
   * @override
   */
  makeConstants_() {
    return new CustomConstantProvider();
  }
}

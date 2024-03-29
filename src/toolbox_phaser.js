/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Shared toolbox for JS-Interpreter demos.
 */

import "@/blocks/move_player";
import "@/blocks/walked_around";
import "@/blocks/direction_blocked";
import "@/blocks/direction_clear";
import "@/blocks/object_sock";
import "@/blocks/scan_for_object";
import "@/blocks/bool_sighted";
import "@/blocks/whileUntil";
import "@/blocks/custom_if_controls";
import "@/blocks/object_collected";
import "@/blocks/break";
import "@/blocks/repeat_x_times";
import "@/blocks/bool_connected";

export var toolboxJson = {
  contents: [
    {
      kind: "CATEGORY",
      name: "Logic",
      colour: "#eb6c4b",
      contents: [
        {
          kind: "BLOCK",
          type: "custom_if_controls",
        },
        {
          kind: "BLOCK",
          type: "logic_compare",
        },
        {
          kind: "BLOCK",
          type: "logic_operation",
        },
        {
          kind: "BLOCK",
          type: "logic_negate",
        },
        {
          kind: "BLOCK",
          type: "logic_boolean",
        },
        {
          kind: "BLOCK",
          type: "bool_connected",
        },
        {
          kind: "BLOCK",
          type: "bool_sighted",
        },
        {
          kind: "BLOCK",
          type: "direction_blocked",
        },
        {
          kind: "BLOCK",
          type: "direction_clear",
        },
        {
          kind: "BLOCK",
          type: "walked_around",
        },
        {
          kind: "BLOCK",
          type: "object_collected",
        },
      ],
    },
    {
      kind: "CATEGORY",
      name: "Loops",
      colour: "#ffc84f",
      contents: [
        {
          kind: "BLOCK",
          type: "repeat_x_times",
          // inputs: {
          //   TIMES: {
          //     shadow: {
          //       type: "math_number",
          //       fields: { NUM: 10 },
          //     },
          //   },
          // },
        },
        {
          kind: "BLOCK",
          type: "whileUntil",
        },
      ],
    },
    {
      kind: "CATEGORY",
      name: "Math",
      colour: "#eb6c4b",
      contents: [
        {
          kind: "BLOCK",
          type: "math_number",
        },
        {
          kind: "BLOCK",
          type: "math_arithmetic",
          inputs: {
            A: {
              shadow: {
                type: "math_number",
                fields: { NUM: 1 },
              },
            },
            B: {
              shadow: {
                type: "math_number",
                fields: { NUM: 1 },
              },
            },
          },
        },
        {
          kind: "BLOCK",
          type: "math_single",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: { NUM: 9 },
              },
            },
          },
        },
      ],
    },

    {
      kind: "SEP",
    },
    {
      kind: "CATEGORY",
      name: "Variables",
      colour: "#ffc84f",
      contents: [
        {
          kind: "BLOCK",
          type: "object_sock",
        },
      ],
    },
    {
      kind: "CATEGORY",
      name: "Aktionen",
      colour: "#eb6c4b",
      contents: [
        {
          kind: "BLOCK",
          type: "move_player",
        },

        {
          kind: "BLOCK",
          type: "scan_for_object",
        },

        {
          kind: "BLOCK",
          type: "break",
        },
      ],
    },
  ],
};

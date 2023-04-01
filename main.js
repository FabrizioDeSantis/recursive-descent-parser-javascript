/**
 * file for testing
 */

import Parser from "./parser.js"

const input = "-( 5 ^ 2 + 1) * 2";
const parser = new Parser();

const result = parser.parse(input);

console.log(result);
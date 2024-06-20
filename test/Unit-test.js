// Import the necessary functions and data
import { commandInputs, generateBytecode } from '../src/ccomponents/Universal-router-encoder.js';

// Define the command and input values
let command = '0x00';
let inputFields = [
  '0xBf2e097281F577ABa24cEcE13deeDD5f3D112c4A', // address
  '1', // uint1
  '2', // uint2
  '0000000000000000000000000000000000000000000000000000000000000060', // bytes
  '0' // bool
];

// Call the function and log the result
let bytecode = generateBytecode(command, inputFields);
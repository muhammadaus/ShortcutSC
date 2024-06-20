import { encodeAbiParameters} from 'viem';



export const commandInputs = {
    "0x00": [{ type: "address", name: "address" }, { type: "uint256", name: "uint1" }, { type: "uint256", name: "uint2" }, { type: "bytes", name: "bytes" }, { type: "bool", name: "bool" }],
    "0x01": [{ type: "address", name: "address" }, { type: "uint256", name: "uint1" }, { type: "uint256", name: "uint2" }, { type: "bytes", name: "bytes" }, { type: "bool", name: "bool" }],
    "0x02": [{ type: "address", name: "address1" }, { type: "address", name: "address2" }, { type: "uint256", name: "uint" }],
    "0x03": [{ type: "IAllowanceTransfer.PermitBatch", name: "permitBatch" }, { type: "bytes", name: "bytes" }],
    "0x04": [{ type: "address", name: "address1" }, { type: "address", name: "address2" }, { type: "uint256", name: "uint" }],
    "0x05": [{ type: "address", name: "address1" }, { type: "address", name: "address2" }, { type: "uint256", name: "uint" }],
    "0x06": [{ type: "address", name: "address1" }, { type: "address", name: "address2" }, { type: "uint256", name: "uint" }],
    "0x08": [{ type: "address", name: "address" }, { type: "uint256", name: "uint1" }, { type: "uint256", name: "uint2" }, { type: "address[]", name: "addresses" }, { type: "bool", name: "bool" }],
    "0x09": [{ type: "address", name: "address" }, { type: "uint256", name: "uint1" }, { type: "uint256", name: "uint2" }, { type: "address[]", name: "addresses" }, { type: "bool", name: "bool" }],
    "0x0a": [{ type: "IAllowanceTransfer.PermitSingle", name: "permitSingle" }, { type: "bytes", name: "bytes" }],
    "0x0b": [{ type: "address", name: "address" }, { type: "uint256", name: "uint" }],
    "0x0c": [{ type: "address", name: "address" }, { type: "uint256", name: "uint" }],
    // Add other commands and their inputs as necessary
};

export function updateInputs(command, inputFields) {
    const inputs = commandInputs[command];
    inputFields.innerHTML = ""; // Clear previous inputs
    
    inputs.forEach((input, index) => {
        const label = document.createElement("label");
        label.textContent = `${input}:`;
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.id = `input_${index}`;
        inputField.name = `input_${index}`;
        inputFields.appendChild(label);
        inputFields.appendChild(inputField);
        inputFields.appendChild(document.createElement("br"));
    });
}

export function generateBytecode(command, inputFields) {
    const inputs = commandInputs[command];
    console.log('generateBytecode inputs:', inputs);
    console.log('generateBytecode inputFields:', inputFields);

    // Convert string '0' or '1' to boolean false or true for inputs of type 'bool'
    const convertedInputFields = inputFields.map((field, index) => {
        if (inputs[index].type === 'bool') {
            return Boolean(Number(field));
        } else if (inputs[index].type === 'address[]') {
            return field.split(" ");
        } else {
            return field;
        }
    });

    const encodedParams = encodeAbiParameters(inputs, convertedInputFields);
    const bytecode1 = `0x${command}`;
    const bytecode2 = `${encodedParams.slice(2)}`; // Remove the '0x' from the start of the encoded params
    return { bytecode1, bytecode2 };
}

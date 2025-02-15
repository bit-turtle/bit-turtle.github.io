// WDR Paper Computer Emulator

// Instruction descriptor
const STP = 0;
const ISZ = 1;
const JMP = 2;
const INC = 3;
const DEC = 4;
class Instruction {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
  }
}

class Program {
  constructor(code, registers = 32) {
    // Create Counter
    this.counter = 0;
    this.cycles = 0;
    // Initialize Code String
    this.code = "";
    // Initialize Flags
    this.running = true;
    // Initialize Registers
    this.registers = Array(registers);
    // Reset to Default
    this.reset();
    // Compile code
    this.instructions = [];
    // Loop through lines
    var lines = code.split("\n");
    for (var line in lines) {
      try {
        this.compile(lines[line]);
      }
      catch (error) {
        throw "Error on Line " + line + ": " + error;
      }
    }
  }
  reset() { this.running = true; this.counter = 0; this.cycles = 0; this.registers.fill(0); }
  instruction() { return (this.counter < this.instructions.length) ? this.instructions[this.counter] : Instruction(STP); }
  compile(line) {
    // Separate out comments and split by spaces and make non case sensitive
    var token = line.toLowerCase().split("#")[0].split(" ");
    // Get Instruction
    var instruction = token[0];
    var value = parseInt(token[1]);
    // Skip if empty
    if (instruction == "") return;
    // Encode instruction
    switch (instruction) {
      case "stp":
        this.instructions.push(new Instruction(STP));
        this.code += "stp\n";
        break;
      case "isz":
        if (isNaN(value)) throw "Expected Number as Register Operand";
        this.instructions.push(new Instruction(ISZ, value));
        this.code += "isz "+value+"\n";
        break;
      case "jmp":
        if (isNaN(value)) throw "Expected Number as Address Operand";
        this.instructions.push(new Instruction(JMP, value));
        this.code += "jmp "+value+"\n";
        break;
      case "inc":
        if (isNaN(value)) throw "Expected Number as Register Operand";
        this.instructions.push(new Instruction(INC, value));
        this.code += "inc "+value+"\n";
        break;
      case "dec":
        if (isNaN(value)) throw "Expected Number as Register Operand";
        this.instructions.push(new Instruction(DEC, value));
        this.code += "dec "+value+"\n";
        break;
      default:
        throw "Unknown Instruction: " + "\"" + token[0] + "\"";
    }
  }
  clock() {
    // Skip if not running
    if (!this.running) return;
    // Process instruction
    this.cycles ++;
    switch (this.instruction().type) {
      case STP:
        this.running = false;
        break;
      case ISZ:
        if (this.registers[this.instruction.value] == 0)
          this.counter += 2;
        else
          this.counter ++;
        break;
      case JMP:
        this.counter = this.instruction().value;
        break;
      case INC:
        this.registers[this.instruction().value] ++;
        this.counter ++;
        break;
      case DEC:
        this.registers[this.instruction.value] --;
        this.counter ++;
        break;
    }
  }
}
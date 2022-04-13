//@ts-check
const Wasm = require("./main.js");
const { performance } = require("perf_hooks");

Wasm.onRuntimeInitialized = () => {
  const index = new DataSet(6, "int");
  const position = new DataSet(6 * 3, "float");

  Wasm._read(index.byteOffset, index.length, position.byteOffset, position.length);

  const newIndexSize = Wasm._getTriangeSize();
  const newPositionSize = Wasm._getVertexSize();

  Wasm._fill(index.byteOffset, position.byteOffset);

  // get result
  const newIndex = new Int32Array(index.buffer, index.byteOffset, newIndexSize);

  const newPosition = new Float32Array(
    position.buffer,
    position.byteOffset,
    newPositionSize
  );

  // Free memory
  Wasm._free(index.byteOffset);
  Wasm._free(position.byteOffset);
};

/**
 * helper class to deal with allocating array
 */
class DataSet {
  /**
   *
   * @param {number} length
   * @param {'float' | 'int'} type
   */
  constructor(length, type) {
    this.length = length;
    this.type = type;
    if (type === "int") {
      this.array = new Int32Array(this.length);
    } else {
      this.array = new Float32Array(this.length);
    }

    this.byteSize = this.array.length * this.array.BYTES_PER_ELEMENT;
    this.ptr = Wasm._malloc(this.byteSize);
    this.heap = new Uint8Array(Wasm.HEAP8.buffer, this.ptr, this.byteSize);
    this.heap.set(new Uint8Array(this.array.buffer));
  }

  get byteOffset() {
    return this.heap.byteOffset;
  }

  get buffer() {
    return this.heap.buffer;
  }
}

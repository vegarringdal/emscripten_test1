//@ts-check
const wasm = require("./main.js");
const { performance } = require("perf_hooks");

wasm.onRuntimeInitialized = () => {
  const index = new DataSet(6, "int");
  const position = new DataSet(6 * 3, "float");

  wasm._read(
    index.byteOffset,
    index.length,
    position.byteOffset,
    position.length
  );

  {
    const newIndexSize = wasm._getTriangeSize();
    const newPositionSize = wasm._getVertexSize();
    console.log(newIndexSize, newPositionSize);
  }

  wasm._simplify_mesh(10, 7, true);
  wasm._fill(index.byteOffset, position.byteOffset);

  {
    // check if we have filled it
    const newIndexSize = wasm._getTriangeSize();
    const newPositionSize = wasm._getVertexSize();
    console.log(newIndexSize, newPositionSize);
  }

  wasm._simplify_mesh(50, 5, true);
  wasm._free(index.byteOffset);
  wasm._free(position.byteOffset);

  {
    const newIndexSize = wasm._getTriangeSize();
    const newPositionSize = wasm._getVertexSize();
    const index = new DataSet(newIndexSize * 3, "int", wasm);
    const position = new DataSet(newPositionSize * 3, "float", wasm);

    wasm._fill(index.byteOffset, position.byteOffset);

    // get result
    const newIndex = new Int32Array(
      index.buffer,
      index.byteOffset,
      newIndexSize * 3
    );

    const newPosition = new Float32Array(
      position.buffer,
      position.byteOffset,
      newPositionSize * 3
    );
    wasm._free(index.byteOffset);
    wasm._free(position.byteOffset);
    return [newIndex, newPosition];
  }
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
  constructor(length, type, wasmx) {
    this.length = length;
    this.type = type;
    if (type === "int") {
      this.array = new Int32Array(this.length);
    } else {
      this.array = new Float32Array(this.length);
    }

    this.byteSize = this.array.length * this.array.BYTES_PER_ELEMENT;
    this.ptr = wasmx._malloc(this.byteSize);
    this.heap = new Uint8Array(wasmx.HEAP8.buffer, this.ptr, this.byteSize);
  }

  updateHeap() {
    this.heap.set(new Uint8Array(this.array.buffer));
  }

  get byteOffset() {
    return this.heap.byteOffset;
  }

  get buffer() {
    return this.heap.buffer;
  }
}

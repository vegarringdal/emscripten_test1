//@ts-check
const wasm = require("./main.js");
const { performance } = require("perf_hooks");

wasm.onRuntimeInitialized = () => {
  // add holder for data
  const index = new DataSet(6, "int", wasm);
  const position = new DataSet(6 * 3, "float", wasm);

  // add data
  for (let i = 0; i < 6; i++) {
    index.array[i] = i;
  }

  for (let i = 0; i < 6 * 3; i++) {
    position.array[i] = i;
  }

  // update heap
  index.updateHeap();
  position.updateHeap();

  // read heap
  wasm._read(
    index.byteOffset,
    index.length,
    position.byteOffset,
    position.length
  );

  // check before we have simplified it
  const newIndexSize0 = wasm._getTriangeSize();
  const newPositionSize0 = wasm._getVertexSize();
  console.log("before:", newIndexSize0, newPositionSize0);

  // wasm._simplify_mesh(10, 7, true);
  wasm._free(index.byteOffset);
  wasm._free(position.byteOffset);

  // check after we have simplified it
  const newIndexSize1 = wasm._getTriangeSize();
  const newPositionSize1 = wasm._getVertexSize();
  console.log("after:", newIndexSize1, newPositionSize1);

  // new array to get data back, with new size
  const index2 = new DataSet(newIndexSize1 * 3, "int", wasm);
  const position2 = new DataSet(newPositionSize1 * 3, "float", wasm);

  wasm._fill(index2.byteOffset, position2.byteOffset);

  // get result
  const newIndex = new Int32Array(
    index2.buffer,
    index2.byteOffset,
    newIndexSize1 * 3
  );

  const newPosition = new Float32Array(
    position2.buffer,
    position2.byteOffset,
    newPositionSize1 * 3
  );
  wasm._free(index2.byteOffset);
  wasm._free(position2.byteOffset);

  //return [newIndex2, newPosition2];
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

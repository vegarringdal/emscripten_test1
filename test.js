//@ts-check
const wasm = require("./main.js");
const { performance } = require("perf_hooks");

wasm.onRuntimeInitialized = () => {
  const length = 12;
  // add holder for data
  const index = new DataSet(length, "int", wasm);
  const position = new DataSet(length * 3, "float", wasm);

  // add data
  for (let i = 0; i < length; i++) {
    index.array[i] = i;
  }

  for (let i = 0; i < length * 3; i++) {
    if (i === 3 || i === 4 || i === 5) {
      if (i === 3) {
        position.array[i] = 0;
      }
      if (i === 4) {
        position.array[i] = 1;
      }
      if (i === 5) {
        position.array[i] = 2;
      }
    } else {
      position.array[i] = i;
    }
  }

  // update heap
  index.updateHeap();
  position.updateHeap();

  // read heap
  wasm._read(
    index.byteOffset,
    index.length,
    position.byteOffset,
    position.length,
    true
  );

  // check before we have simplified it
  const newIndexSize0 = wasm._getTriangeSize();
  const newPositionSize0 = wasm._getVertexSize();
  console.log("before:", newIndexSize0, newPositionSize0);

  const newIndex = new Uint32Array(
    index.buffer,
    index.byteOffset,
    newIndexSize0 * 3
  );

  const newPosition = new Float32Array(
    position.buffer,
    position.byteOffset,
    newPositionSize0 * 3
  );

  /*   wasm._simplify_mesh(parseInt(newIndexSize0 * 0.5), 7, true);  */

  // check after we have simplified it
  const newIndexSize1 = wasm._getTriangeSize();
  const newPositionSize1 = wasm._getVertexSize();
  console.log("after:", newIndexSize1, newPositionSize1);

  // new array to get data back, with new size
  const index2 = new DataSet(newIndexSize1 * 3, "int", wasm);
  const position2 = new DataSet(newPositionSize1 * 3, "float", wasm);

  wasm._fill(index2.byteOffset, position2.byteOffset, true);

  // get result
  const newIndex2 = new Uint32Array(
    index2.buffer,
    index2.byteOffset,
    newIndexSize1 * 3
  );

  const newPosition2 = new Float32Array(
    position2.buffer,
    position2.byteOffset,
    newPositionSize1 * 3
  );

  console.log("new", newIndex2); // 10104, 10104, 2, 3, 4, 5, 6, 7, 40, wtf ???!?!
  console.log("old", newIndex); // 0, 1, 2, 3, 4, 5, 6, 7, 8
  console.log("new", newPosition2);
  console.log("old", newPosition);

  // if I free before it all gets messed up
  wasm._free(index2.byteOffset);
  wasm._free(position2.byteOffset);
  wasm._free(index.byteOffset);
  wasm._free(position.byteOffset);

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
      this.array = new Uint32Array(this.length);
    } else {
      this.array = new Float32Array(this.length);
    }

    this.byteSize = this.array.length * this.array.BYTES_PER_ELEMENT;
    this.ptr = wasmx._malloc(this.byteSize);
    this.heap = new Int8Array(wasmx.HEAP8.buffer, this.ptr, this.byteSize);
  }

  updateHeap() {
    this.heap.set(new Int8Array(this.array.buffer));
  }

  get byteOffset() {
    return this.heap.byteOffset;
  }

  get buffer() {
    return this.heap.buffer;
  }
}

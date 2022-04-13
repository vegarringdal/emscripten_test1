const m = require("./main.js");
const { performance } = require("perf_hooks");


class DataSet{

  /**
   * 
   * @param {number} length 
   * @param {'float' | 'int'} type 
   */
  constructor(length, type){

    this.length = length;
    this.type = type;
    if(type === "int"){
      this.array = new Int32Array(this.length);
    } else {
      this.array = new Float32Array(this.length);
    }

    this.byteSize = this.array.length * this.array.BYTES_PER_ELEMENT;
    this.ptr = m._malloc(this.byteSize);
    this.heap = new Uint8Array(m.HEAP8.buffer,  this.ptr, this.byteSize);
    this.heap.set(new Uint8Array(this.array.buffer));

  }
}


m.onRuntimeInitialized = () => {
 
  const index = new DataSet(6, 'int');
  const position = new DataSet(6*3, 'positions');

  m._read(index.heap.byteOffset, index.length, position.heap.byteOffset, position.length);

  const newIndexSize = m._getTriangeSize();
  const newPositionSize = m._getVertexSize()

  m._fill(index.heap.byteOffset, position.heap.byteOffset);

  // get result
  const newIndex = new Int32Array(
    index.heap.buffer,
    index.heap.byteOffset,
    index.length
  );

  const newPosition = new Float32Array(
    position.heap.buffer,
    position.heap.byteOffset,
    position.length
  );


  // Free memory
  m._free(index.heap.byteOffset);
  m._free(position.heap.byteOffset);


};

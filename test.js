const m = require("./main.js");

m.onRuntimeInitialized = () => {
  // create array
  const length = 5000;
  const data = new Float32Array(length);
  const bytes = data.length + data.BYTES_PER_ELEMENT;

  // pointer
  const dataPtr = m._malloc(bytes);

  // allocate/copy
  const dataHeap = new Uint32Array(m.HEAPU32.buffer, dataPtr, bytes);
  dataHeap.set(new Uint32Array(data.buffer));

  // call
  m._fill_float_array(dataHeap.byteOffset, length);

  // get result
  const result = new Float32Array(
    dataHeap.buffer,
    dataHeap.byteOffset,
    data.length
  );
  console.log(result);

  // Free memory
  m._free(dataHeap.byteOffset);
};

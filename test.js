const m = require("./main.js");
const { performance } = require("perf_hooks");

m.onRuntimeInitialized = () => {
  // create array
  const length = 500_000_000; // ALLOW_MEMORY_GROWTH -s MAXIMUM_MEMORY=4GB looks like these dont do anything.. probably will never need it, but still.
  const data = new Float32Array(length);
  const bytes = data.length * data.BYTES_PER_ELEMENT;
  console.log(4_294_967_295 - bytes);
  console.log(bytes / 1_000_000_000, "GB");
  console.log(4_294_967_295 < bytes);

  // pointer
  const t1 = performance.now();
  const dataPtr = m._malloc(bytes);
  const usedTime1 = performance.now() - t1;

  // allocate/copy
  const dataHeap = new Uint8Array(m.HEAP8.buffer, dataPtr, bytes);

  const usedTime2 = performance.now() - t1;

  dataHeap.set(new Uint8Array(data.buffer));

  const usedTime3 = performance.now() - t1;

  // call
  m._fill_float_array(dataHeap.byteOffset, length);

  const usedTime4 = performance.now() - t1;

  // get result
  const result = new Float32Array(
    dataHeap.buffer,
    dataHeap.byteOffset,
    data.length
  );

  const usedTime5 = performance.now() - t1;
  console.log(result);
  console.log(result.length);
  console.log(usedTime1);
  console.log(usedTime2);
  console.log(usedTime3);
  console.log(usedTime4);
  console.log(usedTime5);

  // Free memory
  m._free(dataHeap.byteOffset);
};

import "@testing-library/jest-dom";

// jsdom does not implement URL.createObjectURL / revokeObjectURL
if (typeof URL.createObjectURL === "undefined") {
  Object.defineProperty(URL, "createObjectURL", {
    writable: true,
    configurable: true,
    value: jest.fn(() => "blob:mock-default"),
  });
}
if (typeof URL.revokeObjectURL === "undefined") {
  Object.defineProperty(URL, "revokeObjectURL", {
    writable: true,
    configurable: true,
    value: jest.fn(),
  });
}

// Подавляем React Router warnings в тестах
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes("React Router Future Flag Warning")) {
    return;
  }
  originalWarn(...args);
};

export const mockFetchSuccess = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    })
  );
};

export const mockFetchError = (
  status = 500,
  message = "Internal Server Error"
) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: status,
      json: () =>
        Promise.resolve({
          detail: message,
          message: message,
        }),
    })
  );
};

export const mockNetworkError = () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));
};

// Мокаем console.error для тестов
export const mockConsole = () => {
  const originalError = console.error;
  console.error = jest.fn();

  return () => {
    console.error = originalError;
  };
};

// Функция для очистки моков
export const resetMocks = () => {
  if (global.fetch && global.fetch.mockClear) {
    global.fetch.mockClear();
  }
};

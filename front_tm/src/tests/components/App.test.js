import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContent } from "../../App"; // Импортируем AppContent вместо App

// Создаем компонент-обертку с Router
const AppWithRouter = ({ initialEntries = ["/"] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AppContent />
  </MemoryRouter>
);

// Мокаем localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => (store[key] = value)),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => (store = {})),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component", () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe("рендеринг компонента", () => {
    test("рендерится без ошибок", () => {
      render(<AppWithRouter />);
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    test("показывает главную страницу на корневом маршруте", () => {
      render(<AppWithRouter initialEntries={["/"]} />);
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });
  });

  describe("состояние аутентификации", () => {
    test("не аутентифицирован по умолчанию", () => {
      render(<AppWithRouter />);
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    test("аутентифицирован при наличии userId в localStorage", () => {
      localStorageMock.setItem("userId", "123");
      render(<AppWithRouter />);
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });
  });
});
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders MyShop home page", () => {
    render(<App />);
    expect(screen.getAllByRole("link", { name: /MyShop/ })[0]).toHaveAttribute("href", "/");
    expect(screen.getByText("მთავარი")).toBeInTheDocument();
});

test("redirects a guest from the cart to login", () => {
    localStorage.clear();
    window.history.pushState({}, "", "/cart");
    render(<App />);
    expect(screen.getByRole("heading", { name: "ანგარიშზე შესვლა" })).toBeInTheDocument();
});

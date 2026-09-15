import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageModal from "./ImageModal";

test("opens and closes the product image modal", () => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true }
    HTMLDialogElement.prototype.close = function () {
        this.open = false
        this.dispatchEvent(new Event("close"))
    }
    const onClose = jest.fn()

    render(<ImageModal src="/product.jpg" alt="მაგიდა" onClose={onClose} />)
    expect(screen.getByRole("dialog", { name: /მაგიდა/ })).toBeVisible()

    fireEvent.click(screen.getByRole("button", { name: "დახურვა" }))
    expect(onClose).toHaveBeenCalledTimes(1)
})

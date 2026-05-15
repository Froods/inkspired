import { render, screen, fireEvent } from '@testing-library/react';
import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
	beforeAll,
	afterAll,
} from 'vitest';
import GeneratedTattooDisplay from '@/components/GeneratedTattooDisplay';

describe('GeneratedTattooDisplay', () => {
	// Mock HTMLDialogElement methods
	beforeAll(() => {
		HTMLDialogElement.prototype.showModal = vi.fn(function (
			this: HTMLDialogElement,
		) {
			this.setAttribute('open', '');
		});
		HTMLDialogElement.prototype.close = vi.fn(function (
			this: HTMLDialogElement,
		) {
			this.removeAttribute('open');
		});
	});

	afterAll(() => {
		// Clean up mocks to avoid polluting other tests
		// @ts-ignore
		delete HTMLDialogElement.prototype.showModal;
		// @ts-ignore
		delete HTMLDialogElement.prototype.close;
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders nothing when isOpen is false', () => {
		const { container } = render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={false}
				errorStatus={null}
				isOpen={false}
				onClose={vi.fn()}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders and opens dialog when isOpen is true', () => {
		render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={false}
				errorStatus={null}
				isOpen={true}
				onClose={vi.fn()}
			/>,
		);

		// Since we mocked showModal to set the open attribute, it should be visible
		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();
		expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

		const closeButton = screen.getByRole('button', { name: /close/i });
		expect(closeButton).toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		const onCloseMock = vi.fn();
		render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={false}
				errorStatus={null}
				isOpen={true}
				onClose={onCloseMock}
			/>,
		);

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});

	it('calls onClose when Escape key is pressed (cancel event)', () => {
		const onCloseMock = vi.fn();
		render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={false}
				errorStatus={null}
				isOpen={true}
				onClose={onCloseMock}
			/>,
		);

		const dialog = screen.getByRole('dialog');
		// Fire 'cancel' event manually to simulate Escape key behavior on <dialog>
		fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));

		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});

	it('displays loading state', () => {
		render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={true}
				errorStatus={null}
				isOpen={true}
				onClose={vi.fn()}
			/>,
		);
		expect(
			screen.getByText(/Inkspired AI is dreaming up your design/i),
		).toBeInTheDocument();
	});

	it('displays error state', () => {
		const errorMessage = 'Something went wrong';
		render(
			<GeneratedTattooDisplay
				imageStatus={null}
				loadingStatus={false}
				errorStatus={errorMessage}
				isOpen={true}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it('displays generated image', () => {
		const imageUrl = 'http://example.com/tattoo.png';
		render(
			<GeneratedTattooDisplay
				imageStatus={imageUrl}
				loadingStatus={false}
				errorStatus={null}
				isOpen={true}
				onClose={vi.fn()}
			/>,
		);

		const img = screen.getByRole('img', { name: /Generated Tattoo/i });
		expect(img).toHaveAttribute('src', imageUrl);

		const downloadLink = screen.getByRole('link', { name: /Download Design/i });
		expect(downloadLink).toHaveAttribute('href', imageUrl);
	});
});

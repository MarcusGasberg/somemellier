import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}

export function useColumnWidth() {
	const [columnWidth, setColumnWidth] = React.useState(200);

	React.useEffect(() => {
		const updateColumnWidth = () => {
			setColumnWidth(window.innerWidth < MOBILE_BREAKPOINT ? 120 : 200);
		};

		updateColumnWidth();
		window.addEventListener("resize", updateColumnWidth);
		return () => window.removeEventListener("resize", updateColumnWidth);
	}, []);

	return columnWidth;
}

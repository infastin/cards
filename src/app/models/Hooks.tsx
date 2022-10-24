import React, {useEffect} from "react";

export function useStateCallback<T>(initState: T): [T, (state: T, cb?: (state: T) => void) => void] {
	const [state, setState] = React.useState<T>(initState);
	const cbRef = React.useRef<(state: T) => void>(undefined);

	const setStateCallback = React.useCallback((state: T, cb?: (state: T) => void) => {
		cbRef.current = cb;
		setState(state);
	}, []);

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state);
			cbRef.current = undefined;
		}
	}, [state]);

	return [state, setStateCallback]
}

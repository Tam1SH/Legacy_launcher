/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useRef, useState } from "react"
import UserData from "./ReturnTypes/UserData"

export function debounce<Params extends any[]>(
	func: (...args: Params) => any,
	timeout: number,
): (...args: Params) => void {
	let timer: NodeJS.Timeout
	return (...args: Params) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func(...args)
		}, timeout)
	}
}

export const throttle = (fn: Function, wait = 300) => {
	let inThrottle: boolean;
		let lastFn: ReturnType<typeof setTimeout>;
		let lastTime: number;
	return function (this: any) {
		const context = this;
			const args = arguments;
		if (!inThrottle) {
			fn.apply(context, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(() => {
				if (Date.now() - lastTime >= wait) {
					fn.apply(context, args);
					lastTime = Date.now();
				}
			}, Math.max(wait - (Date.now() - lastTime), 0));
		}
	};
};

export const useComponentWillUnmount = (callback: () => void) => {
    const mem = useRef<() => void>();

    useEffect(() => {
        mem.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            const func = mem.current as () => void;
            func();
        };
    }, []);
};

export const useComponentWillMount = (cb : any) => {
    const willMount = useRef(true)

    if (willMount.current) cb()

    willMount.current = false
}

export function parseJwt(token : string) : UserData {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
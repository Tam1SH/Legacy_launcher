import { either } from "fp-ts";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

export default class Result<T, E> {
	self: Either<T, E>

	constructor(result : Either<T, E>) {
		this.self = result
	}

	match<Result>(left : (left : T) => Result, right : (right : E) => Result) {
		return pipe(this.self, either.match(left, right))
	}

	left() {
		return pipe(this.self, either.match((e) => e, () => undefined))
	}
	
	resultWithThrow() : T | never {
		let left : (left_ : T) => T = (_) => _
		let right : (left_ : E) => never = (_) => {throw _}
		return pipe(this.self, either.match(left, right))
	}
	
}
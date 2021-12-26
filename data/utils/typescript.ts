/**
 * Utilities related to TypeScript.
 *
 * Use sparingly. These can be hacky.
 */

/**
 * A type that requires the generic type's keys to be enumerated.
 */
export type KeysEnum<T> = { [P in keyof Required<T>]: true };

/**
 * A JSON primitive not including aggregate types.
 */
export type Primitive = string | number | boolean | null | undefined;

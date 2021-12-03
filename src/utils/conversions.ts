import { Context, Errors, ValidationError } from "io-ts";

const getContextPath = (context: Context): string => {
  if (context.length === 0) {
    return "] (decoder info n/a)";
  }
  const keysPath = context.map(({ key }) => key).join(".");
  const lastType = context[context.length - 1].type;

  if ("never" === lastType.name) {
    return `${keysPath}] is not a known property`;
  }

  return `${keysPath}] is not a valid [${lastType.name}]`;
};

const getMessage = (value: unknown, context: Context): string =>
  `value [${JSON.stringify(value)}] at [root${getContextPath(context)}`;

export const errorsToReadableMessages = (
  es: ReadonlyArray<ValidationError>
): ReadonlyArray<string> => es.map((e) => getMessage(e.value, e.context));

export function errorsToError(errors: Errors): Error {
  return new Error(errorsToReadableMessages(errors).join(" / "));
}

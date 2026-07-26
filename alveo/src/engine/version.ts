/**
 * The engine version, stamped on every persisted artefact.
 *
 * Bump the minor when a coefficient changes, the major when a term is added or
 * removed. A bake logged under 1.x must stay interpretable as a 1.x bake after
 * the calibration loop moves the model — that is what makes ten thousand
 * historical bake logs an asset instead of a liability.
 */
export const ENGINE_VERSION = '1.0.0';

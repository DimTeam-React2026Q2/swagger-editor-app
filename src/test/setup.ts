import "@testing-library/jest-dom";

// jsdom doesn't implement scrollIntoView; stub it so components that scroll
// to results after an action don't throw during tests.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = (): void => {};
}

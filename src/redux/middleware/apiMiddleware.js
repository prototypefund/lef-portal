export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  return next(action);
};

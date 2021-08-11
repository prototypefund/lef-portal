import { LefSpinner } from "./LefSpinner";

export const SpinnerWrapper = ({
  loading = false,
  children,
  spinnerProps = {},
}) => {
  return loading ? (
    <LefSpinner {...spinnerProps} />
  ) : children ? (
    children
  ) : (
    <></>
  );
};

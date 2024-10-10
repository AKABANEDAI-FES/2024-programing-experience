export const ConditionalWrapper = ({
  isRendering,
  children,
}: {
  isRendering: boolean;
  children: React.ReactNode;
}) => (isRendering ? <>{children}</> : null);

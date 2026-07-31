export function LoadingSpinner() {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-muted border-t-gold-primary" />
    </div>
  );
}


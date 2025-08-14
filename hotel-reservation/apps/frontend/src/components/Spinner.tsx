export function Spinner() {
  return (
    <div className="flex justify-center items-center py-10"
     role="status"
      aria-label="Cargando"
      >
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

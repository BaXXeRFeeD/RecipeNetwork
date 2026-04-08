function Loader({ label = 'Загрузка' }) {
  return (
    <div className="glass-panel flex min-h-[180px] items-center justify-center rounded-xl px-6 py-10">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        {label}
      </div>
    </div>
  );
}

export default Loader;

function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel rounded-xl px-6 py-10 text-center">
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

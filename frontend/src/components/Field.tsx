function Field({ label, value, onChange, placeholder, textarea }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/30 uppercase tracking-widest">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="input-field resize-node"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field resize-node"
        />
      )}
    </div>
  );
}

export default Field;

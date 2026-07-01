const Input = ({ isDark, onChange, id, checked, disabled }) => {
  return (
    <input
      onChange={onChange}
      id={id}
      checked={checked}
      disabled={disabled}
      type="checkbox"
      className={`h-6 w-6 cursor-pointer rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark
          ? "border-slate-600 bg-slate-950 accent-slate-100 focus:ring-slate-400 focus:ring-offset-slate-900"
          : "border-slate-300 bg-white accent-slate-900 focus:ring-slate-400 focus:ring-offset-white"
      }`}
    />
  );
};

export default Input;

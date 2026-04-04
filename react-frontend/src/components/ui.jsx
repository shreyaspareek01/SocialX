/* Shared primitive UI components */

export function Card({ children, className = '', wide = false }) {
  return (
    <div className={`card-shine relative bg-[#0d140d] border border-[#1a3a1a] hover:border-[rgba(0,255,65,0.27)] hover:shadow-[0_0_20px_rgba(0,255,65,0.06)] transition-all duration-300 overflow-hidden ${wide ? 'col-span-2' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1a3a1a] bg-[rgba(0,255,65,0.03)]">
      {children}
    </div>
  );
}

export function CardBody({ children }) {
  return (
    <div className="px-4 py-4 flex flex-col gap-2.5">
      {children}
    </div>
  );
}

const METHOD_STYLES = {
  GET:    'text-[#00d4ff] border-[#00d4ff] [text-shadow:0_0_8px_#00d4ff88]',
  POST:   'text-[#00ff41] border-[#00ff41] [text-shadow:0_0_8px_#00ff4188]',
  PUT:    'text-[#ffb000] border-[#ffb000] [text-shadow:0_0_8px_#ffb00088]',
  DELETE: 'text-[#ff3c3c] border-[#ff3c3c] [text-shadow:0_0_8px_#ff3c3c88]',
};

export function MethodBadge({ method }) {
  return (
    <span className={`font-[family-name:var(--font-pixel)] text-[8px] px-2 py-1 border tracking-wider ${METHOD_STYLES[method] || ''}`}>
      {method === 'DELETE' ? 'DEL' : method}
    </span>
  );
}

export function EndpointLabel({ children }) {
  return <span className="text-[#4a7a4a] text-xs">{children}</span>;
}

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] text-[#4a7a4a] tracking-wider -mb-1">
      {children}
    </label>
  );
}

export function RetroInput({ id, type = 'text', placeholder, value, onChange, min }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      autoComplete="off"
      className="bg-[#060e06] border border-[#1a3a1a] text-[#00ff41] font-[family-name:var(--font-mono)] text-[13px] px-3 py-2 w-full outline-none transition-all duration-200 focus:border-[#00b32d] focus:shadow-[0_0_0_1px_#00b32d,inset_0_0_12px_rgba(0,255,65,0.05)] placeholder:text-[#2a4a2a] caret-[#00ff41]"
    />
  );
}

export function RetroTextarea({ id, placeholder, value, onChange }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={3}
      className="bg-[#060e06] border border-[#1a3a1a] text-[#00ff41] font-[family-name:var(--font-mono)] text-[13px] px-3 py-2 w-full outline-none transition-all duration-200 focus:border-[#00b32d] focus:shadow-[0_0_0_1px_#00b32d,inset_0_0_12px_rgba(0,255,65,0.05)] placeholder:text-[#2a4a2a] caret-[#00ff41] resize-y min-h-[80px]"
    />
  );
}

export function RetroCheckbox({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-[10px] text-[#4a7a4a] tracking-wider">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[#00ff41] w-4 h-4 cursor-pointer"
      />
      {label}
    </label>
  );
}

const BTN_VARIANTS = {
  green:  'text-[#00ff41] border-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_8px_#00ff4188,0_0_20px_#00ff4133]',
  blue:   'text-[#00d4ff] border-[#00d4ff] hover:bg-[#00d4ff] hover:text-black hover:shadow-[0_0_8px_#00d4ff88,0_0_20px_#00d4ff33]',
  yellow: 'text-[#ffe44d] border-[#ffe44d] hover:bg-[#ffe44d] hover:text-black hover:shadow-[0_0_8px_#ffb00088,0_0_20px_#ffb00033]',
  red:    'text-[#ff3c3c] border-[#ff3c3c] hover:bg-[#ff3c3c] hover:text-black hover:shadow-[0_0_8px_#ff3c3c88,0_0_20px_#ff3c3c33]',
};

export function RetroButton({ children, onClick, variant = 'green', small = false, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-[family-name:var(--font-pixel)] border transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${small ? 'text-[8px] px-3 py-1.5' : 'text-[9px] px-4 py-2.5'} tracking-wider ${BTN_VARIANTS[variant]}`}
    >
      {children}
    </button>
  );
}

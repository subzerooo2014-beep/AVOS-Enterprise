'use client';

import { useState } from 'react';

export function AskAvos() {
  const [value, setValue] = useState('');

  return (
    <aside className="ask-avos">
      <div>
        <strong>Ask AVOS</strong>
        <small>AI experience foundation</small>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setValue('');
        }}
      >
        <input
          aria-label="اسأل AVOS"
          onChange={(event) => setValue(event.target.value)}
          placeholder="اسأل عن المنصة أو القدرات..."
          value={value}
        />
        <button type="submit">إرسال</button>
      </form>
    </aside>
  );
}
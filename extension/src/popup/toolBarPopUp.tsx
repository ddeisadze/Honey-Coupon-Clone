import React from 'react';
import { createRoot } from 'react-dom/client';

const test = <h1>Hello World</h1>

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(test);

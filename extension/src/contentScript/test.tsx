import React from 'react';
import { createRoot } from 'react-dom/client';
import EntryButton from './entryButton';
import { TikTokVideo } from './TikTokVideo';

document.getElementsByTagName("body")[0].style = "height:1200px";
const entryButtonappContainer = document.createElement('div');
entryButtonappContainer.id = "container";

const entryButtonRoot = createRoot(entryButtonappContainer)

document.body.appendChild(entryButtonappContainer)

entryButtonappContainer.style.cssText = "position: fixed; bottom:5%; right:0; z-index: 99 !important;";

entryButtonRoot.render(<EntryButton size={100} />);
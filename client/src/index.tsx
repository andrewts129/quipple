import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './ErrorBoundary';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary />
    </React.StrictMode>,
    document.getElementById('root')
);

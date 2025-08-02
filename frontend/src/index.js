import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // Ensure you import your CSS styles if any

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

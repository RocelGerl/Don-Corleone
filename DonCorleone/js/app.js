// ============================================
// DON CORLEONE - APP PRINCIPAL
// ============================================

import { state } from './core/state.js';
import { render } from './core/render.js';
import { cargarState, guardarState } from './utils/helpers.js';
import './core/events.js';

// ============================================
// INICIALIZAR
// ============================================
function init() {
    // Cargar estado guardado
    const savedState = cargarState('state', null);
    if (savedState) {
        Object.assign(state, savedState);
    }
    
    // Renderizar
    render();
    
    // Guardar estado al cerrar
    window.addEventListener('beforeunload', () => {
        guardarState('state', state);
    });
    
    // Guardar cada 30 segundos
    setInterval(() => {
        guardarState('state', state);
    }, 30000);
}

// ============================================
// INICIAR APP
// ============================================
document.addEventListener('DOMContentLoaded', init);
// ============================================
// DON CORLEONE - MOTOR DE RENDERIZADO
// ============================================

import { state } from './state.js';
import { Header } from '../components/Header.js';
import { Lobby } from '../components/Lobby.js';
import { Sala } from '../components/Sala.js';
import { Ruleta } from '../components/Ruleta.js';
import { Historial } from '../components/Historial.js';
import { Perfil } from '../components/Perfil.js';

const root = document.getElementById('root');

// ============================================
// RENDER
// ============================================
export function render() {
    root.innerHTML = '';
    root.appendChild(Header());
    
    const main = document.createElement('main');
    main.className = 'container py-4';
    
    try {
        switch (state.ui.vista) {
            case 'lobby':
                main.appendChild(Lobby());
                break;
            case 'sala':
                main.appendChild(Sala());
                break;
            case 'ruleta':
                main.appendChild(Ruleta());
                break;
            case 'historial':
                main.appendChild(Historial());
                break;
            case 'perfil':
                main.appendChild(Perfil());
                break;
            default:
                main.appendChild(Lobby());
        }
    } catch (error) {
        console.error('Error renderizando:', error);
        main.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: var(--red);"></i>
                <h4 class="text-secondary mt-3">Error al cargar la vista</h4>
                <p class="text-muted">${error.message}</p>
                <button class="btn-primary-casino mt-3" onclick="window.navegar('lobby')">Volver al lobby</button>
            </div>
        `;
    }
    
    root.appendChild(main);
}

// ============================================
// NAVEGAR
// ============================================
export function navegar(vista, data = null) {
    if (vista === 'sala' && data) {
        state.salaActiva = data;
    }
    state.ui.vista = vista;
    
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) modalBackdrop.remove();
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
    
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ACTUALIZAR ESTADO
// ============================================
export function actualizarState(nuevoState) {
    Object.assign(state, nuevoState);
    render();
}

// Exponer al window
window.navegar = navegar;
window.actualizarState = actualizarState;

export { render as default };
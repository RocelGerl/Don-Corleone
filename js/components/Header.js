// ============================================
// DON CORLEONE - HEADER
// ============================================

import { state } from '../core/state.js';
import { formatearMoneda } from '../utils/helpers.js';

export function Header() {
    const header = document.createElement('header');
    header.className = 'header-don';
    
    header.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <a href="#" class="logo" onclick="window.navegar('lobby')">
                    🎩 Don <span>Corleone</span>
                </a>
                
                <div class="d-flex align-items-center gap-3">
                    <div class="saldo-box">
                        <div class="label">Saldo</div>
                        <div class="monto">${formatearMoneda(state.user.saldo)}</div>
                    </div>
                    
                    <button class="btn-outline-casino d-none d-sm-inline-block" onclick="window.navegar('perfil')" style="padding: 8px 16px;">
                        <i class="bi bi-person"></i>
                    </button>
                    
                    <button class="btn-outline-casino d-sm-none" onclick="window.navegar('perfil')" style="padding: 6px 12px; font-size: 0.8rem;">
                        <i class="bi bi-person"></i>
                    </button>
                </div>
            </div>
            
            <div class="d-flex d-md-none justify-content-around gap-2 mt-2 pt-2" style="border-top: 1px solid var(--border-color);">
                <button class="btn-outline-casino btn-sm flex-grow-1 ${state.ui.vista === 'lobby' ? 'active' : ''}" 
                        onclick="window.navegar('lobby')" style="padding: 6px 10px; font-size: 0.75rem;">
                    <i class="bi bi-house"></i> Inicio
                </button>
                <button class="btn-outline-casino btn-sm flex-grow-1 ${state.ui.vista === 'ruleta' ? 'active' : ''}" 
                        onclick="window.navegar('ruleta')" style="padding: 6px 10px; font-size: 0.75rem;">
                    <i class="bi bi-dice-5"></i> Ruleta
                </button>
                <button class="btn-outline-casino btn-sm flex-grow-1 ${state.ui.vista === 'historial' ? 'active' : ''}" 
                        onclick="window.navegar('historial')" style="padding: 6px 10px; font-size: 0.75rem;">
                    <i class="bi bi-clock-history"></i> Historial
                </button>
                <button class="btn-outline-casino btn-sm flex-grow-1 ${state.ui.vista === 'perfil' ? 'active' : ''}" 
                        onclick="window.navegar('perfil')" style="padding: 6px 10px; font-size: 0.75rem;">
                    <i class="bi bi-person"></i> Perfil
                </button>
            </div>
        </div>
    `;
    
    return header;
}
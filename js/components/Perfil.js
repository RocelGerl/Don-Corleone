// ============================================
// DON CORLEONE - PERFIL
// ============================================

import { state } from '../core/state.js';
import { formatearMoneda } from '../utils/helpers.js';
import { actualizarState, navegar } from '../core/render.js';

export function Perfil() {
    const container = document.createElement('div');
    container.className = 'animate__animated animate__fadeInUp';
    
    const user = state.user;
    const avatares = ['🕴️', '🎩', '👔', '👑', '💼', '🔫', '🍝', '🍷', '🐴', '🔥', '🦊', '🐺', '🦅', '🐉', '🦈', '🐯', '🦁', '🐲', '🦄', '🐨'];
    
    container.innerHTML = `
        <div class="row g-4 justify-content-center">
            <div class="col-12">
                <h1 style="color: var(--text-primary); font-weight: 800; font-size: 1.8rem;">
                    <i class="bi bi-person-circle" style="color: var(--green);"></i>
                    MI PERFIL
                </h1>
                <div class="divider-casino"></div>
            </div>
            
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-casino text-center">
                    <div class="avatar-casino mx-auto" style="width: 100px; height: 100px; font-size: 4rem; border-width: 3px;">
                        ${user.avatar}
                    </div>
                    
                    <h3 style="color: var(--text-primary);" class="mt-3">${user.nombre}</h3>
                    <span style="display: inline-block; padding: 4px 20px; border-radius: 50px; background: var(--green); color: var(--bg-primary); font-weight: 700; font-size: 0.8rem;">
                        🎯 ${user.partidasGanadas} victorias
                    </span>
                    
                    <div class="divider-casino"></div>
                    
                    <div class="row g-3 mt-2">
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(255,255,255,0.03);">
                                <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Saldo</div>
                                <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${formatearMoneda(user.saldo)}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(255,255,255,0.03);">
                                <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Partidas</div>
                                <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${user.partidasJugadas}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(255,255,255,0.03);">
                                <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Victorias</div>
                                <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${user.partidasGanadas}</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 rounded-3" style="background: rgba(255,255,255,0.03);">
                                <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Racha</div>
                                <div style="font-size: 1.5rem; font-weight: 700; ${user.racha > 0 ? 'color: var(--green);' : 'color: var(--red);'}">${user.racha}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-casino">
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-emoji-smile"></i> Cambiar Avatar
                    </h5>
                    
                    <div class="d-flex flex-wrap gap-3 justify-content-center mt-3">
                        ${avatares.map(av => `
                            <button class="btn-outline-casino ${av === user.avatar ? 'active' : ''}" 
                                    onclick="window.cambiarAvatar('${av}')"
                                    style="font-size: 2rem; padding: 10px 15px; ${av === user.avatar ? 'border-color: var(--green); color: var(--green);' : ''}">
                                ${av}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="divider-casino"></div>
                    
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-pencil"></i> Cambiar Nombre
                    </h5>
                    
                    <div class="input-group mt-3">
                        <input type="text" class="form-control" 
                               id="nombreInput" value="${user.nombre}" 
                               placeholder="Nuevo nombre"
                               style="background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary);" />
                        <button class="btn-primary-casino" onclick="window.cambiarNombre()" style="border-radius: 0 12px 12px 0;">
                            <i class="bi bi-check"></i>
                        </button>
                    </div>
                    
                    <div class="divider-casino"></div>
                    
                    <div class="d-flex gap-3 flex-wrap">
                        <button class="btn-outline-casino" onclick="window.resetearPartidas()">
                            <i class="bi bi-arrow-counterclockwise"></i> Resetear Estadísticas
                        </button>
                        <button class="btn-danger-casino" onclick="window.resetearTodo()" style="padding: 10px 20px;">
                            <i class="bi bi-trash"></i> Resetear Todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // ============================================
    // FUNCIONES DE PERFIL
    // ============================================
    
    window.cambiarAvatar = function(avatar) {
        state.user.avatar = avatar;
        actualizarState({ user: state.user });
        window.mostrarNotificacion('Avatar actualizado', 'success');
        // Recargar vista
        const nuevaVista = Perfil();
        container.parentNode.replaceChild(nuevaVista, container);
    };
    
    window.cambiarNombre = function() {
        const input = document.getElementById('nombreInput');
        const nuevoNombre = input.value.trim();
        
        if (!nuevoNombre || nuevoNombre.length < 2) {
            window.mostrarNotificacion('Mínimo 2 caracteres', 'error');
            return;
        }
        
        state.user.nombre = nuevoNombre;
        actualizarState({ user: state.user });
        window.mostrarNotificacion('Nombre actualizado', 'success');
    };
    
    window.resetearPartidas = function() {
        if (confirm('¿Resetear estadísticas de partidas?')) {
            state.user.partidasJugadas = 0;
            state.user.partidasGanadas = 0;
            state.user.racha = 0;
            actualizarState({ user: state.user });
            window.mostrarNotificacion('Estadísticas reseteadas', 'info');
            const nuevaVista = Perfil();
            container.parentNode.replaceChild(nuevaVista, container);
        }
    };
    
    window.resetearTodo = function() {
        if (confirm('⚠️ ¿Resetear TODOS los datos? Esta acción no se puede deshacer.')) {
            state.user.saldo = 100;
            state.user.partidasJugadas = 0;
            state.user.partidasGanadas = 0;
            state.user.racha = 0;
            state.user.tieneSalaGratis = false;
            state.user.tieneDobleApuesta = false;
            state.historial = [];
            state.salas = [];
            state.ruleta.historial = [];
            state.ruleta.premioActivo = null;
            state.ruleta.ultimoGiro = null;
            state.ruleta.girosDisponibles = 1;
            
            actualizarState({
                user: state.user,
                historial: state.historial,
                salas: state.salas,
                ruleta: state.ruleta
            });
            
            window.mostrarNotificacion('Todo ha sido resetado', 'info');
            navegar('lobby');
        }
    };
    
    return container;
}
// ============================================
// DON CORLEONE - EVENTOS
// ============================================

import { state, MAX_JUGADORES, MIN_JUGADORES, MONTOS_APUESTA } from './state.js';
import { navegar, actualizarState } from './render.js';
import { 
    generarId, 
    formatearMoneda,
    crearConfeti,
    obtenerPremioRuleta,
    guardarState,
    calcularGananciaPotencial
} from '../utils/helpers.js';

// ============================================
// NOMBRES Y AVATARES RANDOM
// ============================================
const NOMBRES_RANDOM = [
    'Lucky Player', 'Big Winner', 'Casino King', 'Lady Luck', 'High Roller',
    'The Gambler', 'Ace Hunter', 'Royal Flush', 'Diamond Hand', 'Golden Touch',
    'Night Hawk', 'Silver Fox', 'Black Jack', 'Red Queen', 'King of Spades',
    'Lucky Strike', 'Double Down', 'All In', 'The Shark', 'Card Master',
    'Lucky Seven', 'Golden Eagle', 'Silver Shadow', 'Dark Knight', 'Phoenix Rise',
    'Cyber Punk', 'Neon Rider', 'Shadow Wolf', 'Crimson King', 'Ice Queen'
];

const AVATARES_RANDOM = ['🦊', '🐺', '🦅', '🐉', '🦈', '🐯', '🦁', '🐲', '🦄', '🐨', '🦦', '🐧', '🐸', '🐵', '🦍', '🐼', '🦝', '🐹'];

// ============================================
// GENERAR JUGADORES RANDOM
// ============================================
function generarJugadoresRandom(cantidad, jugadorPrincipal) {
    const jugadores = [jugadorPrincipal];
    const nombresUsados = new Set([jugadorPrincipal.nombre]);
    
    const nombresDisponibles = [...NOMBRES_RANDOM].sort(() => Math.random() - 0.5);
    const avataresDisponibles = [...AVATARES_RANDOM].sort(() => Math.random() - 0.5);
    
    let indexNombre = 0;
    let indexAvatar = 0;
    
    for (let i = 0; i < cantidad - 1; i++) {
        let nombre = nombresDisponibles[indexNombre % nombresDisponibles.length];
        let intentos = 0;
        while (nombresUsados.has(nombre) && intentos < 50) {
            indexNombre++;
            nombre = nombresDisponibles[indexNombre % nombresDisponibles.length];
            intentos++;
        }
        nombresUsados.add(nombre);
        indexNombre++;
        
        const avatar = avataresDisponibles[indexAvatar % avataresDisponibles.length];
        indexAvatar++;
        
        jugadores.push({
            nombre: nombre,
            avatar: avatar
        });
    }
    
    return jugadores;
}

// ============================================
// FUNCIONES GLOBALES (window)
// ============================================

window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center border-0 show position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '250px';
    
    const bgColor = tipo === 'success' ? 'linear-gradient(145deg, #00ff88, #00cc6a)' : 
                    tipo === 'error' ? 'linear-gradient(145deg, #ff3355, #cc0022)' : 
                    tipo === 'warning' ? 'linear-gradient(145deg, #ffd700, #cc9900)' : 
                    'linear-gradient(145deg, #1a1a2e, #0f0f1a)';
    
    toast.innerHTML = `
        <div class="toast-body rounded-3 p-3 shadow-lg" style="background: ${bgColor}; border: 1px solid rgba(255,255,255,0.05);">
            <div class="d-flex align-items-center">
                <span class="me-2" style="font-size: 1.5rem;">
                    ${tipo === 'success' ? '🎉' : 
                      tipo === 'error' ? '❌' : 
                      tipo === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span style="color: ${tipo === 'error' ? 'white' : '#0a0a1a'}; font-weight: 600;">${mensaje}</span>
                <button type="button" class="btn-close ${tipo === 'error' ? 'btn-close-white' : ''} ms-auto" onclick="this.closest('.toast').remove()"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
};

window.mostrarModal = function(titulo, contenido) {
    const modalExistente = document.querySelector('.modal');
    if (modalExistente) modalExistente.remove();
    const backdropExistente = document.querySelector('.modal-backdrop');
    if (backdropExistente) backdropExistente.remove();
    
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.style.display = 'block';
    document.body.appendChild(backdrop);
    
    const modal = document.createElement('div');
    modal.className = 'modal show d-block modal-casino';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.zIndex = '1050';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px;">
                <div class="modal-header" style="border-bottom: 1px solid var(--border-color);">
                    <h5 class="modal-title" style="color: var(--text-primary);">${titulo}</h5>
                    <button type="button" class="btn-close btn-close-white" onclick="window.cerrarModal()"></button>
                </div>
                <div class="modal-body" style="color: var(--text-primary);">
                    ${contenido}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.cerrarModal = function() {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(el => el.remove());
};

// ============================================
// CREAR SALA
// ============================================
export function crearSala(monto, llenarRandom = true) {
    if (!MONTOS_APUESTA.includes(monto)) {
        window.mostrarNotificacion('Monto no válido', 'error');
        return false;
    }
    
    if (state.user.saldo < monto) {
        window.mostrarNotificacion('Saldo insuficiente', 'error');
        return false;
    }
    
    state.user.saldo -= monto;
    
    const jugadorPrincipal = { 
        nombre: state.user.nombre, 
        avatar: state.user.avatar,
        esCreador: true 
    };
    
    let jugadores = [jugadorPrincipal];
    
    if (llenarRandom) {
        // Número aleatorio entre MIN_JUGADORES y MAX_JUGADORES
        const numRandom = Math.floor(Math.random() * (MAX_JUGADORES - MIN_JUGADORES + 1)) + MIN_JUGADORES;
        jugadores = generarJugadoresRandom(numRandom, jugadorPrincipal);
    } else {
        // Si no se llena random, al menos tener MIN_JUGADORES
        if (jugadores.length < MIN_JUGADORES) {
            const numFaltantes = MIN_JUGADORES - jugadores.length;
            const jugadoresExtra = generarJugadoresRandom(numFaltantes + 1, jugadorPrincipal);
            jugadores = jugadores.concat(jugadoresExtra.slice(1));
        }
    }
    
    const estaLlena = jugadores.length >= MAX_JUGADORES;
    
    const nuevaSala = {
        id: generarId(),
        nombre: `🎰 Sala ${state.salas.length + 1}`,
        monto: monto,
        jugadores: jugadores,
        maxJugadores: MAX_JUGADORES,
        minJugadores: MIN_JUGADORES,
        estado: estaLlena ? 'llena' : 'abierta',
        creador: state.user.nombre,
        fechaCreacion: new Date().toISOString(),
        ganador: null,
        distribucion: null
    };
    
    state.salas.push(nuevaSala);
    guardarState('state', state);
    window.cerrarModal();
    
    const mensaje = llenarRandom 
        ? `✅ Sala creada con ${jugadores.length} jugadores (${formatearMoneda(monto)})` 
        : `✅ Sala creada (${formatearMoneda(monto)})`;
    window.mostrarNotificacion(mensaje, 'success');
    
    navegar('sala', nuevaSala.id);
    return true;
}

window.crearSala = crearSala;

// ============================================
// UNIRSE A SALA
// ============================================
window.unirseASala = function(salaId) {
    const sala = state.salas.find(s => s.id === salaId);
    if (!sala) {
        window.mostrarNotificacion('Sala no encontrada', 'error');
        return;
    }
    
    if (sala.jugadores.length >= MAX_JUGADORES) {
        window.mostrarNotificacion('Sala llena', 'error');
        return;
    }
    
    if (sala.estado !== 'abierta') {
        window.mostrarNotificacion('Sala no disponible', 'error');
        return;
    }
    
    if (sala.jugadores.find(j => j.nombre === state.user.nombre)) {
        window.mostrarNotificacion('Ya estás en la sala', 'warning');
        return;
    }
    
    let montoAPagar = sala.monto;
    if (state.user.tieneSalaGratis) {
        montoAPagar = 0;
        state.user.tieneSalaGratis = false;
        window.mostrarNotificacion('🎰 ¡Usando sala gratis!', 'success');
    }
    
    if (state.user.saldo < montoAPagar) {
        window.mostrarNotificacion('Saldo insuficiente', 'error');
        return;
    }
    
    state.user.saldo -= montoAPagar;
    
    sala.jugadores.push({
        nombre: state.user.nombre,
        avatar: state.user.avatar
    });
    
    if (sala.jugadores.length >= MAX_JUGADORES) {
        sala.estado = 'llena';
    }
    
    guardarState('state', state);
    actualizarState({ salas: state.salas, user: state.user });
    window.mostrarNotificacion('✅ Te has unido a la sala', 'success');
};

// ============================================
// RULETA
// ============================================
export function girarRuleta(tipo, callback) {
    const premio = obtenerPremioRuleta();
    
    state.ruleta.historial.push({
        premio: premio,
        tipo: tipo,
        fecha: new Date().toISOString()
    });
    
    if (premio.id === 'sin_premio') {
        window.mostrarNotificacion('😕 No ganaste nada', 'info');
        guardarState('state', state);
        actualizarState({ ruleta: state.ruleta });
        if (callback) callback(premio);
        return;
    }
    
    if (premio.id === 'bonus_5') {
        state.user.saldo += 5;
        window.mostrarNotificacion('⭐ ¡Ganaste 5 Bs!', 'success');
        crearConfeti(30);
    } else if (premio.id === 'bonus_10') {
        state.user.saldo += 10;
        window.mostrarNotificacion('💎 ¡Ganaste 10 Bs!', 'success');
        crearConfeti(40);
    } else if (premio.id === 'giro_extra') {
        window.mostrarNotificacion('🎯 ¡Giro extra!', 'success');
        setTimeout(() => {
            if (confirm('🎯 ¿Quieres girar de nuevo?')) {
                girarRuleta('premium');
            }
        }, 500);
    } else {
        state.ruleta.premioActivo = premio;
        window.mostrarNotificacion(`🎉 ¡${premio.nombre}!`, 'success');
        crearConfeti(50);
    }
    
    if (tipo === 'premium') {
        state.user.saldo -= 2;
    } else {
        state.ruleta.ultimoGiro = new Date().toISOString();
        state.ruleta.girosDisponibles = 0;
    }
    
    guardarState('state', state);
    actualizarState({ user: state.user, ruleta: state.ruleta });
    
    if (callback) callback(premio);
}

window.girarRuleta = girarRuleta;

export function usarPremio() {
    const premio = state.ruleta.premioActivo;
    if (!premio) {
        window.mostrarNotificacion('No hay premio activo', 'warning');
        return;
    }
    
    if (premio.id === 'sala_gratis') {
        window.mostrarNotificacion('🎰 Sala gratis activada', 'success');
        state.user.tieneSalaGratis = true;
        state.ruleta.premioActivo = null;
        guardarState('state', state);
        actualizarState({ user: state.user, ruleta: state.ruleta });
        navegar('lobby');
    } else if (premio.id === 'doble_apuesta') {
        window.mostrarNotificacion('🃏 Doble apuesta activada', 'success');
        state.user.tieneDobleApuesta = true;
        state.ruleta.premioActivo = null;
        guardarState('state', state);
        actualizarState({ user: state.user, ruleta: state.ruleta });
        navegar('lobby');
    }
}

window.usarPremio = usarPremio;

// ============================================
// PERFIL
// ============================================
export function cambiarAvatar(avatar) {
    state.user.avatar = avatar;
    guardarState('state', state);
    actualizarState({ user: state.user });
    window.mostrarNotificacion('Avatar actualizado', 'success');
}

window.cambiarAvatar = cambiarAvatar;

export function cambiarNombre(nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim().length < 2) {
        window.mostrarNotificacion('Mínimo 2 caracteres', 'error');
        return false;
    }
    state.user.nombre = nuevoNombre.trim();
    guardarState('state', state);
    actualizarState({ user: state.user });
    window.mostrarNotificacion('Nombre actualizado', 'success');
    return true;
}

window.cambiarNombre = cambiarNombre;

export function resetearPartidas() {
    if (confirm('¿Resetear estadísticas?')) {
        state.user.partidasJugadas = 0;
        state.user.partidasGanadas = 0;
        state.user.racha = 0;
        guardarState('state', state);
        actualizarState({ user: state.user });
        window.mostrarNotificacion('Estadísticas reseteadas', 'info');
    }
}

window.resetearPartidas = resetearPartidas;

export function resetearTodo() {
    if (confirm('⚠️ ¿Resetear TODO?')) {
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
        
        guardarState('state', state);
        actualizarState({
            user: state.user,
            historial: state.historial,
            salas: state.salas,
            ruleta: state.ruleta
        });
        
        window.mostrarNotificacion('Todo resetado', 'info');
        navegar('lobby');
    }
}

window.resetearTodo = resetearTodo;

window.navegar = navegar;

console.log('🎩 Don Corleone - Eventos cargados');
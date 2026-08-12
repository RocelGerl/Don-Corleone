// ============================================
// DON CORLEONE - LOBBY
// ============================================

import { state, MONTOS_APUESTA, MAX_JUGADORES, MIN_JUGADORES } from '../core/state.js';
import { formatearMoneda, generarId, calcularGananciaPotencial, getColorPorcentaje } from '../utils/helpers.js';
import { navegar } from '../core/render.js';
import { crearSala } from '../core/events.js';

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
// LOBBY
// ============================================
export function Lobby() {
    const container = document.createElement('div');
    container.className = 'animate__animated animate__fadeInUp';
    
    // Salas de ejemplo con jugadores random (mínimo 5)
    if (state.salas.length === 0) {
        state.salas = [
            {
                id: generarId(),
                nombre: '🎰 Sala VIP',
                monto: 5,
                jugadores: generarJugadoresRandom(6, { nombre: 'Don Corleone', avatar: '🕴️' }),
                maxJugadores: MAX_JUGADORES,
                minJugadores: MIN_JUGADORES,
                estado: 'abierta',
                creador: 'Don Corleone'
            },
            {
                id: generarId(),
                nombre: '🎩 Sala de los Capos',
                monto: 10,
                jugadores: generarJugadoresRandom(8, { nombre: 'Michael Corleone', avatar: '🎩' }),
                maxJugadores: MAX_JUGADORES,
                minJugadores: MIN_JUGADORES,
                estado: 'abierta',
                creador: 'Michael Corleone'
            },
            {
                id: generarId(),
                nombre: '💎 Sala de la Familia',
                monto: 50,
                jugadores: generarJugadoresRandom(10, { nombre: 'Don Vito', avatar: '👑' }),
                maxJugadores: MAX_JUGADORES,
                minJugadores: MIN_JUGADORES,
                estado: 'llena',
                creador: 'Don Vito'
            }
        ];
    }
    
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h1 style="color: var(--text-primary); font-weight: 800; font-size: 1.8rem;">
                            <i class="bi bi-shield-shaded" style="color: var(--green);"></i>
                            SALAS ACTIVAS
                            <small style="color: var(--text-muted); font-size: 0.8rem; font-weight: 400; display: block;">
                                ${state.salas.reduce((acc, s) => acc + s.jugadores.length, 0)} jugadores en total
                            </small>
                        </h1>
                    </div>
                    <button class="btn-primary-casino" onclick="window.mostrarCrearSala()" style="display: flex; align-items: center; gap: 8px;">
                        <i class="bi bi-plus-circle" style="font-size: 1.2rem;"></i>
                        Crear Sala
                    </button>
                </div>
                <div class="divider-casino"></div>
            </div>
            
            ${state.salas.map((sala, index) => {
                const ganancia = calcularGananciaPotencial(sala.jugadores.length, sala.monto);
                const colorPorcentaje = ganancia.color;
                const anchoBarra = Math.min((ganancia.porcentajeRetorno / 200) * 100, 100);
                
                return `
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="sala-card" 
                         style="animation-delay: ${index * 0.1}s"
                         onclick="window.entrarSala('${sala.id}')">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 style="color: var(--text-primary); font-weight: 600;">${sala.nombre}</h5>
                                <div class="d-flex gap-2 mt-2 flex-wrap">
                                    <span class="monto-badge">
                                        <i class="bi bi-coin"></i> ${formatearMoneda(sala.monto)}
                                    </span>
                                    <span style="color: var(--text-secondary); font-size: 0.8rem;">
                                        <i class="bi bi-people"></i> ${sala.jugadores.length}/${sala.maxJugadores}
                                    </span>
                                    <span style="color: var(--text-muted); font-size: 0.7rem;">
                                        <i class="bi bi-arrow-up"></i> Mín ${sala.minJugadores || MIN_JUGADORES}
                                    </span>
                                </div>
                            </div>
                            <span class="estado-badge ${sala.estado}">
                                ${sala.estado === 'abierta' ? '🟢 Abierta' : 
                                  sala.estado === 'llena' ? '🔴 Llena' : 
                                  sala.estado === 'jugando' ? '🟡 Jugando' : '⚫ Finalizada'}
                            </span>
                        </div>
                        
                        <div class="mt-3 d-flex gap-1 flex-wrap">
                            ${sala.jugadores.slice(0, 8).map(j => `
                                <div class="avatar-casino" style="width: 36px; height: 36px; font-size: 1rem;" title="${j.nombre}">
                                    ${j.avatar}
                                </div>
                            `).join('')}
                            ${sala.jugadores.length > 8 ? `
                                <div class="avatar-casino" style="width: 36px; height: 36px; font-size: 0.7rem; background: var(--green); color: var(--bg-primary); font-weight: 700;">
                                    +${sala.jugadores.length - 8}
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- INDICADOR DE GANANCIA POTENCIAL -->
                        <div class="ganancia-indicador" style="border-left-color: ${colorPorcentaje};">
                            <div class="d-flex justify-content-between align-items-center">
                                <span style="color: var(--text-secondary); font-size: 0.8rem;">
                                    ${ganancia.emoji} Ganancia potencial
                                </span>
                                <span class="porcentaje" style="color: ${colorPorcentaje};">
                                    ${ganancia.textoRetorno}
                                </span>
                            </div>
                            <div class="ganancia-bar">
                                <div class="fill" style="width: ${anchoBarra}%; background: ${colorPorcentaje};"></div>
                            </div>
                            <div class="d-flex justify-content-between mt-1">
                                <span style="color: var(--text-muted); font-size: 0.65rem;">
                                    ${sala.jugadores.length} jugadores
                                </span>
                                <span class="nivel" style="color: ${colorPorcentaje};">
                                    ${ganancia.nivel}
                                </span>
                            </div>
                        </div>
                        
                        <div class="mt-2">
                            <small style="color: var(--text-muted);">
                                <i class="bi bi-person"></i> Creador: ${sala.creador}
                            </small>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
            
            ${state.salas.length === 0 ? `
                <div class="col-12 text-center py-5">
                    <div class="card-casino">
                        <i class="bi bi-house-door" style="font-size: 3rem; color: var(--green); opacity: 0.3;"></i>
                        <h4 style="color: var(--text-secondary);">No hay salas activas</h4>
                        <p style="color: var(--text-muted);">Sé el primero en crear una sala</p>
                        <button class="btn-primary-casino mt-2" onclick="window.mostrarCrearSala()">
                            <i class="bi bi-plus-circle"></i> Crear Sala
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // ============================================
    // FUNCIONES GLOBALES
    // ============================================
    window.mostrarCrearSala = function() {
        const modalContent = `
            <div class="text-center mb-3">
                <i class="bi bi-diamond-fill" style="font-size: 3rem; color: var(--green);"></i>
            </div>
            <h5 style="color: var(--text-primary); text-align: center; font-weight: 600;">Crear Nueva Sala</h5>
            <p style="color: var(--text-muted); text-align: center; font-size: 0.9rem;">Elige el monto de apuesta</p>
            
            <div class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                ${MONTOS_APUESTA.map(m => `
                    <button class="btn-primary-casino" onclick="window.crearSalaDesdeModal(${m})" style="font-size: 0.9rem; padding: 10px 25px;">
                        <i class="bi bi-coin"></i> ${formatearMoneda(m)}
                    </button>
                `).join('')}
            </div>
            
            <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color);">
                <div class="form-check form-switch d-flex justify-content-center align-items-center gap-3">
                    <input class="form-check-input" type="checkbox" id="llenarRandom" checked style="background-color: var(--green); border-color: var(--green);">
                    <label class="form-check-label" for="llenarRandom" style="color: var(--text-secondary); font-size: 0.85rem;">
                        <i class="bi bi-people"></i> Llenar con jugadores random (mínimo ${MIN_JUGADORES})
                    </label>
                </div>
            </div>
        `;
        
        window.mostrarModal('🎰 Nueva Sala', modalContent);
    };
    
    window.crearSalaDesdeModal = function(monto) {
        const llenarRandom = document.getElementById('llenarRandom')?.checked ?? true;
        crearSala(monto, llenarRandom);
    };
    
    window.entrarSala = function(salaId) {
        navegar('sala', salaId);
    };
    
    return container;
}
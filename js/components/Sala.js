// ============================================
// DON CORLEONE - SALA (CORREGIDO)
// ============================================

import { state, MAX_JUGADORES, MIN_JUGADORES } from '../core/state.js';
import { formatearMoneda, crearConfeti, guardarState, calcularGananciaPotencial, getColorPorcentaje } from '../utils/helpers.js';
import { navegar, actualizarState } from '../core/render.js';

export function Sala() {
    const container = document.createElement('div');
    container.className = 'animate__animated animate__fadeInUp';
    
    const salaId = state.salaActiva;
    const sala = state.salas.find(s => s.id === salaId);
    
    if (!sala) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: var(--red);"></i>
                <h3 class="text-secondary mt-3">Sala no encontrada</h3>
                <button class="btn-primary-casino mt-3" onclick="window.navegar('lobby')">Volver</button>
            </div>
        `;
        return container;
    }
    
    const esCreador = sala.creador === state.user.nombre;
    // ✅ CORREGIDO: Permitir iniciar si está abierta O llena, y hay mínimo 5 jugadores
    const puedeIniciar = esCreador && 
                         sala.jugadores.length >= MIN_JUGADORES && 
                         (sala.estado === 'abierta' || sala.estado === 'llena');
    const esGanador = sala.ganador === state.user.nombre;
    const estaEnSala = sala.jugadores.find(j => j.nombre === state.user.nombre);
    const estaLlena = sala.jugadores.length >= MAX_JUGADORES;
    
    // Calcular ganancia potencial
    const ganancia = calcularGananciaPotencial(sala.jugadores.length, sala.monto);
    const colorPorcentaje = ganancia.color;
    const anchoBarra = Math.min((ganancia.porcentajeRetorno / 200) * 100, 100);
    
    // Determinar estado mostrado
    let estadoMostrado = sala.estado;
    let estadoTexto = '';
    let estadoColor = '';
    
    if (sala.estado === 'abierta' && estaLlena) {
        estadoMostrado = 'llena';
        estadoTexto = '🔴 Llena';
        estadoColor = 'var(--red)';
    } else if (sala.estado === 'abierta') {
        estadoTexto = '🟢 Abierta';
        estadoColor = 'var(--green)';
    } else if (sala.estado === 'llena') {
        estadoTexto = '🔴 Llena';
        estadoColor = 'var(--red)';
    } else if (sala.estado === 'jugando') {
        estadoTexto = '🟡 Jugando...';
        estadoColor = 'var(--gold)';
    } else if (sala.estado === 'finalizada' && esGanador) {
        estadoTexto = '🏆 ¡GANASTE!';
        estadoColor = 'var(--gold)';
    } else if (sala.estado === 'finalizada') {
        estadoTexto = '⚫ Finalizada';
        estadoColor = 'var(--text-muted)';
    }
    
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <button class="btn-outline-casino btn-sm" onclick="window.navegar('lobby')">
                            <i class="bi bi-arrow-left"></i> Volver
                        </button>
                        <h3 class="mt-2 text-white">${sala.nombre}</h3>
                        <div class="d-flex gap-3 mt-2 flex-wrap">
                            <span class="monto-badge">
                                <i class="bi bi-coin"></i> ${formatearMoneda(sala.monto)}
                            </span>
                            <span style="color: var(--text-secondary); font-size: 0.85rem;">
                                <i class="bi bi-people"></i> ${sala.jugadores.length}/${sala.maxJugadores}
                                ${estaLlena ? ' ✅' : ''}
                            </span>
                            <span style="color: var(--text-muted); font-size: 0.8rem;">
                                <i class="bi bi-arrow-up"></i> Mín ${sala.minJugadores || MIN_JUGADORES}
                            </span>
                            <span style="color: ${estadoColor}; font-weight: 600; font-size: 0.85rem;">
                                ${estadoTexto}
                            </span>
                        </div>
                    </div>
                    
                    ${(sala.estado === 'abierta' || sala.estado === 'llena') && puedeIniciar ? `
                        <button class="btn-primary-casino" onclick="window.iniciarJuegoConAnimacion('${sala.id}')" style="animation: pulse-glow 1.5s infinite;">
                            <i class="bi bi-play-fill"></i> 
                            ${estaLlena ? '¡Iniciar (Sala Llena)!' : 'Iniciar Juego'}
                        </button>
                    ` : ''}
                    
                    ${(sala.estado === 'abierta' || sala.estado === 'llena') && esCreador && sala.jugadores.length < MIN_JUGADORES ? `
                        <div class="text-end">
                            <small class="text-muted">⚠️ Mínimo ${MIN_JUGADORES} jugadores</small>
                            <small class="d-block text-muted" style="font-size: 0.7rem;">Faltan ${MIN_JUGADORES - sala.jugadores.length}</small>
                        </div>
                    ` : ''}
                    
                    ${(sala.estado === 'abierta' || sala.estado === 'llena') && estaEnSala && !esCreador ? `
                        <small class="text-green">✅ Esperando al creador...</small>
                    ` : ''}
                    
                    ${sala.estado === 'jugando' ? `
                        <small class="text-gold" style="animation: pulse-badge 1s infinite;">🎲 Jugando...</small>
                    ` : ''}
                </div>
                <div class="divider-casino"></div>
            </div>
            
            <div class="col-12 col-lg-8">
                <div class="card-casino">
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-people"></i> Jugadores (${sala.jugadores.length}/${sala.maxJugadores})
                        ${estaLlena ? ' 🎯 ¡COMPLETO!' : ''}
                    </h5>
                    
                    <div class="row g-3 mt-2" id="jugadoresContainer">
                        ${sala.jugadores.map((jugador, index) => `
                            <div class="col-4 col-sm-3 col-md-2">
                                <div class="text-center p-2 rounded-3 ${jugador.nombre === state.user.nombre ? 'border border-green' : ''}" 
                                     style="${sala.ganador === jugador.nombre ? 'background: rgba(0,255,136,0.05);' : ''}"
                                     id="jugador-${index}">
                                    <div class="avatar-casino mx-auto ${sala.estado === 'jugando' ? 'avatar-iluminado' : ''} ${sala.ganador === jugador.nombre ? 'avatar-ganador-final' : ''}" 
                                         style="width: 60px; height: 60px; font-size: 1.8rem;">
                                        ${jugador.avatar}
                                        ${jugador.nombre === sala.creador ? '<span class="online"></span>' : ''}
                                        ${sala.ganador === jugador.nombre ? '<span class="crown">👑</span>' : ''}
                                    </div>
                                    <div class="mt-1">
                                        <small style="font-size: 0.7rem; ${jugador.nombre === state.user.nombre ? 'color: var(--green);' : 'color: var(--text-secondary);'}">
                                            ${jugador.nombre}
                                            ${jugador.nombre === state.user.nombre ? ' (tú)' : ''}
                                        </small>
                                        ${sala.estado === 'finalizada' && sala.distribucion ? `
                                            <small class="d-block" style="color: ${jugador.nombre === sala.ganador ? 'var(--green)' : 'var(--green)'}; font-weight: 600;">
                                                ${jugador.nombre === sala.ganador ? 
                                                    `+ ${formatearMoneda(sala.distribucion.ganador)}` : 
                                                    `+ ${formatearMoneda(sala.distribucion.reembolsoPorPerdedor)}`}
                                            </small>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        
                        ${Array.from({ length: sala.maxJugadores - sala.jugadores.length }).map((_, i) => `
                            <div class="col-4 col-sm-3 col-md-2">
                                <div class="text-center p-2 rounded-3" style="border: 1px dashed var(--border-color);">
                                    <div class="avatar-casino mx-auto" style="opacity: 0.15; width: 60px; height: 60px; font-size: 1.8rem;">
                                        ?
                                    </div>
                                    <small class="text-muted" style="font-size: 0.6rem;">Disponible</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${(sala.estado === 'abierta' || sala.estado === 'llena') && !estaEnSala ? `
                        <div class="mt-4 text-center">
                            <button class="btn-primary-casino" onclick="window.unirseASala('${sala.id}')" 
                                    ${estaLlena ? 'disabled' : ''}>
                                <i class="bi bi-person-plus"></i> 
                                ${estaLlena ? 'Sala Llena' : `Unirse (${formatearMoneda(sala.monto)})`}
                            </button>
                            ${estaLlena ? `
                                <small class="d-block text-muted mt-1">⚠️ La sala está completa</small>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${(sala.estado === 'abierta' || sala.estado === 'llena') && estaEnSala && !esCreador ? `
                        <div class="mt-3 text-center">
                            <small class="text-green">✅ Estás en la sala</small>
                            ${estaLlena ? '<small class="d-block text-gold">🎯 ¡Sala completa! Esperando al creador...</small>' : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="col-12 col-lg-4">
                <div class="card-casino">
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-info-circle"></i> Información
                    </h5>
                    
                    <div class="mt-3">
                        <div class="d-flex justify-content-between py-2" style="border-bottom: 1px solid var(--border-color);">
                            <span class="text-muted">Creador</span>
                            <span class="text-white">${sala.creador}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2" style="border-bottom: 1px solid var(--border-color);">
                            <span class="text-muted">Apuesta</span>
                            <span class="text-green">${formatearMoneda(sala.monto)}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2" style="border-bottom: 1px solid var(--border-color);">
                            <span class="text-muted">Jugadores</span>
                            <span class="text-white">${sala.jugadores.length}/${sala.maxJugadores}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2">
                            <span class="text-muted">Estado</span>
                            <span style="color: ${estadoColor};">
                                ${estadoTexto}
                            </span>
                        </div>
                    </div>
                    
                    <!-- INDICADOR DE GANANCIA POTENCIAL -->
                    <div class="mt-3 pt-3" style="border-top: 1px solid var(--border-color);">
                        <h6 style="color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">
                            <i class="bi bi-graph-up-arrow"></i> Ganancia potencial
                        </h6>
                        <div class="ganancia-indicador" style="border-left-color: ${colorPorcentaje}; margin-top: 8px;">
                            <div class="d-flex justify-content-between align-items-center">
                                <span style="color: var(--text-secondary); font-size: 0.8rem;">
                                    ${ganancia.emoji} Con ${sala.jugadores.length} jugadores
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
                                    ${formatearMoneda(ganancia.gananciaNeta)} neto
                                </span>
                                <span class="nivel" style="color: ${colorPorcentaje};">
                                    ${ganancia.nivel}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    ${sala.estado === 'finalizada' && sala.distribucion ? `
                        <div class="mt-3 pt-3" style="border-top: 1px solid var(--border-color);">
                            <h6 style="color: var(--green); font-weight: 700;">🏆 Premios</h6>
                            <div class="d-flex justify-content-between py-1">
                                <span class="text-muted">Ganador (30%)</span>
                                <span class="text-green" style="font-weight: 700;">${formatearMoneda(sala.distribucion.ganador)}</span>
                            </div>
                            <div class="d-flex justify-content-between py-1">
                                <span class="text-muted">Reembolso (50% c/u)</span>
                                <span class="text-green">${formatearMoneda(sala.distribucion.reembolsoPorPerdedor)}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // ============================================
    // FUNCIONES LOCALES
    // ============================================
    
    function unirseASala(salaId) {
        const sala = state.salas.find(s => s.id === salaId);
        if (!sala) {
            window.mostrarNotificacion('Sala no encontrada', 'error');
            return;
        }
        
        if (sala.jugadores.length >= MAX_JUGADORES) {
            window.mostrarNotificacion('Sala llena', 'error');
            return;
        }
        
        if (sala.estado !== 'abierta' && sala.estado !== 'llena') {
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
        
        // ✅ Si se llena, cambiar estado a 'llena' pero permitir inicio
        if (sala.jugadores.length >= MAX_JUGADORES) {
            sala.estado = 'llena';
            window.mostrarNotificacion('🎯 ¡Sala completa! El creador puede iniciar', 'success');
        }
        
        guardarState('state', state);
        actualizarState({ salas: state.salas, user: state.user });
        window.mostrarNotificacion('✅ Te has unido a la sala', 'success');
    }
    
    function iniciarJuegoConAnimacion(salaId) {
        const sala = state.salas.find(s => s.id === salaId);
        if (!sala) return;
        
        if (sala.estado === 'jugando' || sala.estado === 'finalizada') {
            window.mostrarNotificacion('La sala ya está en juego', 'error');
            return;
        }
        
        if (sala.jugadores.length < MIN_JUGADORES) {
            window.mostrarNotificacion(`Mínimo ${MIN_JUGADORES} jugadores`, 'error');
            return;
        }
        
        if (sala.creador !== state.user.nombre) {
            window.mostrarNotificacion('Solo el creador puede iniciar', 'error');
            return;
        }
        
        sala.estado = 'jugando';
        actualizarState({ salas: state.salas });
        window.mostrarNotificacion('🎲 ¡El juego ha comenzado!', 'info');
        
        const jugadoresDivs = document.querySelectorAll('#jugadoresContainer .avatar-casino');
        const jugadores = sala.jugadores;
        let contador = 0;
        const maxRondas = 10 + Math.floor(Math.random() * 5);
        let velocidad = 200;
        
        function iluminarJugador(index) {
            jugadoresDivs.forEach((div, i) => {
                div.classList.remove('avatar-iluminado');
                div.style.boxShadow = 'none';
                div.style.borderColor = 'var(--border-color)';
                div.style.transform = 'scale(1)';
                
                if (i === index) {
                    div.classList.add('avatar-iluminado');
                    div.style.boxShadow = '0 0 40px var(--green-glow), 0 0 80px rgba(0,255,136,0.15)';
                    div.style.borderColor = 'var(--green)';
                    div.style.transform = 'scale(1.15)';
                }
            });
        }
        
        function animarLuces() {
            const randomIndex = Math.floor(Math.random() * jugadores.length);
            iluminarJugador(randomIndex);
            contador++;
            
            if (contador > maxRondas * 0.3) velocidad = 160;
            if (contador > maxRondas * 0.6) velocidad = 110;
            if (contador > maxRondas * 0.8) velocidad = 60;
            
            if (contador < maxRondas) {
                setTimeout(animarLuces, velocidad);
            } else {
                const ganadorIndex = Math.floor(Math.random() * jugadores.length);
                const ganador = jugadores[ganadorIndex];
                
                jugadoresDivs.forEach((div, i) => {
                    div.classList.remove('avatar-iluminado');
                    div.style.boxShadow = 'none';
                    div.style.borderColor = 'var(--border-color)';
                    div.style.transform = 'scale(1)';
                    
                    if (i === ganadorIndex) {
                        div.classList.add('avatar-ganador-final');
                        div.style.borderColor = 'var(--green)';
                        div.style.boxShadow = '0 0 60px var(--green-glow), 0 0 120px rgba(0,255,136,0.2)';
                        div.style.transform = 'scale(1.25)';
                    }
                });
                
                procesarGanador(sala, ganador);
            }
        }
        
        setTimeout(animarLuces, 1000);
    }
    
    function procesarGanador(sala, ganador) {
        const numJugadores = sala.jugadores.length;
        const montoApuesta = sala.monto;
        const totalPozo = numJugadores * montoApuesta;
        
        const premioGanador = totalPozo * 0.30;
        const reembolsoPorPerdedor = montoApuesta * 0.50;
        
        const distribucion = {
            ganador: premioGanador,
            reembolsoPorPerdedor: reembolsoPorPerdedor,
            total: totalPozo
        };
        
        sala.ganador = ganador.nombre;
        sala.distribucion = distribucion;
        sala.estado = 'finalizada';
        
        state.historial.push({
            sala: sala.nombre,
            monto: sala.monto,
            jugadores: sala.jugadores.length,
            ganador: ganador.nombre,
            distribucion: distribucion,
            fecha: new Date().toISOString()
        });
        
        const usuario = state.user;
        const esGanador = ganador.nombre === usuario.nombre;
        
        if (esGanador) {
            usuario.saldo += distribucion.ganador;
            usuario.partidasGanadas++;
            usuario.racha++;
            crearConfeti(80);
            window.mostrarNotificacion('🎉 ¡HAS GANADO!', 'success');
        } else {
            const estaEnSala = sala.jugadores.find(j => j.nombre === usuario.nombre);
            if (estaEnSala) {
                usuario.saldo += distribucion.reembolsoPorPerdedor;
                window.mostrarNotificacion(`✅ ${ganador.nombre} ganó. Recibes ${formatearMoneda(distribucion.reembolsoPorPerdedor)}`, 'info');
            }
            usuario.racha = 0;
        }
        usuario.partidasJugadas++;
        
        guardarState('state', state);
        actualizarState({ 
            salas: state.salas, 
            historial: state.historial,
            user: state.user 
        });
        
        setTimeout(() => {
            window.navegar('sala', sala.id);
        }, 1200);
    }
    
    // Exponer funciones al window
    window.unirseASala = unirseASala;
    window.iniciarJuegoConAnimacion = iniciarJuegoConAnimacion;
    window.procesarGanador = procesarGanador;
    
    return container;
}
// ============================================
// DON CORLEONE - HISTORIAL
// ============================================

import { state } from '../core/state.js';
import { formatearMoneda } from '../utils/helpers.js';

export function Historial() {
    const container = document.createElement('div');
    container.className = 'animate__animated animate__fadeInUp';
    
    const historial = state.historial;
    
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-12">
                <h1 style="color: var(--text-primary); font-weight: 800; font-size: 1.8rem;">
                    <i class="bi bi-clock-history" style="color: var(--green);"></i>
                    HISTORIAL DE PARTIDAS
                    <small style="color: var(--text-muted); font-size: 0.8rem; font-weight: 400; display: block;">
                        REGISTRO COMPLETO
                    </small>
                </h1>
                <div class="divider-casino"></div>
            </div>
            
            <div class="col-12">
                <div class="row g-3">
                    <div class="col-4 col-md-3">
                        <div class="card-casino text-center">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Partidas</div>
                            <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${state.user.partidasJugadas}</div>
                        </div>
                    </div>
                    <div class="col-4 col-md-3">
                        <div class="card-casino text-center">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Victorias</div>
                            <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${state.user.partidasGanadas}</div>
                        </div>
                    </div>
                    <div class="col-4 col-md-3">
                        <div class="card-casino text-center">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Racha</div>
                            <div style="font-size: 1.5rem; font-weight: 700; ${state.user.racha > 0 ? 'color: var(--green);' : 'color: var(--red);'}">${state.user.racha}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="card-casino text-center">
                            <div class="text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;">Saldo</div>
                            <div class="text-green" style="font-size: 1.5rem; font-weight: 700;">${formatearMoneda(state.user.saldo)}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-12">
                <div class="card-casino">
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-list-ul"></i> Últimas Partidas
                    </h5>
                    
                    ${historial.length > 0 ? `
                        <div class="table-responsive mt-3">
                            <table class="table table-dark table-hover" style="border-color: var(--border-color);">
                                <thead>
                                    <tr style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                        <th>Sala</th>
                                        <th>Apuesta</th>
                                        <th>Jugadores</th>
                                        <th>Ganador</th>
                                        <th>Premio</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${historial.slice().reverse().map(partida => `
                                        <tr style="border-color: var(--border-color);">
                                            <td style="color: var(--text-primary);">${partida.sala}</td>
                                            <td style="color: var(--green);">${formatearMoneda(partida.monto)}</td>
                                            <td style="color: var(--text-secondary);">${partida.jugadores}</td>
                                            <td style="color: ${partida.ganador === state.user.nombre ? 'var(--green)' : 'var(--text-secondary)'};">
                                                ${partida.ganador}
                                                ${partida.ganador === state.user.nombre ? ' 🏆' : ''}
                                            </td>
                                            <td style="color: var(--green);">
                                                ${partida.ganador === state.user.nombre ? 
                                                    formatearMoneda(partida.distribucion.ganador) : 
                                                    formatearMoneda(partida.distribucion.reembolsoPorPerdedor)}
                                            </td>
                                            <td style="color: var(--text-muted); font-size: 0.8rem;">
                                                ${new Date(partida.fecha).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="text-center py-5">
                            <i class="bi bi-inbox" style="font-size: 3rem; color: var(--text-muted); opacity: 0.3;"></i>
                            <p class="text-muted mt-3">No hay partidas en el historial</p>
                            <button class="btn-primary-casino mt-2" onclick="window.navegar('lobby')">
                                <i class="bi bi-plus-circle"></i> Jugar ahora
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    return container;
}
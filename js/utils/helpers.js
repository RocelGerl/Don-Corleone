// ============================================
// DON CORLEONE - UTILIDADES
// ============================================

import { PREMIOS_RULETA } from '../core/state.js';

export function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function formatearMoneda(monto) {
    return monto.toFixed(2) + ' Bs';
}

export function randomEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function elegirGanador(jugadores) {
    const index = randomEntre(0, jugadores.length - 1);
    return jugadores[index];
}

// ============================================
// CÁLCULO DE GANANCIA POTENCIAL
// ============================================
export function calcularGananciaPotencial(numJugadores, montoApuesta) {
    const pozo = numJugadores * montoApuesta;
    const premioGanador = pozo * 0.30;
    const gananciaNeta = premioGanador - montoApuesta;
    const porcentajeRetorno = (gananciaNeta / montoApuesta) * 100;
    
    let nivel, color, emoji;
    if (porcentajeRetorno >= 150) {
        nivel = '🔥 ¡JACKPOT!';
        color = '#ff6b35';
        emoji = '🔥';
    } else if (porcentajeRetorno >= 100) {
        nivel = '⭐ Excelente';
        color = '#ffd700';
        emoji = '⭐';
    } else if (porcentajeRetorno >= 70) {
        nivel = '🟡 Muy Bueno';
        color = '#ffdd57';
        emoji = '🟡';
    } else if (porcentajeRetorno >= 40) {
        nivel = '🟢 Bueno';
        color = '#00ff88';
        emoji = '🟢';
    } else {
        nivel = '🔵 Bajo';
        color = '#4a8aff';
        emoji = '🔵';
    }
    
    return {
        pozo,
        premioGanador,
        gananciaNeta,
        porcentajeRetorno,
        textoRetorno: porcentajeRetorno >= 0 ? `+${porcentajeRetorno.toFixed(0)}%` : `${porcentajeRetorno.toFixed(0)}%`,
        nivel,
        color,
        emoji
    };
}

export function getColorPorcentaje(porcentaje) {
    if (porcentaje >= 150) return '#ff6b35';
    if (porcentaje >= 100) return '#ffd700';
    if (porcentaje >= 70) return '#ffdd57';
    if (porcentaje >= 40) return '#00ff88';
    return '#4a8aff';
}

// ============================================
// DISTRIBUCIÓN
// ============================================
export function calcularDistribucion(sala) {
    const numJugadores = sala.jugadores.length;
    const montoApuesta = sala.monto;
    const totalPozo = numJugadores * montoApuesta;
    
    const premioGanador = totalPozo * 0.30;
    const reembolsoPorPerdedor = montoApuesta * 0.50;
    const totalReembolsos = reembolsoPorPerdedor * (numJugadores - 1);
    const comisionCasa = totalPozo - premioGanador - totalReembolsos;
    
    return {
        ganador: premioGanador,
        reembolsoPorPerdedor: reembolsoPorPerdedor,
        totalReembolsos: totalReembolsos,
        comisionCasa: comisionCasa,
        total: totalPozo,
        numJugadores: numJugadores,
        montoApuesta: montoApuesta
    };
}

// ============================================
// RULETA
// ============================================
export function obtenerPremioRuleta() {
    const random = Math.random() * 100;
    let acumulado = 0;
    
    for (const premio of PREMIOS_RULETA) {
        acumulado += premio.prob;
        if (random <= acumulado) {
            return premio;
        }
    }
    return PREMIOS_RULETA[PREMIOS_RULETA.length - 1];
}

export function esHoy(fecha) {
    const hoy = new Date();
    const f = new Date(fecha);
    return hoy.getDate() === f.getDate() &&
           hoy.getMonth() === f.getMonth() &&
           hoy.getFullYear() === f.getFullYear();
}

// ============================================
// STORAGE
// ============================================
export function guardarState(key, data) {
    try {
        localStorage.setItem(`doncorleone_${key}`, JSON.stringify(data));
    } catch (e) {
        console.error('Error guardando:', e);
    }
}

export function cargarState(key, defaultData) {
    try {
        const data = localStorage.getItem(`doncorleone_${key}`);
        return data ? JSON.parse(data) : defaultData;
    } catch (e) {
        console.error('Error cargando:', e);
        return defaultData;
    }
}

// ============================================
// CONFETI
// ============================================
export function crearConfeti(cantidad = 50) {
    const colores = ['#00ff88', '#ffd700', '#ff3355', '#4a8aff', '#7c3aed', '#ff6b35', '#ffffff'];
    
    for (let i = 0; i < cantidad; i++) {
        const pieza = document.createElement('div');
        pieza.className = 'confeti';
        pieza.style.left = Math.random() * 100 + 'vw';
        pieza.style.top = '-10px';
        pieza.style.background = colores[randomEntre(0, colores.length - 1)];
        pieza.style.transform = `rotate(${randomEntre(0, 360)}deg)`;
        pieza.style.animationDuration = (randomEntre(2, 4)) + 's';
        pieza.style.animationDelay = (Math.random() * 0.5) + 's';
        pieza.style.width = randomEntre(6, 12) + 'px';
        pieza.style.height = randomEntre(6, 12) + 'px';
        pieza.style.borderRadius = randomEntre(0, 1) ? '50%' : '2px';
        document.body.appendChild(pieza);
        
        setTimeout(() => pieza.remove(), 4000);
    }
}
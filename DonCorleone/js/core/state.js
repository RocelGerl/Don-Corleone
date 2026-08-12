// ============================================
// DON CORLEONE - ESTADO GLOBAL
// ============================================

export const state = {
    user: {
        nombre: 'Don Corleone',
        saldo: 100,
        avatar: '🕴️',
        partidasJugadas: 0,
        partidasGanadas: 0,
        racha: 0,
        tieneSalaGratis: false,
        tieneDobleApuesta: false
    },
    
    salas: [],
    salaActiva: null,
    
    ruleta: {
        girosDisponibles: 1,
        ultimoGiro: null,
        premioActivo: null,
        historial: []
    },
    
    historial: [],
    
    ui: {
        vista: 'lobby',
        loading: false
    }
};

// ============================================
// CONSTANTES
// ============================================
export const PREMIOS_RULETA = [
    { id: 'sala_gratis', nombre: '🎰 Sala Gratis', prob: 10, desc: 'Entra gratis a una sala', icono: '🎰' },
    { id: 'doble_apuesta', nombre: '🃏 Doble Apuesta', prob: 10, desc: 'Apuesta el doble sin pagar más', icono: '🃏' },
    { id: 'bonus_5', nombre: '⭐ Bonus 5 Bs', prob: 20, desc: '+5 Bs a tu saldo', icono: '⭐' },
    { id: 'bonus_10', nombre: '💎 Bonus 10 Bs', prob: 10, desc: '+10 Bs a tu saldo', icono: '💎' },
    { id: 'giro_extra', nombre: '🎯 Giro Extra', prob: 15, desc: 'Giras la ruleta otra vez', icono: '🎯' },
    { id: 'sin_premio', nombre: '😕 Sin premio', prob: 35, desc: 'Mejor suerte la próxima', icono: '😕' }
];

export const MONTOS_APUESTA = [5, 10, 50];
export const MAX_JUGADORES = 10;
export const MIN_JUGADORES = 5;
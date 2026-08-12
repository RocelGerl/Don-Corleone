// ============================================
// DON CORLEONE - RULETA
// ============================================

import { state, PREMIOS_RULETA } from '../core/state.js';
import { formatearMoneda, esHoy, crearConfeti } from '../utils/helpers.js';
import { actualizarState, navegar } from '../core/render.js';

export function Ruleta() {
    const container = document.createElement('div');
    container.className = 'animate__animated animate__fadeInUp';
    
    const puedeGirarGratis = !state.ruleta.ultimoGiro || !esHoy(state.ruleta.ultimoGiro);
    const premioActivo = state.ruleta.premioActivo;
    
    container.innerHTML = `
        <div class="row g-4 justify-content-center">
            <div class="col-12 text-center">
                <h1 style="color: var(--text-primary); font-weight: 800; font-size: 1.8rem;">
                    <i class="bi bi-dice-5" style="color: var(--green);"></i>
                    RULETA DE LA SUERTE
                    <small style="color: var(--text-muted); font-size: 0.8rem; font-weight: 400; display: block;">
                        ¡GIRA Y GANA!
                    </small>
                </h1>
                <div class="divider-casino"></div>
            </div>
            
            <div class="col-12 col-lg-6">
                <div class="card-casino text-center">
                    <div class="ruleta-wrapper">
                        <div class="ruleta-flecha">▼</div>
                        <canvas id="ruletaCanvas" class="ruleta-canvas" width="450" height="450"></canvas>
                    </div>
                    
                    <div class="mt-4 d-flex justify-content-center gap-3 flex-wrap">
                        <button class="btn-primary-casino" id="btnGirarGratis" ${!puedeGirarGratis ? 'disabled' : ''}>
                            <i class="bi bi-gift"></i>
                            ${puedeGirarGratis ? '🎰 Giro Gratis' : '⏳ Usado hoy'}
                        </button>
                        <button class="btn-gold-casino" id="btnGirarPremium" 
                                ${state.user.saldo < 2 ? 'disabled' : ''}>
                            <i class="bi bi-coin"></i>
                            Giro Premium (2 Bs)
                        </button>
                    </div>
                    
                    ${!puedeGirarGratis ? `
                        <small class="text-muted mt-2 d-block">⏳ Próximo giro gratis: mañana</small>
                    ` : ''}
                    ${state.user.saldo < 2 ? `
                        <small class="text-red mt-2 d-block">⚠️ Saldo insuficiente (mínimo 2 Bs)</small>
                    ` : ''}
                </div>
            </div>
            
            ${premioActivo ? `
                <div class="col-12 col-lg-6">
                    <div class="card-casino text-center" style="border-color: var(--green);">
                        <div style="display: inline-block; padding: 5px 20px; border-radius: 50px; background: var(--green); color: var(--bg-primary); font-weight: 700; font-size: 0.8rem;">
                            🎯 PREMIO ACTIVO
                        </div>
                        <div style="font-size: 4rem; animation: bounce-in 0.6s;">${premioActivo.icono}</div>
                        <h3 style="color: var(--text-primary);">${premioActivo.nombre}</h3>
                        <p style="color: var(--text-secondary);">${premioActivo.desc}</p>
                        <button class="btn-primary-casino" onclick="window.usarPremio()">
                            <i class="bi bi-check-lg"></i> Usar premio
                        </button>
                        <small class="text-muted mt-2 d-block">⏳ Expira en 24 horas</small>
                    </div>
                </div>
            ` : ''}
            
            <div class="col-12 col-lg-6">
                <div class="card-casino">
                    <h5 style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="bi bi-clock-history"></i> Historial de Giros
                    </h5>
                    
                    ${state.ruleta.historial.length > 0 ? `
                        <div style="max-height: 200px; overflow-y: auto;" class="mt-3">
                            ${state.ruleta.historial.slice(-10).reverse().map(giro => `
                                <div class="d-flex justify-content-between align-items-center py-2" style="border-bottom: 1px solid var(--border-color);">
                                    <div>
                                        <span style="font-size: 1.2rem;">${giro.premio.icono}</span>
                                        <span class="ms-2" style="color: var(--text-secondary);">${giro.premio.nombre}</span>
                                    </div>
                                    <small style="color: var(--text-muted);">
                                        ${new Date(giro.fecha).toLocaleDateString()}
                                    </small>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-center text-muted py-3">No has girado la ruleta aún</p>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // ============================================
    // LÓGICA DE LA RULETA CON CANVAS
    // ============================================
    setTimeout(() => {
        const canvas = document.getElementById('ruletaCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200;
        
        const premios = PREMIOS_RULETA;
        const segmentos = premios.length;
        const anguloPorSegmento = (2 * Math.PI) / segmentos;
        
        let rotacionActual = 0;
        let girando = false;
        
        const colores = [
            '#00ff88', '#ffd700', '#7c3aed', '#4a8aff',
            '#ff6b35', '#ff3355', '#00ff88', '#ffd700',
            '#7c3aed', '#4a8aff', '#ff6b35', '#ff3355'
        ];
        
        function dibujarRuleta(rotacion) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < segmentos; i++) {
                const anguloInicio = i * anguloPorSegmento + rotacion;
                const anguloFin = anguloInicio + anguloPorSegmento;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, anguloInicio, anguloFin);
                ctx.closePath();
                
                ctx.fillStyle = colores[i % colores.length];
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                const anguloMedio = anguloInicio + anguloPorSegmento / 2;
                const textoX = centerX + (radius * 0.7) * Math.cos(anguloMedio);
                const textoY = centerY + (radius * 0.7) * Math.sin(anguloMedio);
                
                ctx.save();
                ctx.translate(textoX, textoY);
                ctx.rotate(anguloMedio + Math.PI / 2);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(premios[i].icono, 0, 0);
                ctx.restore();
            }
            
            // Círculo central
            const gradiente = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
            gradiente.addColorStop(0, '#00ff88');
            gradiente.addColorStop(0.5, '#00cc6a');
            gradiente.addColorStop(1, '#00994d');
            ctx.beginPath();
            ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
            ctx.fillStyle = gradiente;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.fillStyle = '#0f0f1a';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('DON', centerX, centerY - 4);
            ctx.fillText('C.', centerX, centerY + 14);
        }
        
        function girarRuleta(tipo) {
            if (girando) return;
            girando = true;
            
            const giros = 6 + Math.random() * 4;
            const anguloExtra = Math.random() * 2 * Math.PI;
            const rotacionTotal = giros * 2 * Math.PI + anguloExtra;
            
            const inicio = performance.now();
            const duracion = 4000 + Math.random() * 1000;
            
            function animar(tiempo) {
                const progreso = Math.min((tiempo - inicio) / duracion, 1);
                const easing = 1 - Math.pow(1 - progreso, 3);
                const rotacionActual_ = rotacionActual + rotacionTotal * easing;
                
                dibujarRuleta(rotacionActual_);
                
                if (progreso < 1) {
                    requestAnimationFrame(animar);
                } else {
                    rotacionActual += rotacionTotal;
                    
                    const anguloFinal = rotacionActual % (2 * Math.PI);
                    const indice = Math.floor((anguloFinal / (2 * Math.PI)) * segmentos) % segmentos;
                    const premio = premios[indice];
                    
                    girando = false;
                    procesarPremio(premio, tipo);
                }
            }
            
            requestAnimationFrame(animar);
        }
        
        function procesarPremio(premio, tipo) {
            state.ruleta.historial.push({
                premio: premio,
                tipo: tipo,
                fecha: new Date().toISOString()
            });
            
            if (premio.id === 'sin_premio') {
                window.mostrarNotificacion('😕 No ganaste nada', 'info');
                actualizarState({ ruleta: state.ruleta });
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
            
            actualizarState({ user: state.user, ruleta: state.ruleta });
            
            setTimeout(() => {
                const nuevaVista = Ruleta();
                container.parentNode.replaceChild(nuevaVista, container);
            }, 500);
        }
        
        dibujarRuleta(0);
        
        document.getElementById('btnGirarGratis')?.addEventListener('click', () => {
            if (puedeGirarGratis) girarRuleta('gratis');
        });
        
        document.getElementById('btnGirarPremium')?.addEventListener('click', () => {
            if (state.user.saldo >= 2) girarRuleta('premium');
            else window.mostrarNotificacion('Saldo insuficiente', 'error');
        });
        
    }, 100);
    
    window.usarPremio = function() {
        const premio = state.ruleta.premioActivo;
        if (!premio) return;
        
        if (premio.id === 'sala_gratis') {
            state.user.tieneSalaGratis = true;
            state.ruleta.premioActivo = null;
            actualizarState({ user: state.user, ruleta: state.ruleta });
            window.mostrarNotificacion('🎰 Sala gratis activada', 'success');
            navegar('lobby');
        } else if (premio.id === 'doble_apuesta') {
            state.user.tieneDobleApuesta = true;
            state.ruleta.premioActivo = null;
            actualizarState({ user: state.user, ruleta: state.ruleta });
            window.mostrarNotificacion('🃏 Doble apuesta activada', 'success');
            navegar('lobby');
        }
    };
    
    return container;
}
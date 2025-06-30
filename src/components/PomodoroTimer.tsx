'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  workTime?: number; // en minutos
  breakTime?: number; // en minutos
}

export default function PomodoroTimer({ 
  workTime = 25, 
  breakTime = 5 
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [cycles, setCycles] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(workTime * 60);
    setIsWorkTime(true);
    setCycles(0);
  }, [workTime]);

  const switchMode = useCallback(() => {
    if (isWorkTime) {
      setTimeLeft(breakTime * 60);
      setIsWorkTime(false);
    } else {
      setTimeLeft(workTime * 60);
      setIsWorkTime(true);
      setCycles(prev => prev + 1);
    }
  }, [isWorkTime, workTime, breakTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer terminó
            setIsRunning(false);
            
            // Notificación del navegador
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(
                isWorkTime ? '¡Tiempo de trabajo terminado!' : '¡Tiempo de descanso terminado!',
                {
                  body: isWorkTime 
                    ? `Toma un descanso de ${breakTime} minutos` 
                    : `¡Volvamos al trabajo! ${workTime} minutos de enfoque`,
                  icon: '/favicon.ico',
                }
              );
            }

            // Auto-switch después de 2 segundos
            setTimeout(() => {
              switchMode();
              setIsRunning(true);
            }, 2000);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, isWorkTime, workTime, breakTime, switchMode]);

  // Solicitar permisos de notificación
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getProgressPercentage = () => {
    const totalTime = isWorkTime ? workTime * 60 : breakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">
          {isWorkTime ? '⏰ Tiempo de Trabajo' : '☕ Tiempo de Descanso'}
        </h3>
        
        {/* Timer Display */}
        <div className="mb-6">
          <div className="text-4xl font-mono font-bold text-gray-800 mb-2">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isWorkTime ? 'bg-primary-600' : 'bg-success-600'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="btn-primary flex items-center space-x-2"
            >
              <Play size={16} />
              <span>Iniciar</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="btn-warning flex items-center space-x-2"
            >
              <Pause size={16} />
              <span>Pausar</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reiniciar</span>
          </button>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600">
          <p>Ciclos completados: {cycles}</p>
          <p className="mt-1">
            {isWorkTime 
              ? `Trabajo: ${workTime} min` 
              : `Descanso: ${breakTime} min`
            }
          </p>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            {isWorkTime 
              ? '💡 Enfócate en una sola tarea durante este tiempo'
              : '💡 Levántate, estírate o toma un respiro'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 
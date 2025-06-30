import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FocusUp</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm font-medium">
              🚀 Demo Beta
            </span>
            <Link 
              href="/dashboard" 
              className="btn-primary"
            >
              Probar ahora
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-warning-100 text-warning-800 rounded-full text-sm font-medium mb-4">
              🚀 Versión Beta - ¡Prueba la IA en acción!
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organiza tu trabajo con
            <span className="text-primary-600 block">inteligencia artificial</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            FocusUp combina la técnica Pomodoro con IA avanzada para ayudarte a dividir tareas complejas 
            en pasos manejables. Maximiza tu productividad, reduce la procrastinación y mantén el enfoque 
            en lo que realmente importa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/dashboard" 
              className="btn-primary text-lg px-8 py-4"
            >
              Comenzar gratis
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Ver demo
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué elegir FocusUp?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Productividad 3x</h3>
              <p className="text-gray-600">
                Usuarios reportan un aumento del 300% en su productividad gracias a la combinación 
                de IA y técnica Pomodoro.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Menos Estrés</h3>
              <p className="text-gray-600">
                Divide tareas abrumadoras en pasos manejables. Reduce la ansiedad y aumenta 
                tu confianza para completar proyectos.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enfoque Total</h3>
              <p className="text-gray-600">
                Elimina distracciones con sesiones de trabajo enfocado. La técnica Pomodoro 
                te ayuda a mantener la concentración.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Progreso Visible</h3>
              <p className="text-gray-600">
                Visualiza tu progreso en tiempo real. Celebra cada subtarea completada 
                y mantén la motivación alta.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Temporizador Pomodoro</h3>
            <p className="text-gray-600">
              Ciclos de 25 minutos de trabajo enfocado seguidos de descansos de 5 minutos 
              para mantener tu energía y concentración. Personalizable según tus necesidades.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">IA Inteligente</h3>
            <p className="text-gray-600">
              Divide automáticamente tareas complejas en subtareas manejables usando 
              inteligencia artificial avanzada. Aprende de tus patrones de trabajo.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Gestión Completa</h3>
            <p className="text-gray-600">
              Organiza tareas por prioridad, estado y fecha. Visualiza tu progreso 
              y mantén el control de todos tus proyectos en un solo lugar.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Cómo funciona?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Crea una tarea</h4>
              <p className="text-sm text-gray-600">
                Describe lo que necesitas hacer con detalle
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Divide con IA</h4>
              <p className="text-sm text-gray-600">
                Automáticamente se crean subtareas específicas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Usa el temporizador</h4>
              <p className="text-sm text-gray-600">
                Enfócate en cada subtarea con sesiones Pomodoro
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Completa y celebra</h4>
              <p className="text-sm text-gray-600">
                Marca como completada y continúa con la siguiente
              </p>
            </div>
          </div>
        </div>

        {/* Demo Status Section */}
        <div className="card bg-gradient-to-r from-warning-50 to-warning-100 border-warning-200 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-warning-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Esta es una Demo Beta!
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              FocusUp está actualmente en desarrollo activo. Esta versión demo te permite experimentar 
              con la funcionalidad principal de IA y Pomodoro. Tus datos se guardan localmente y 
              se reinician al cerrar la sesión.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">✅ Lo que funciona:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Generación de subtareas con IA</li>
                  <li>• Temporizador Pomodoro</li>
                  <li>• Gestión básica de tareas</li>
                  <li>• Interfaz responsive</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-2">🔄 En desarrollo:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Persistencia de datos</li>
                  <li>• Estadísticas avanzadas</li>
                  <li>• Notificaciones</li>
                  <li>• Integraciones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Roadmap - Lo que viene
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">Q1</span>
                </div>
                <h3 className="text-xl font-semibold">Fase 1: Fundación</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• Base de datos persistente</li>
                <li>• Sistema de usuarios</li>
                <li>• Autenticación segura</li>
                <li>• Sincronización en la nube</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-warning-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">Q2</span>
                </div>
                <h3 className="text-xl font-semibold">Fase 2: Inteligencia</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• IA más avanzada</li>
                <li>• Análisis de productividad</li>
                <li>• Recomendaciones personalizadas</li>
                <li>• Integración con calendarios</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">Q3</span>
                </div>
                <h3 className="text-xl font-semibold">Fase 3: Colaboración</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• Trabajo en equipo</li>
                <li>• Compartir tareas</li>
                <li>• Notificaciones push</li>
                <li>• API pública</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card text-center bg-primary-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para ser más productivo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de personas que ya están maximizando su productividad con FocusUp. 
            ¡Prueba la demo gratuita ahora!
          </p>
          <Link 
            href="/dashboard" 
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Comenzar ahora - Es gratis
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <span className="text-xl font-bold">FocusUp</span>
          </div>
          <p className="text-gray-400 mb-4">
            Maximiza tu productividad con IA y la técnica Pomodoro
          </p>
          <div className="text-sm text-gray-500 mb-4">
            © 2024 FocusUp. Hecho con ❤️ para mejorar tu productividad.
          </div>
          <div className="text-xs text-gray-600">
            Versión Beta - En desarrollo activo
          </div>
        </div>
      </footer>
    </div>
  );
} 
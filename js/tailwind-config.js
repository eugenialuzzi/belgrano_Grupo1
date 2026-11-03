tailwind.config = {
  theme: {
    screens: {
      sm: '600px',
      md: '900px',
      lg: '1200px'
    },
    extend: {
      colors: {
        primario: '#5CA4D6',
        'primario-oscuro': '#2B6C9B',
        secundario: '#7A7E83',
        verde: '#2F6A34',
        'verde-agua': '#54A58C',
        fondo: '#F8F9FA',
        texto: '#2C3035',
        suave: '#5F666E',
        borde: '#E2E8F0',
        'texto-pie': '#C5C9CE',
        alerta: '#FEF3C7',
        'alerta-texto': '#92400E',
        error: '#FEE2E2',
        'error-texto': '#991B1B'
      },
      fontFamily: {
        titulo: ['Gabarito', 'Trebuchet MS', 'sans-serif'],
        marca: ['Montserrat', 'Arial', 'sans-serif'],
        texto: ['Open Sans', 'Arial', 'sans-serif']
      },
      borderRadius: {
        tarjeta: '12px',
        boton: '24px'
      },
      boxShadow: {
        tarjeta: '0 4px 12px rgba(0, 0, 0, 0.08)',
        'tarjeta-hover': '0 8px 16px rgba(0, 0, 0, 0.12)'
      },
      maxWidth: {
        contenedor: '1280px'
      }
    }
  }
};

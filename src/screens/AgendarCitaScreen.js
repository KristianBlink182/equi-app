import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Generar 5 fechas seguras de calendario sin etiquetas HTML
const generarDiasSeguros = () => {
  const fechas = [];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    fechas.push({
      esHoy: i === 0,
      diaSemana: i === 0 ? 'Hoy' : diasSemana[d.getDay()],
      diaNumero: d.getDate(),
      mes: meses[d.getMonth()],
      fechaTexto: `${d.getDate()} de ${meses[d.getMonth()]}`
    });
  }
  return fechas;
};

// Horarios base sugeridos
const HORARIOS_SUGERIDOS = [
  { label: '09:00 AM', hora24: 9 },
  { label: '11:00 AM', hora24: 11 },
  { label: '02:00 PM', hora24: 14 },
  { label: '04:00 PM', hora24: 16 },
  { label: '06:00 PM', hora24: 18 },
  { label: '08:00 PM', hora24: 20 }
];

export default function AgendarCitaScreen({ volver, seleccionado, confirmarCita }) {
  const listaDias = generarDiasSeguros();
  const [diaElegido, setDiaElegido] = useState(listaDias[0].fechaTexto);
  const [esHoy, setEsHoy] = useState(true);
  const [horaElegida, setHoraElegida] = useState('10:00 AM');
  const [modalidad, setModalidad] = useState('presencial');

  // Filtrar horas que ya pasaron si el día seleccionado es hoy
  const horaActual = new Date().getHours();
  const horasFiltradas = HORARIOS_SUGERIDOS.filter(h => !esHoy || h.hora24 > horaActual);

  const seleccionarDia = (item) => {
    setDiaElegido(item.fechaTexto);
    setEsHoy(item.esHoy);
  };

  const handleConfirmar = () => {
    if (!horaElegida.trim()) {
      Alert.alert('Horario Requerido', 'Por favor escribe o selecciona la hora de tu consulta.');
      return;
    }
    if (confirmarCita) {
      confirmarCita(diaElegido, horaElegida, modalidad);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Agendar Fecha & Hora</Text>
      </View>

      <ScrollView style={{ padding: 20 }}>
        {/* 1. SELECCIÓN DE DÍA */}
        <Text style={styles.label}>1. Elige el Día en el Calendario:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarioRow}>
          {listaDias.map((item, index) => {
            const activo = diaElegido === item.fechaTexto;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.diaCard, activo && styles.diaCardActivo]}
                onPress={() => seleccionarDia(item)}
              >
                <Text style={[styles.diaSemana, activo && styles.textoActivo]}>{item.diaSemana}</Text>
                <Text style={[styles.diaNumero, activo && styles.textoActivo]}>{item.diaNumero}</Text>
                <Text style={[styles.diaMes, activo && styles.textoActivo]}>{item.mes}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 2. ESCRITURA Y SELECCIÓN DE HORA */}
        <Text style={[styles.label, { marginTop: 20 }]}>2. Escribe o Elige la Hora Exacta:</Text>
        <TextInput 
          style={styles.inputHora} 
          value={horaElegida} 
          onChangeText={setHoraElegida} 
          placeholder="Ej. 10:30 AM / 04:15 PM" 
        />
        
        {/* Botones de sugerencia rápida */}
        <View style={styles.chipsHoras}>
          {horasFiltradas.map((h) => {
            const activa = horaElegida === h.label;
            return (
              <TouchableOpacity 
                key={h.label} 
                style={[styles.chipHora, activa && styles.chipHoraActiva]} 
                onPress={() => setHoraElegida(h.label)}
              >
                <Text style={[styles.chipHoraText, activa && styles.chipHoraTextActiva]}>{h.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. MODALIDAD */}
        <Text style={[styles.label, { marginTop: 20 }]}>3. Modalidad:</Text>
        <View style={styles.rowModalidad}>
          <TouchableOpacity style={[styles.chipMod, modalidad === 'presencial' && styles.chipModActivo]} onPress={() => setModalidad('presencial')}>
            <Text style={[styles.chipModText, modalidad === 'presencial' && styles.chipModTextActivo]}>🏥 Presencial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.chipMod, modalidad === 'virtual' && styles.chipModActivo]} onPress={() => setModalidad('virtual')}>
            <Text style={[styles.chipModText, modalidad === 'virtual' && styles.chipModTextActivo]}>💻 Online</Text>
          </TouchableOpacity>
        </View>

        {/* RESUMEN NATIVO SEGURO */}
        <View style={styles.resumenCard}>
          <Text style={styles.resumenTitulo}>Resumen de tu Consulta:</Text>
          <Text style={styles.resumenDetalle}>
            📅 <Text style={{ fontWeight: 'bold' }}>{diaElegido}</Text> a las <Text style={{ fontWeight: 'bold' }}>{horaElegida}</Text>
          </Text>
          <Text style={styles.resumenDetalle}>👨‍⚕️ {seleccionado?.nombre || 'Especialista'}</Text>
          <Text style={styles.resumenPrecio}>Total: S/. {seleccionado?.precio_consulta || '0.00'}</Text>
        </View>

        <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirmar}>
          <Text style={styles.btnConfirmarText}>Confirmar Cita & Recordatorio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  label: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
  calendarioRow: { flexDirection: 'row', gap: 10, paddingVertical: 6 },
  diaCard: { width: 70, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center', marginRight: 10 },
  diaCardActivo: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  diaSemana: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  diaNumero: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
  diaMes: { fontSize: 11, color: '#9CA3AF' },
  textoActivo: { color: '#fff' },
  inputHora: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, fontWeight: 'bold', color: '#111827' },
  chipsHoras: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chipHora: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  chipHoraActiva: { backgroundColor: '#3B82F6' },
  chipHoraText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 12 },
  chipHoraTextActiva: { color: '#fff' },
  rowModalidad: { flexDirection: 'row', gap: 10 },
  chipMod: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  chipModActivo: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  chipModText: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
  chipModTextActivo: { color: '#fff' },
  resumenCard: { backgroundColor: '#EFF6FF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#BFDBFE', marginTop: 24 },
  resumenTitulo: { fontSize: 15, fontWeight: 'bold', color: '#1E40AF', marginBottom: 6 },
  resumenDetalle: { fontSize: 14, color: '#1E293B', marginBottom: 4 },
  resumenPrecio: { fontSize: 18, fontWeight: 'bold', color: '#10B981', marginTop: 6 },
  btnConfirmar: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  btnConfirmarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
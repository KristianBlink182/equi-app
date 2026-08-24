import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

// URL OFICIAL DE PRODUCCIÓN
const API_CITAS_DOC = 'https://sistema.equi.com.pe/citas_doctor.php';

export default function PanelDoctorScreen({ volver, doctorId = 1, doctorNombre = "Especialista Equi" }) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitas = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_CITAS_DOC}?accion=listar&doctor_id=${doctorId}`);
      const data = await res.json();
      setCitas(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert('Aviso', 'No se pudieron sincronizar las citas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const cambiarEstadoCita = async (citaId, nuevoEstado) => {
    try {
      const res = await fetch(`${API_CITAS_DOC}?accion=actualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cita_id: citaId, estado: nuevoEstado })
      });
      const data = await res.json();
      if (data.status === 'success') {
        cargarCitas();
      }
    } catch (e) {}
  };

  const contactarPaciente = (telefono, nombre) => {
    if (!telefono) {
      Alert.alert('Atención', 'El paciente no registró un número de teléfono.');
      return;
    }
    const telLimpio = telefono.replace(/[^0-9]/g, '');
    const msg = `Hola ${nombre}, te saluda tu especialista de Equi para coordinar nuestra sesión.`;
    Linking.openURL(`whatsapp://send?phone=${telLimpio}&text=${encodeURI(msg)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={styles.btnVolver}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.navbarTitle}>Mi Catálogo de Citas</Text>
          <Text style={styles.navbarSub}>{doctorNombre}</Text>
        </View>
      </View>

      <View style={styles.container}>
        {cargando ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={{ marginTop: 12, color: '#6B7280' }}>Cargando agenda de pacientes...</Text>
          </View>
        ) : citas.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Sin citas por ahora</Text>
            <Text style={styles.emptyText}>Las solicitudes de tus pacientes aparecerán aquí en tiempo real.</Text>
          </View>
        ) : (
          <FlatList
            data={citas}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <View style={styles.cardCita}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.pacienteNombre}>{item.paciente_nombre}</Text>
                    <Text style={styles.pacienteDni}>DNI: {item.paciente_dni || 'No registrado'}</Text>
                  </View>
                  <View style={[
                    styles.badgeEstado,
                    item.estado === 'confirmada' ? styles.badgeConfirmada : 
                    item.estado === 'cancelada' ? styles.badgeCancelada : styles.badgePendiente
                  ]}>
                    <Text style={[
                      styles.badgeEstadoText,
                      item.estado === 'confirmada' ? { color: '#065F46' } : 
                      item.estado === 'cancelada' ? { color: '#991B1B' } : { color: '#92400E' }
                    ]}>
                      {item.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time" size={16} color="#3B82F6" />
                  <Text style={styles.infoText}>Horario: <Text style={{ fontWeight: 'bold' }}>{item.fecha_cita} • {item.hora_cita}</Text></Text>
                </View>

                <View style={styles.infoRow}>
                  <FontAwesome5 name={item.modalidad === 'presencial' ? 'hospital' : 'video'} size={14} color="#10B981" />
                  <Text style={styles.infoText}>Modalidad: <Text style={{ fontWeight: 'bold' }}>{item.modalidad.toUpperCase()}</Text></Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.btnWhatsapp}
                    onPress={() => contactarPaciente(item.paciente_telefono, item.paciente_nombre)}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                    <Text style={styles.btnWhatsappText}>WhatsApp</Text>
                  </TouchableOpacity>

                  {item.estado === 'pendiente' && (
                    <>
                      <TouchableOpacity 
                        style={styles.btnAceptar}
                        onPress={() => cambiarEstadoCita(item.id, 'confirmada')}
                      >
                        <Text style={styles.btnAceptarText}>Aceptar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.btnRechazar}
                        onPress={() => cambiarEstadoCita(item.id, 'cancelada')}
                      >
                        <Text style={styles.btnRechazarText}>Rechazar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  btnVolver: { padding: 6, marginRight: 10 },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  navbarSub: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 12 },
  emptyText: { color: '#6B7280', fontSize: 14, marginTop: 6, textAlign: 'center', paddingHorizontal: 30 },
  cardCita: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#F3F4F6', paddingBottom: 10, marginBottom: 10 },
  pacienteNombre: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  pacienteDni: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badgeEstado: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgePendiente: { backgroundColor: '#FEF3C7' },
  badgeConfirmada: { backgroundColor: '#D1FAE5' },
  badgeCancelada: { backgroundColor: '#FEE2E2' },
  badgeEstadoText: { fontSize: 11, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  infoText: { fontSize: 13, color: '#374151' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderColor: '#F3F4F6' },
  btnWhatsapp: { flex: 1, backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  btnWhatsappText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  btnAceptar: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  btnAceptarText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  btnRechazar: { backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  btnRechazarText: { color: '#fff', fontSize: 13, fontWeight: 'bold' }
});
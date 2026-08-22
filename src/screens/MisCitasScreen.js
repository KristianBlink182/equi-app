import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MisCitasScreen({ misCitas, cancelarCita, irAHome }) {
  return (
    <View style={{ flex: 1, paddingBottom: 90 }}>
      <View style={styles.navbarSimple}>
        <Text style={styles.navbarTitle}>Mis Citas Programadas</Text>
      </View>
      {misCitas.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
          <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 16 }}>Aún no tienes citas agendadas.</Text>
          <TouchableOpacity style={styles.btnIrAHome} onPress={irAHome}>
            <Text style={styles.btnIrAHomeText}>Explorar Especialistas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={misCitas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.citaCard}>
              <Image source={{ uri: item.foto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }} style={styles.citaFoto} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.citaDoctor}>{item.profesional}</Text>
                  <Text style={[styles.badgeEstadoText, item.estado === 'cancelada' ? { color: '#EF4444' } : { color: '#10B981' }]}>
                    {item.estado ? item.estado.toUpperCase() : 'PENDIENTE'}
                  </Text>
                </View>
                <Text style={styles.citaEsp}>{item.especialidad}</Text>
                
                <View style={styles.citaFechaBadge}>
                  <Ionicons name="time-outline" size={14} color="#1E40AF" />
                  <Text style={styles.citaFechaText}>{item.fecha} • {item.hora}</Text>
                </View>

                {item.estado !== 'cancelada' && (
                  <TouchableOpacity style={styles.btnCancelarPaciente} onPress={() => cancelarCita(item.id)}>
                    <Text style={styles.btnCancelarPacienteText}>Cancelar Cita</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarSimple: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  btnIrAHome: { marginTop: 16, backgroundColor: '#3B82F6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  btnIrAHomeText: { color: '#fff', fontWeight: 'bold' },
  citaCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  citaFoto: { width: 70, height: 70, borderRadius: 12 },
  citaDoctor: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  citaEsp: { fontSize: 13, color: '#3B82F6', marginTop: 2 },
  badgeEstadoText: { fontSize: 11, fontWeight: 'bold' },
  citaFechaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 6 },
  citaFechaText: { fontSize: 12, fontWeight: '600', color: '#1E40AF' },
  btnCancelarPaciente: { marginTop: 10, alignSelf: 'flex-start' },
  btnCancelarPacienteText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' }
});
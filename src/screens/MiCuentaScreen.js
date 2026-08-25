import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MiCuentaScreen({ usuario, esDoctor, irAPanelDoctor, irAEditarDoctor, cerrarSesion }) {
  const abrirWebMembresias = () => {
    Linking.openURL('https://sistema.equi.com.pe/membresia.php');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatarCircle, esDoctor && { backgroundColor: '#059669' }]}>
          <Text style={styles.avatarLetra}>{usuario?.nombre ? usuario.nombre.charAt(0) : (esDoctor ? 'Dr' : 'U')}</Text>
        </View>
        <Text style={styles.nombreUser}>{usuario?.nombre || (esDoctor ? 'Dra. Laura Morales' : 'Paciente')}</Text>
        <View style={styles.dniBadge}>
          <Ionicons name={esDoctor ? "medkit" : "id-card"} size={16} color="#4B5563" />
          <Text style={styles.dniText}>
            {esDoctor ? `Colegiatura: ${usuario?.colegiatura || 'C.Ps.P 24510'}` : `DNI: ${usuario?.dni || 'Registrado'}`}
          </Text>
        </View>
      </View>

      {/* CENTRO DE CONTROL DEL ESPECIALISTA */}
      {esDoctor && (
        <View style={styles.proPanelBox}>
          <Text style={styles.proPanelTitle}>🛠️ Mi Centro de Control Profesional</Text>

          <TouchableOpacity style={styles.btnDoctorAction} onPress={irAPanelDoctor}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="calendar" size={22} color="#3B82F6" />
              <View>
                <Text style={styles.btnDoctorActionTitle}>Mi Catálogo de Citas</Text>
                <Text style={styles.btnDoctorActionSub}>Ver agenda y pacientes que solicitaron consulta</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnDoctorAction} onPress={irAEditarDoctor}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="create" size={22} color="#8B5CF6" />
              <View>
                <Text style={styles.btnDoctorActionTitle}>Editar Mi Foto, Tarifa y Bio</Text>
                <Text style={styles.btnDoctorActionSub}>Actualiza tu precio por sesión y presentación</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnDoctorAction, { borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' }]} onPress={abrirWebMembresias}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="star" size={22} color="#059669" />
              <View>
                <Text style={[styles.btnDoctorActionTitle, { color: '#065F46' }]}>Plan de Membresía</Text>
                <Text style={styles.btnDoctorActionSub}>Ver vigencia o activar Promo 12 meses S/. 300</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={18} color="#059669" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.btnCerrarSesion} onPress={cerrarSesion}>
        <Text style={styles.btnCerrarSesionText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  cardHeader: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarLetra: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  nombreUser: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  dniBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  dniText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  proPanelBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5 },
  proPanelTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  btnDoctorAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFF6FF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 10 },
  btnDoctorActionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E40AF' },
  btnDoctorActionSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  btnCerrarSesion: { paddingVertical: 20, alignItems: 'center', marginTop: 20 },
  btnCerrarSesionText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 }
});
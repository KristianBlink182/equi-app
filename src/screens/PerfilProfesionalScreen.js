import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform, Share } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

export default function PerfilProfesionalScreen({ volver, seleccionado, irAChat, irAAgendar }) {
  const compartir = async () => {
    try {
      await Share.share({
        message: `¡Te recomiendo a ${seleccionado.nombre} (${seleccionado.especialidad}) en la App Equi!`,
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Perfil Profesional</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', padding: 6 }} onPress={compartir}>
          <Feather name="share-2" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: seleccionado.foto_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }} style={styles.avatarBig} />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
            <Text style={styles.verifiedText}>Especialista Verificado por Equi</Text>
          </View>
          <Text style={styles.perfilNombre}>{seleccionado.nombre}</Text>
          <Text style={styles.perfilEsp}>{seleccionado.especialidad}</Text>
          <Text style={styles.perfilEducacion}>🎓 {seleccionado.educacion}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⭐ {seleccionado.estrellas}</Text>
            <Text style={styles.statLabel}>{seleccionado.total_resenas} Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seleccionado.experiencia_anios}+ Años</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{seleccionado.distancia_km} km</Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Sobre el especialista</Text>
          <Text style={styles.bioText}>{seleccionado.biografia}</Text>
        </View>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Modalidades de Atención</Text>
          <View style={styles.rowCardsModalidad}>
            <View style={styles.modalidadPill}>
              <FontAwesome5 name="hospital-user" size={16} color="#3B82F6" />
              <Text style={styles.modalidadPillText}>Presencial en Consultorio</Text>
            </View>
            <View style={[styles.modalidadPill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Ionicons name="videocam" size={18} color="#10B981" />
              <Text style={[styles.modalidadPillText, { color: '#065F46' }]}>Cita Online por Videollamada</Text>
            </View>
          </View>
          <Text style={styles.direccionText}>📍 {seleccionado.direccion}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnChatSecundario} onPress={irAChat}>
          <Ionicons name="chatbubbles" size={22} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAgendarPrincipal} onPress={irAAgendar}>
          <Text style={styles.btnAgendarPrincipalText}>Agendar Cita • S/. {seleccionado.precio_consulta}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  profileHeader: { alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  avatarBig: { width: 110, height: 110, borderRadius: 55, marginBottom: 10 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  verifiedText: { fontSize: 12, color: '#1D4ED8', fontWeight: '600' },
  perfilNombre: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  perfilEsp: { fontSize: 15, color: '#3B82F6', fontWeight: '500', marginTop: 2 },
  perfilEducacion: { fontSize: 13, color: '#6B7280', marginTop: 6 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginTop: 8, paddingVertical: 16, justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB' },
  sectionBox: { backgroundColor: '#fff', marginTop: 10, padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  rowCardsModalidad: { gap: 8, marginVertical: 8 },
  modalidadPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EFF6FF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#DBEAFE' },
  modalidadPillText: { fontSize: 13, fontWeight: '600', color: '#1E40AF' },
  direccionText: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderColor: '#E5E7EB' },
  btnChatSecundario: { width: 50, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  btnAgendarPrincipal: { flex: 1, backgroundColor: '#3B82F6', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnAgendarPrincipalText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
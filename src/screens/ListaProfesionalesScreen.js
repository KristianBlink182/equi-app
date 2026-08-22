import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListaProfesionalesScreen({ volver, categoria, cargando, profesionales, verPerfil }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6, marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>
          {categoria === 'psicologo' ? 'Psicólogos' : 'Nutricionistas'} Cerca de Ti
        </Text>
      </View>

      {cargando ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /></View>
      ) : (
        <FlatList
          data={profesionales}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.proCard} onPress={() => verPerfil(item)}>
              <Image source={{ uri: item.foto_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }} style={styles.proImage} />
              <View style={styles.proInfo}>
                <View style={styles.rowBetween}>
                  <Text style={styles.proNombre}>{item.nombre}</Text>
                  <View style={styles.ratingBadge}><Ionicons name="star" size={13} color="#F59E0B" /><Text style={styles.ratingText}>{item.estrellas}</Text></View>
                </View>
                <Text style={styles.proEsp}>{item.especialidad}</Text>
                <Text style={styles.distanciaText}>📍 a {item.distancia_km} km • {item.modalidad.toUpperCase()}</Text>
                <View style={styles.footerCard}>
                  <Text style={styles.precioText}>S/. {item.precio_consulta} /sesión</Text>
                  <Text style={styles.verPerfilLink}>Ver Perfil →</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  proCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, padding: 14, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6 },
  proImage: { width: 90, height: 90, borderRadius: 14 },
  proInfo: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  proNombre: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 3 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#B45309' },
  proEsp: { fontSize: 13, color: '#3B82F6', fontWeight: '500' },
  distanciaText: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  precioText: { fontSize: 15, fontWeight: 'bold', color: '#10B981' },
  verPerfilLink: { fontSize: 13, fontWeight: '600', color: '#3B82F6' }
});
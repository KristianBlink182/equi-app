import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ usuario, buscarProfesionales }) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
      <View style={styles.headerHome}>
        <Image source={require('../../assets/logo.png')} style={styles.logoCenter} resizeMode="contain" />
        <Text style={styles.saludoUser}>¡Hola, {usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Bienvenido'}! 👋</Text>
        <Text style={styles.titleApp}>¿Qué área de tu vida deseas potenciar hoy?</Text>
        <Text style={styles.subtitleApp}>Elige una especialidad para encontrar a tu profesional ideal más cercano</Text>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.cardSelect, { backgroundColor: '#F0F5FF', borderColor: '#C7D2FE' }]} onPress={() => buscarProfesionales('psicologo')}>
          <View style={[styles.iconCircle, { backgroundColor: '#3B82F6' }]}>
            <MaterialCommunityIcons name="brain" size={40} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Salud Mental & Psicología</Text>
          <Text style={styles.cardDesc}>Supera la ansiedad, estrés, terapia individual o de pareja con expertos</Text>
          <View style={styles.cardFooterTag}>
            <Text style={styles.cardFooterTagText}>Ver especialistas cercanos →</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cardSelect, { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' }]} onPress={() => buscarProfesionales('nutricionista')}>
          <View style={[styles.iconCircle, { backgroundColor: '#10B981' }]}>
            <MaterialCommunityIcons name="food-apple" size={40} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Nutrición & Bienestar Físico</Text>
          <Text style={styles.cardDesc}>Planes de alimentación a tu medida, nutrición clínica y deportiva</Text>
          <View style={[styles.cardFooterTag, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.cardFooterTagText, { color: '#065F46' }]}>Ver especialistas cercanos →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerHome: { paddingHorizontal: 24, marginTop: 10, marginBottom: 20, alignItems: 'center' },
  logoCenter: { width: 170, height: 75, marginBottom: 10 },
  saludoUser: { fontSize: 15, fontWeight: '600', color: '#3B82F6', marginBottom: 4 },
  titleApp: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  subtitleApp: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 6 },
  gridContainer: { paddingHorizontal: 20, gap: 16 },
  cardSelect: { padding: 22, borderRadius: 24, borderWidth: 1.5, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 19, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' },
  cardDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  cardFooterTag: { marginTop: 14, backgroundColor: '#E0E7FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  cardFooterTagText: { fontSize: 12, fontWeight: 'bold', color: '#3730A3' }
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_ACTUALIZAR_DOC = 'https://sistema.equi.com.pe/actualizar_doctor.php';

export default function PerfilDoctorEditarScreen({ volver, doctor, setDoctor }) {
  const [especialidad, setEspecialidad] = useState(doctor?.especialidad || 'Psicología Clínica');
  const [telefono, setTelefono] = useState(doctor?.telefono || '997415600');
  const [precio, setPrecio] = useState(doctor?.precio_consulta ? String(doctor.precio_consulta) : '50.00');
  const [biografia, setBiografia] = useState(doctor?.biografia || '');
  const [fotoUri, setFotoUri] = useState(doctor?.foto_url || null);
  const [guardando, setGuardando] = useState(false);

  const cambiarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setFotoUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const res = await fetch(API_ACTUALIZAR_DOC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctor?.id || 1,
          especialidad,
          telefono,
          precio,
          biografia,
          foto_url: fotoUri
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (setDoctor) setDoctor({ ...doctor, especialidad, telefono, precio_consulta: precio, biografia, foto_url: fotoUri });
        Alert.alert('¡Actualizado! 🎉', 'Tus datos profesionales se guardaron correctamente.');
        volver();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={volver} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Editar Mi Perfil Profesional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* FOTO DE PERFIL */}
        <View style={styles.fotoCenter}>
          <TouchableOpacity onPress={cambiarFoto} style={styles.fotoBox}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.fotoImg} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Ionicons name="camera" size={30} color="#3B82F6" />
                <Text style={styles.fotoText}>Cambiar Foto</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.fotoHint}>Toca para cambiar tu foto de perfil</Text>
        </View>

        {/* CAMPOS PROTEGIDOS */}
        <View style={styles.bloqueProtegido}>
          <Text style={styles.protLabel}>🔒 Datos Oficiales Protegidos:</Text>
          <Text style={styles.protVal}>Nombre: {doctor?.nombre || 'Dra. Laura Morales'}</Text>
          <Text style={styles.protVal}>Colegiatura: {doctor?.colegiatura || 'C.Ps.P 24510'} (Validada)</Text>
        </View>

        <Text style={styles.label}>Especialidad Principal:</Text>
        <TextInput style={styles.input} value={especialidad} onChangeText={setEspecialidad} placeholder="Ej. Terapia de Pareja" />

        <Text style={styles.label}>WhatsApp de Contacto:</Text>
        <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

        <Text style={styles.label}>Precio de Consulta (S/.):</Text>
        <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />

        <Text style={styles.label}>Presentación / Biografía:</Text>
        <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }]} multiline value={biografia} onChangeText={setBiografia} placeholder="Describe tu experiencia..." />

        <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnGuardarText}>Guardar Cambios 🚀</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 12 : 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  container: { padding: 20, paddingBottom: 60 },
  fotoCenter: { alignItems: 'center', marginBottom: 18 },
  fotoBox: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', borderWidth: 2.5, borderColor: '#3B82F6', backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  fotoImg: { width: '100%', height: '100%' },
  fotoPlaceholder: { alignItems: 'center' },
  fotoText: { fontSize: 11, color: '#3B82F6', fontWeight: 'bold', marginTop: 4 },
  fotoHint: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  bloqueProtegido: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  protLabel: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginBottom: 4 },
  protVal: { fontSize: 13, color: '#1E293B', fontWeight: '600' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827' },
  btnGuardar: { backgroundColor: '#10B981', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  btnGuardarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});